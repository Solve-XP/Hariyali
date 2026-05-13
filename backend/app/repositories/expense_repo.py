from bson import ObjectId

from datetime import datetime

from app.utils.search import (
    build_search_query
)


class ExpenseRepository:

    def __init__(self, collection):

        self.collection = collection

    async def create_expense(
        self,
        expense_data: dict
    ):

        result = await self.collection.insert_one(
            expense_data
        )

        return str(result.inserted_id)

    async def get_all_expenses(
        self,
        user_id: str,
        farm_id: str = None,
        crop_id: str = None,
        financial_year: str = None,
        category: str = None,
        search: str = None
    ):

        query = {
            "user_id": user_id,
            "is_deleted": False
        }

        if farm_id:

            query["farm_id"] = farm_id

        if crop_id:

            query["crop_id"] = crop_id

        if financial_year:

            query["financial_year"] = financial_year

        if category:

            query["category"] = category

        search_query = build_search_query(
            "item_name",
            search
        )

        query.update(search_query)

        expenses = await self.collection.find(
            query
        ).to_list(length=None)

        formatted_expenses = []

        for expense in expenses:

            expense["id"] = str(
                expense["_id"]
            )

            expense.pop("_id")

            formatted_expenses.append(
                expense
            )

        return formatted_expenses

    async def get_expense_by_id(
        self,
        expense_id: str,
        user_id: str
    ):

        expense = await self.collection.find_one({
            "_id": ObjectId(expense_id),
            "user_id": user_id,
            "is_deleted": False
        })

        if expense:

            expense["id"] = str(
                expense["_id"]
            )

            expense.pop("_id")

        return expense

    async def update_expense(
        self,
        expense_id: str,
        user_id: str,
        update_data: dict
    ):

        update_data["updated_at"] = datetime.utcnow()

        result = await self.collection.update_one(
            {
                "_id": ObjectId(expense_id),
                "user_id": user_id,
                "is_deleted": False
            },
            {
                "$set": update_data
            }
        )

        return result.modified_count

    async def delete_expense(
        self,
        expense_id: str,
        user_id: str
    ):

        result = await self.collection.update_one(
            {
                "_id": ObjectId(expense_id),
                "user_id": user_id
            },
            {
                "$set": {
                    "is_deleted": True,
                    "updated_at": datetime.utcnow()
                }
            }
        )

        return result.modified_count