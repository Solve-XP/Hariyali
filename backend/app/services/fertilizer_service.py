from bson import ObjectId

from datetime import datetime

from fastapi import HTTPException
from fastapi import status

from app.db.database import (
    fertilizers_collection,
    farms_collection,
    crop_collection
)

from app.repositories.fertilizer_repo import (
    FertilizerRepository
)

from app.utils.financial_year import (
    get_financial_year_from_date
)


class FertilizerService:

    def __init__(self):

        self.fertilizer_repo = (
            FertilizerRepository(
                fertilizers_collection
            )
        )

    async def create_fertilizer(
        self,
        user_id: str,
        data
    ):

        if data.quantity <= 0:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Quantity must be greater than 0"
            )

        if data.cost < 0:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cost cannot be negative"
            )

        farm = await farms_collection.find_one({
            "_id": ObjectId(data.farm_id),
            "user_id": user_id,
            "is_deleted": False
        })

        if not farm:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Farm not found"
            )

        crop = await crop_collection.find_one({
            "_id": ObjectId(data.crop_id),
            "farm_id": data.farm_id,
            "user_id": user_id,
            "is_deleted": False
        })

        if not crop:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Crop not found"
            )

        financial_year = get_financial_year_from_date(
            data.application_date.date()
        )

        fertilizer_data = {

            "user_id": user_id,

            "farm_id": data.farm_id,

            "crop_id": data.crop_id,

            "financial_year": financial_year,

            "fertilizer_name": data.fertilizer_name,

            "quantity": data.quantity,

            "unit": data.unit,

            "cost": data.cost,

            "application_date": data.application_date,

            "notes": data.notes,

            "is_deleted": False,

            "created_at": datetime.utcnow(),

            "updated_at": datetime.utcnow()
        }

        fertilizer_id = await self.fertilizer_repo.create_fertilizer(
            fertilizer_data
        )

        return {
            "message": "Fertilizer added successfully",
            "fertilizer_id": fertilizer_id
        }

    async def get_all_fertilizers(
        self,
        user_id: str,
        farm_id: str = None,
        crop_id: str = None,
        financial_year: str = None,
        search: str = None
    ):

        fertilizers = await self.fertilizer_repo.get_all_fertilizers(
            user_id=user_id,
            farm_id=farm_id,
            crop_id=crop_id,
            financial_year=financial_year,
            search=search
        )

        return fertilizers

    async def get_fertilizer_by_id(
        self,
        fertilizer_id: str,
        user_id: str
    ):

        fertilizer = await self.fertilizer_repo.get_fertilizer_by_id(
            fertilizer_id,
            user_id
        )

        if not fertilizer:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Fertilizer not found"
            )

        return fertilizer

    async def update_fertilizer(
        self,
        fertilizer_id: str,
        user_id: str,
        data
    ):

        fertilizer = await self.fertilizer_repo.get_fertilizer_by_id(
            fertilizer_id,
            user_id
        )

        if not fertilizer:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Fertilizer not found"
            )

        update_data = data.dict(
            exclude_unset=True
        )

        if "quantity" in update_data:

            if update_data["quantity"] <= 0:

                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Quantity must be greater than 0"
                )

        if "cost" in update_data:

            if update_data["cost"] < 0:

                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Cost cannot be negative"
                )

        if "application_date" in update_data:

            update_data["financial_year"] = (
                get_financial_year_from_date(
                    update_data["application_date"].date()
                )
            )

        modified_count = await self.fertilizer_repo.update_fertilizer(
            fertilizer_id,
            user_id,
            update_data
        )

        if modified_count == 0:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Fertilizer not updated"
            )

        return {
            "message": "Fertilizer updated successfully"
        }

    async def delete_fertilizer(
        self,
        fertilizer_id: str,
        user_id: str
    ):

        fertilizer = await self.fertilizer_repo.get_fertilizer_by_id(
            fertilizer_id,
            user_id
        )

        if not fertilizer:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Fertilizer not found"
            )

        modified_count = await self.fertilizer_repo.delete_fertilizer(
            fertilizer_id,
            user_id
        )

        if modified_count == 0:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Fertilizer not deleted"
            )

        return {
            "message": "Fertilizer deleted successfully"
        }