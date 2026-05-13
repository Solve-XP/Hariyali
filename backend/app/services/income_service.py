from bson import ObjectId

from datetime import (
    datetime,
    time
)

from fastapi import HTTPException
from fastapi import status

from app.db.database import (
    incomes_collection,
    farms_collection,
    crop_collection
)

from app.repositories.income_repo import (
    IncomeRepository
)

from app.utils.financial_year import (
    get_financial_year_from_date
)


class IncomeService:

    def __init__(self):

        self.income_repo = (
            IncomeRepository(
                incomes_collection
            )
        )

    async def create_income(
        self,
        user_id: str,
        data
    ):

        if data.harvest_quantity <= 0:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Harvest quantity must be greater than 0"
            )

        if data.amount <= 0:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Amount must be greater than 0"
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
            data.income_date.date()
        )

        income_day = data.income_date.date()

        start_of_day = datetime.combine(
            income_day,
            time.min
        )

        end_of_day = datetime.combine(
            income_day,
            time.max
        )

        existing_income = await incomes_collection.find_one({

            "user_id": user_id,

            "farm_id": data.farm_id,

            "crop_id": data.crop_id,

            "harvest_quantity": data.harvest_quantity,

            "amount": data.amount,

            "income_date": {
                "$gte": start_of_day,
                "$lte": end_of_day
            },

            "is_deleted": False
        })

        if existing_income:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Similar income record already exists"
            )

        income_data = {

            "user_id": user_id,

            "farm_id": data.farm_id,

            "crop_id": data.crop_id,

            "financial_year": financial_year,

            "harvest_quantity": data.harvest_quantity,

            "unit": data.unit,

            "amount": data.amount,

            "income_date": data.income_date,

            "notes": data.notes,

            "is_deleted": False,

            "created_at": datetime.utcnow(),

            "updated_at": datetime.utcnow()
        }

        income_id = await self.income_repo.create_income(
            income_data
        )

        return {
            "message": "Income added successfully",
            "income_id": income_id
        }

    async def get_all_incomes(
        self,
        user_id: str,
        farm_id: str = None,
        crop_id: str = None,
        financial_year: str = None,
        search: str = None
    ):

        return await self.income_repo.get_all_incomes(
            user_id=user_id,
            farm_id=farm_id,
            crop_id=crop_id,
            financial_year=financial_year,
            search=search
        )

    async def get_income_by_id(
        self,
        income_id: str,
        user_id: str
    ):

        income = await self.income_repo.get_income_by_id(
            income_id,
            user_id
        )

        if not income:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Income not found"
            )

        return income

    async def update_income(
        self,
        income_id: str,
        user_id: str,
        data
    ):

        income = await self.income_repo.get_income_by_id(
            income_id,
            user_id
        )

        if not income:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Income not found"
            )

        update_data = data.dict(
            exclude_unset=True
        )

        if "harvest_quantity" in update_data:

            if update_data["harvest_quantity"] <= 0:

                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Harvest quantity must be greater than 0"
                )

        if "amount" in update_data:

            if update_data["amount"] <= 0:

                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Amount must be greater than 0"
                )

        final_farm_id = update_data.get(
            "farm_id",
            income["farm_id"]
        )

        final_crop_id = update_data.get(
            "crop_id",
            income["crop_id"]
        )

        if "farm_id" in update_data:

            farm = await farms_collection.find_one({
                "_id": ObjectId(final_farm_id),
                "user_id": user_id,
                "is_deleted": False
            })

            if not farm:

                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Farm not found"
                )

        crop = await crop_collection.find_one({
            "_id": ObjectId(final_crop_id),
            "farm_id": final_farm_id,
            "user_id": user_id,
            "is_deleted": False
        })

        if not crop:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Crop not found"
            )

        final_income_date = update_data.get(
            "income_date",
            income["income_date"]
        )

        update_data["financial_year"] = (
            get_financial_year_from_date(
                final_income_date.date()
            )
        )

        income_day = final_income_date.date()

        start_of_day = datetime.combine(
            income_day,
            time.min
        )

        end_of_day = datetime.combine(
            income_day,
            time.max
        )

        final_quantity = update_data.get(
            "harvest_quantity",
            income["harvest_quantity"]
        )

        final_amount = update_data.get(
            "amount",
            income["amount"]
        )

        existing_income = await incomes_collection.find_one({

            "_id": {
                "$ne": ObjectId(income_id)
            },

            "user_id": user_id,

            "farm_id": final_farm_id,

            "crop_id": final_crop_id,

            "harvest_quantity": final_quantity,

            "amount": final_amount,

            "income_date": {
                "$gte": start_of_day,
                "$lte": end_of_day
            },

            "is_deleted": False
        })

        if existing_income:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Similar income record already exists"
            )

        modified_count = await self.income_repo.update_income(
            income_id,
            user_id,
            update_data
        )

        if modified_count == 0:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Income not updated"
            )

        return {
            "message": "Income updated successfully"
        }

    async def delete_income(
        self,
        income_id: str,
        user_id: str
    ):

        income = await self.income_repo.get_income_by_id(
            income_id,
            user_id
        )

        if not income:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Income not found"
            )

        modified_count = await self.income_repo.delete_income(
            income_id,
            user_id
        )

        if modified_count == 0:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Income not deleted"
            )

        return {
            "message": "Income deleted successfully"
        }