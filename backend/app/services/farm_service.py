from datetime import datetime

from fastapi import (
    HTTPException,
    UploadFile
)

from app.integrations.s3 import upload_file_to_s3

from app.utils.validators import (
    validate_image_type
)

from app.utils.normalize import (
    normalize_text
)


class FarmService:

    def __init__(self, repo):
        self.repo = repo

    async def create_farm(
        self,
        user_id: str,
        payload,
        farm_photo: UploadFile
    ):

        normalized_farm_name = normalize_text(
            payload.farm_name
        )

        normalized_location = normalize_text(
            payload.location
        )

        existing_farm = await self.repo.check_duplicate_farm(
            user_id=user_id,
            farm_name=normalized_farm_name,
            location=normalized_location
        )

        if existing_farm:

            raise HTTPException(
                status_code=409,
                detail="Farm already exists"
            )

        if not validate_image_type(
            farm_photo.content_type
        ):

            raise HTTPException(
                status_code=400,
                detail="Invalid image type"
            )

        image_url = await upload_file_to_s3(
            farm_photo,
            folder="farms"
        )

        farm_data = {
            "user_id": user_id,
            "farm_name": normalized_farm_name,
            "acres": payload.acres,
            "location": normalized_location,
            "soil_type": payload.soil_type,
            "farm_photo": image_url,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "is_deleted": False
        }

        farm_id = await self.repo.create_farm(
            farm_data
        )

        return {
            "message": "Farm created successfully",
            "farm_id": farm_id
        }

    async def get_all_farms(
        self,
        user_id: str,
        search: str = None
    ):

        farms = await self.repo.get_all_farms(
            user_id=user_id,
            search=search
        )

        formatted_farms = []

        for farm in farms:

            formatted_farms.append({
                "id": str(farm["_id"]),
                "farm_name": farm["farm_name"],
                "acres": farm["acres"],
                "location": farm["location"],
                "soil_type": farm["soil_type"],
                "farm_photo": farm.get("farm_photo"),
                "created_at": farm.get("created_at")
            })

        return formatted_farms

    async def get_farm_by_id(
        self,
        farm_id: str,
        user_id: str
    ):

        farm = await self.repo.get_farm_by_id(
            farm_id,
            user_id
        )

        if not farm:

            raise HTTPException(
                status_code=404,
                detail="Farm not found"
            )

        return {
            "id": str(farm["_id"]),
            "farm_name": farm["farm_name"],
            "acres": farm["acres"],
            "location": farm["location"],
            "soil_type": farm["soil_type"],
            "farm_photo": farm.get("farm_photo"),
            "created_at": farm.get("created_at"),
            "updated_at": farm.get("updated_at")
        }

    async def update_farm(
        self,
        farm_id: str,
        user_id: str,
        payload,
        farm_photo: UploadFile = None
    ):

        existing_farm = await self.repo.get_farm_by_id(
            farm_id,
            user_id
        )

        if not existing_farm:

            raise HTTPException(
                status_code=404,
                detail="Farm not found"
            )

        update_data = payload.dict(
            exclude_unset=True,
            exclude_none=True
        )

        final_farm_name = normalize_text(
            update_data.get(
                "farm_name",
                existing_farm["farm_name"]
            )
        )

        final_location = normalize_text(
            update_data.get(
                "location",
                existing_farm["location"]
            )
        )

        update_data["farm_name"] = final_farm_name
        update_data["location"] = final_location

        duplicate_farm = await self.repo.check_duplicate_farm_for_update(
            farm_id=farm_id,
            user_id=user_id,
            farm_name=final_farm_name,
            location=final_location
        )

        if duplicate_farm:

            raise HTTPException(
                status_code=409,
                detail="Farm already exists"
            )

        if farm_photo:

            if not validate_image_type(
                farm_photo.content_type
            ):

                raise HTTPException(
                    status_code=400,
                    detail="Invalid image type"
                )

            image_url = await upload_file_to_s3(
                farm_photo,
                folder="farms"
            )

            update_data["farm_photo"] = image_url

        update_data["updated_at"] = datetime.utcnow()

        updated = await self.repo.update_farm(
            farm_id,
            user_id,
            update_data
        )

        if not updated:

            raise HTTPException(
                status_code=404,
                detail="Farm not found"
            )

        return {
            "message": "Farm updated successfully"
        }

    async def delete_farm(
        self,
        farm_id: str,
        user_id: str
    ):

        deleted = await self.repo.delete_farm(
            farm_id,
            user_id
        )

        if not deleted:

            raise HTTPException(
                status_code=404,
                detail="Farm not found"
            )

        return {
            "message": "Farm deleted successfully"
        }