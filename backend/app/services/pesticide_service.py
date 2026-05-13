from bson import ObjectId

from datetime import datetime

from fastapi import HTTPException
from fastapi import status

from app.db.database import (
    pesticides_collection
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

        financial_year = get_financial_year_from_date(
            data.application_date.date()
        )

        existing_pesticide = await pesticides_collection.find_one({

            "user_id": user_id,

            "financial_year": financial_year,

            "pesticide_name": data.pesticide_name,

            "quantity": data.quantity,

            "application_date": data.application_date,

            "is_deleted": False
        })

        if existing_pesticide:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Similar pesticide record already exists"
            )

        pesticide_data = {

            "user_id": user_id,

            "financial_year": financial_year,

            "pesticide_name": data.pesticide_name,

            "quantity": data.quantity,

            "unit": data.unit,

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
        financial_year: str = None,
        search: str = None
    ):

        return await self.pesticide_repo.get_all_pesticides(
            user_id=user_id,
            financial_year=financial_year,
            search=search
        )

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

        final_application_date = update_data.get(
            "application_date",
            pesticide["application_date"]
        )

        final_financial_year = get_financial_year_from_date(
            final_application_date.date()
        )

        final_pesticide_name = update_data.get(
            "pesticide_name",
            pesticide["pesticide_name"]
        )

        final_quantity = update_data.get(
            "quantity",
            pesticide["quantity"]
        )

        existing_pesticide = await pesticides_collection.find_one({

            "_id": {
                "$ne": ObjectId(pesticide_id)
            },

            "user_id": user_id,

            "financial_year": final_financial_year,

            "pesticide_name": final_pesticide_name,

            "quantity": final_quantity,

            "application_date": final_application_date,

            "is_deleted": False
        })

        if existing_pesticide:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Similar pesticide record already exists"
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