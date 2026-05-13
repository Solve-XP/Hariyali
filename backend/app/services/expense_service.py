from bson import ObjectId

from datetime import (
    datetime,
    time
)

from fastapi import HTTPException
from fastapi import status

from app.core.constants import (
    EXPENSE_CATEGORIES,
    PAYMENT_METHODS
)

from app.db.database import (
    expenses_collection,
    farms_collection,
    crop_collection
)

from app.repositories.expense_repo import (
    ExpenseRepository
)

from app.utils.financial_year import (
    get_financial_year_from_date
)


class ExpenseService:

    def __init__(self):

        self.expense_repo = (
            ExpenseRepository(
                expenses_collection
            )
        )

    async def create_expense(
        self,
        user_id: str,
        data
    ):

        if data.category not in EXPENSE_CATEGORIES:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid expense category"
            )

        if data.payment_method not in PAYMENT_METHODS:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid payment method"
            )

        if data.amount <= 0:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Amount must be greater than 0"
            )

        if data.quantity is not None:

            if data.quantity <= 0:

                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Quantity must be greater than 0"
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

        if data.crop_id:

            crop = await crop_collection.find_one({
                "_id": ObjectId(data.crop_id),
                "user_id": user_id,
                "farm_id": data.farm_id,
                "is_deleted": False
            })

            if not crop:

                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Crop not found"
                )

        financial_year = get_financial_year_from_date(
            data.expense_date.date()
        )

        expense_day = data.expense_date.date()

        start_of_day = datetime.combine(
            expense_day,
            time.min
        )

        end_of_day = datetime.combine(
            expense_day,
            time.max
        )

        existing_expense = await expenses_collection.find_one({

            "user_id": user_id,

            "farm_id": data.farm_id,

            "crop_id": data.crop_id,

            "category": data.category,

            "item_name": data.item_name,

            "quantity": data.quantity,

            "amount": data.amount,

            "expense_date": {
                "$gte": start_of_day,
                "$lte": end_of_day
            },

            "is_deleted": False
        })

        if existing_expense:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Similar expense record already exists"
            )

        expense_data = {

            "user_id": user_id,

            "farm_id": data.farm_id,

            "crop_id": data.crop_id,

            "financial_year": financial_year,

            "category": data.category,

            "item_name": data.item_name,

            "quantity": data.quantity,

            "unit": data.unit,

            "amount": data.amount,

            "payment_method": data.payment_method,

            "expense_date": data.expense_date,

            "notes": data.notes,

            "is_deleted": False,

            "created_at": datetime.utcnow(),

            "updated_at": datetime.utcnow()
        }

        expense_id = await self.expense_repo.create_expense(
            expense_data
        )

        return {
            "message": "Expense added successfully",
            "expense_id": expense_id
        }

    async def get_all_expenses(
        self,
        user_id: str,
        farm_id: str = None,
        crop_id: str = None,
        financial_year: str = None,
        category: str = None,
        search: str = None
    ):

        return await self.expense_repo.get_all_expenses(
            user_id=user_id,
            farm_id=farm_id,
            crop_id=crop_id,
            financial_year=financial_year,
            category=category,
            search=search
        )

    async def get_expense_by_id(
        self,
        expense_id: str,
        user_id: str
    ):

        expense = await self.expense_repo.get_expense_by_id(
            expense_id,
            user_id
        )

        if not expense:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Expense not found"
            )

        return expense

    async def update_expense(
        self,
        expense_id: str,
        user_id: str,
        data
    ):

        expense = await self.expense_repo.get_expense_by_id(
            expense_id,
            user_id
        )

        if not expense:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Expense not found"
            )

        update_data = data.dict(
            exclude_unset=True
        )

        if "category" in update_data:

            if update_data["category"] not in EXPENSE_CATEGORIES:

                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid expense category"
                )

        if "payment_method" in update_data:

            if update_data["payment_method"] not in PAYMENT_METHODS:

                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid payment method"
                )

        if "amount" in update_data:

            if update_data["amount"] <= 0:

                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Amount must be greater than 0"
                )

        if "quantity" in update_data:

            if update_data["quantity"] <= 0:

                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Quantity must be greater than 0"
                )

        final_farm_id = update_data.get(
            "farm_id",
            expense["farm_id"]
        )

        final_crop_id = update_data.get(
            "crop_id",
            expense["crop_id"]
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

        if final_crop_id:

            crop = await crop_collection.find_one({
                "_id": ObjectId(final_crop_id),
                "user_id": user_id,
                "farm_id": final_farm_id,
                "is_deleted": False
            })

            if not crop:

                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Crop not found"
                )

        final_expense_date = update_data.get(
            "expense_date",
            expense["expense_date"]
        )

        update_data["financial_year"] = (
            get_financial_year_from_date(
                final_expense_date.date()
            )
        )

        expense_day = final_expense_date.date()

        start_of_day = datetime.combine(
            expense_day,
            time.min
        )

        end_of_day = datetime.combine(
            expense_day,
            time.max
        )

        final_category = update_data.get(
            "category",
            expense["category"]
        )

        final_item_name = update_data.get(
            "item_name",
            expense["item_name"]
        )

        final_quantity = update_data.get(
            "quantity",
            expense["quantity"]
        )

        final_amount = update_data.get(
            "amount",
            expense["amount"]
        )

        existing_expense = await expenses_collection.find_one({

            "_id": {
                "$ne": ObjectId(expense_id)
            },

            "user_id": user_id,

            "farm_id": final_farm_id,

            "crop_id": final_crop_id,

            "category": final_category,

            "item_name": final_item_name,

            "quantity": final_quantity,

            "amount": final_amount,

            "expense_date": {
                "$gte": start_of_day,
                "$lte": end_of_day
            },

            "is_deleted": False
        })

        if existing_expense:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Similar expense record already exists"
            )

        modified_count = await self.expense_repo.update_expense(
            expense_id,
            user_id,
            update_data
        )

        if modified_count == 0:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Expense not updated"
            )

        return {
            "message": "Expense updated successfully"
        }

    async def delete_expense(
        self,
        expense_id: str,
        user_id: str
    ):

        expense = await self.expense_repo.get_expense_by_id(
            expense_id,
            user_id
        )

        if not expense:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Expense not found"
            )

        modified_count = await self.expense_repo.delete_expense(
            expense_id,
            user_id
        )

        if modified_count == 0:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Expense not deleted"
            )

        return {
            "message": "Expense deleted successfully"
        }