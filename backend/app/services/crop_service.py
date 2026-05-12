from datetime import datetime

from fastapi import HTTPException

from app.utils.financial_year import (
    get_financial_year_from_date
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

        financial_year = (
            get_financial_year_from_date(
                payload.sowing_date
            )
        )

        crop_data = {
            "user_id": user_id,
            "farm_id": payload.farm_id,

            "financial_year":
                financial_year,

            "crop_name":
                payload.crop_name,

            "season":
                payload.season,

            "sowing_date": datetime.combine(
                payload.sowing_date,
                datetime.min.time()
            ),

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

        update_data = payload.dict(
            exclude_unset=True,
            exclude_none=True
        )

        if (
            "sowing_date"
            in update_data
        ):

            update_data[
                "financial_year"
            ] = (
                get_financial_year_from_date(
                    update_data[
                        "sowing_date"
                    ]
                )
            )

            update_data[
                "sowing_date"
            ] = datetime.combine(
                update_data[
                    "sowing_date"
                ],
                datetime.min.time()
            )

        if (
            "expected_harvest_date"
            in update_data
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