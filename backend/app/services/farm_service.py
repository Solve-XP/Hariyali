from datetime import datetime

from fastapi import (
    HTTPException,
    UploadFile
)

from app.integrations.s3 import upload_file_to_s3


ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp"
]


class FarmService:

    def __init__(self, repo):
        self.repo = repo

    async def create_farm(
        self,
        user_id: str,
        payload,
        farm_photo: UploadFile
    ):

        if farm_photo.content_type not in ALLOWED_IMAGE_TYPES:

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
            "farm_name": payload.farm_name,
            "acres": payload.acres,
            "location": payload.location,
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
                "farm_photo": farm.get("farm_photo")
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
            "farm_photo": farm.get("farm_photo")
        }

    async def update_farm(
        self,
        farm_id: str,
        user_id: str,
        payload,
        farm_photo: UploadFile = None
    ):

        update_data = payload.dict(
            exclude_unset=True,
            exclude_none=True
        )

        if farm_photo:

            if farm_photo.content_type not in ALLOWED_IMAGE_TYPES:

                raise HTTPException(
                    status_code=400,
                    detail="Invalid image type"
                )

            image_url = await upload_file_to_s3(
                farm_photo,
                folder="farms"
            )

            update_data["farm_photo"] = image_url

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