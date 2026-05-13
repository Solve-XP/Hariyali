from bson import ObjectId

from datetime import datetime

from fastapi import HTTPException
from fastapi import status

from app.db.database import (
    pesticides_collection,
    farms_collection,
    crop_collection
)

from app.repositories.pesticide_repo import (
    PesticideRepository
)

from app.utils.financial_year import (
    get_financial_year_from_date
)


class PesticideService:

    def __init__(self):

        self.pesticide_repo = (
            PesticideRepository(
                pesticides_collection
            )
        )

    async def create_pesticide(
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

        pesticide_data = {

            "user_id": user_id,

            "farm_id": data.farm_id,

            "crop_id": data.crop_id,

            "financial_year": financial_year,

            "pesticide_name": data.pesticide_name,

            "quantity": data.quantity,

            "unit": data.unit,

            "cost": data.cost,

            "application_date": data.application_date,

            "notes": data.notes,

            "is_deleted": False,

            "created_at": datetime.utcnow(),

            "updated_at": datetime.utcnow()
        }

        pesticide_id = await self.pesticide_repo.create_pesticide(
            pesticide_data
        )

        return {
            "message": "Pesticide added successfully",
            "pesticide_id": pesticide_id
        }

    async def get_all_pesticides(
        self,
        user_id: str,
        farm_id: str = None,
        crop_id: str = None,
        financial_year: str = None,
        search: str = None
    ):

        pesticides = await self.pesticide_repo.get_all_pesticides(
            user_id=user_id,
            farm_id=farm_id,
            crop_id=crop_id,
            financial_year=financial_year,
            search=search
        )

        return pesticides

    async def get_pesticide_by_id(
        self,
        pesticide_id: str,
        user_id: str
    ):

        pesticide = await self.pesticide_repo.get_pesticide_by_id(
            pesticide_id,
            user_id
        )

        if not pesticide:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Pesticide not found"
            )

        return pesticide

    async def update_pesticide(
        self,
        pesticide_id: str,
        user_id: str,
        data
    ):

        pesticide = await self.pesticide_repo.get_pesticide_by_id(
            pesticide_id,
            user_id
        )

        if not pesticide:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Pesticide not found"
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

        modified_count = await self.pesticide_repo.update_pesticide(
            pesticide_id,
            user_id,
            update_data
        )

        if modified_count == 0:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Pesticide not updated"
            )

        return {
            "message": "Pesticide updated successfully"
        }

    async def delete_pesticide(
        self,
        pesticide_id: str,
        user_id: str
    ):

        pesticide = await self.pesticide_repo.get_pesticide_by_id(
            pesticide_id,
            user_id
        )

        if not pesticide:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Pesticide not found"
            )

        modified_count = await self.pesticide_repo.delete_pesticide(
            pesticide_id,
            user_id
        )

        if modified_count == 0:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Pesticide not deleted"
            )

        return {
            "message": "Pesticide deleted successfully"
        }