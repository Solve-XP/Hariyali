from datetime import datetime

from fastapi import HTTPException

from app.utils.financial_year import (
    get_financial_year_from_date
)

from app.utils.normalize import (
    normalize_text
)


class CropService:

    def __init__(self, repo):

        self.repo = repo

    async def create_crop(
        self,
        user_id: str,
        payload
    ):

        if (
            payload.expected_harvest_date
            and
            payload.sowing_date >
            payload.expected_harvest_date
        ):

            raise HTTPException(
                status_code=400,
                detail="Invalid harvest date"
            )

        financial_year = normalize_text(
            get_financial_year_from_date(
                payload.sowing_date
            )
        )

        normalized_crop_name = normalize_text(
            payload.crop_name
        )

        normalized_season = normalize_text(
            payload.season
        )

        normalized_sowing_date = datetime.combine(
            payload.sowing_date,
            datetime.min.time()
        )

        existing_crop = await self.repo.check_duplicate_crop(
            user_id=user_id,
            farm_id=payload.farm_id,
            financial_year=financial_year,
            crop_name=normalized_crop_name,
            season=normalized_season,
            sowing_date=normalized_sowing_date
        )

        if existing_crop:

            raise HTTPException(
                status_code=409,
                detail="Crop already exists"
            )

        crop_data = {
            "user_id": user_id,

            "farm_id":
                payload.farm_id,

            "financial_year":
                financial_year,

            "crop_name":
                normalized_crop_name,

            "season":
                normalized_season,

            "sowing_date":
                normalized_sowing_date,

            "expected_harvest_date": (
                datetime.combine(
                    payload.expected_harvest_date,
                    datetime.min.time()
                )
                if payload.expected_harvest_date
                else None
            ),

            "created_at":
                datetime.utcnow(),

            "updated_at":
                datetime.utcnow(),

            "is_deleted": False
        }

        crop_id = await self.repo.create_crop(
            crop_data
        )

        return {
            "message":
                "Crop created successfully",

            "crop_id": crop_id
        }

    async def get_all_crops(
        self,
        user_id: str,
        search: str = None,
        farm_id: str = None,
        season: str = None,
        financial_year: str = None
    ):

        crops = await self.repo.get_all_crops(
            user_id=user_id,
            search=search,
            farm_id=farm_id,
            season=season,
            financial_year=financial_year
        )

        formatted_crops = []

        for crop in crops:

            formatted_crops.append({
                "id": str(crop["_id"]),

                "farm_id":
                    crop["farm_id"],

                "financial_year":
                    crop["financial_year"],

                "crop_name":
                    crop["crop_name"],

                "season":
                    crop["season"],

                "sowing_date":
                    crop["sowing_date"],

                "expected_harvest_date":
                    crop.get(
                        "expected_harvest_date"
                    )
            })

        return formatted_crops

    async def get_crop_by_id(
        self,
        crop_id: str,
        user_id: str
    ):

        crop = await self.repo.get_crop_by_id(
            crop_id,
            user_id
        )

        if not crop:

            raise HTTPException(
                status_code=404,
                detail="Crop not found"
            )

        return {
            "id": str(crop["_id"]),

            "farm_id":
                crop["farm_id"],

            "financial_year":
                crop["financial_year"],

            "crop_name":
                crop["crop_name"],

            "season":
                crop["season"],

            "sowing_date":
                crop["sowing_date"],

            "expected_harvest_date":
                crop.get(
                    "expected_harvest_date"
                )
        }

    async def update_crop(
        self,
        crop_id: str,
        user_id: str,
        payload
    ):

        existing_crop = await self.repo.get_crop_by_id(
            crop_id,
            user_id
        )

        if not existing_crop:

            raise HTTPException(
                status_code=404,
                detail="Crop not found"
            )

        update_data = payload.dict(
            exclude_unset=True,
            exclude_none=True
        )

        sowing_date_changed = (
            "sowing_date" in update_data
        )

        harvest_date_changed = (
            "expected_harvest_date"
            in update_data
        )

        sowing_date = update_data.get(
            "sowing_date",
            existing_crop["sowing_date"]
        )

        expected_harvest_date = update_data.get(
            "expected_harvest_date",
            existing_crop.get(
                "expected_harvest_date"
            )
        )

        if not isinstance(
            sowing_date,
            datetime
        ):

            sowing_date = datetime.combine(
                sowing_date,
                datetime.min.time()
            )

        if (
            expected_harvest_date
            and
            not isinstance(
                expected_harvest_date,
                datetime
            )
        ):

            expected_harvest_date = datetime.combine(
                expected_harvest_date,
                datetime.min.time()
            )

        if (
            expected_harvest_date
            and
            sowing_date > expected_harvest_date
        ):

            raise HTTPException(
                status_code=400,
                detail="Invalid harvest date"
            )

        financial_year = normalize_text(
            get_financial_year_from_date(
                sowing_date
            )
        )

        final_crop_name = normalize_text(
            update_data.get(
                "crop_name",
                existing_crop["crop_name"]
            )
        )

        final_season = normalize_text(
            update_data.get(
                "season",
                existing_crop["season"]
            )
        )

        final_sowing_date = update_data.get(
            "sowing_date",
            existing_crop["sowing_date"]
        )

        if not isinstance(
            final_sowing_date,
            datetime
        ):

            final_sowing_date = datetime.combine(
                final_sowing_date,
                datetime.min.time()
            )

        requires_duplicate_check = any([
            "farm_id" in update_data,
            "crop_name" in update_data,
            "season" in update_data,
            "sowing_date" in update_data
        ])

        if requires_duplicate_check:

            duplicate_crop = await self.repo.check_duplicate_crop_for_update(
                crop_id=crop_id,
                user_id=user_id,
                farm_id=update_data.get(
                    "farm_id",
                    existing_crop["farm_id"]
                ),
                financial_year=financial_year,
                crop_name=final_crop_name,
                season=final_season,
                sowing_date=final_sowing_date
            )

            if duplicate_crop:

                raise HTTPException(
                    status_code=409,
                    detail="Crop already exists"
                )

        update_data["financial_year"] = (
            financial_year
        )

        update_data["crop_name"] = (
            final_crop_name
        )

        update_data["season"] = (
            final_season
        )

        if sowing_date_changed:

            update_data[
                "sowing_date"
            ] = final_sowing_date

        if (
            harvest_date_changed
            and
            update_data[
                "expected_harvest_date"
            ]
        ):

            update_data[
                "expected_harvest_date"
            ] = datetime.combine(
                update_data[
                    "expected_harvest_date"
                ],
                datetime.min.time()
            )

        updated = await self.repo.update_crop(
            crop_id,
            user_id,
            update_data
        )

        if not updated:

            raise HTTPException(
                status_code=404,
                detail="Crop not found"
            )

        return {
            "message":
                "Crop updated successfully"
        }

    async def delete_crop(
        self,
        crop_id: str,
        user_id: str
    ):

        deleted = await self.repo.delete_crop(
            crop_id,
            user_id
        )

        if not deleted:

            raise HTTPException(
                status_code=404,
                detail="Crop not found"
            )

        return {
            "message":
                "Crop deleted successfully"
        }