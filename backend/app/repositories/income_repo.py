from bson import ObjectId

from datetime import datetime

from app.utils.search import (
    build_search_query
)


class IncomeRepository:

    def __init__(self, collection):

        self.collection = collection

    async def create_income(
        self,
        income_data: dict
    ):

        result = await self.collection.insert_one(
            income_data
        )

        return str(result.inserted_id)

    async def get_all_incomes(
        self,
        user_id: str,
        farm_id: str = None,
        crop_id: str = None,
        financial_year: str = None,
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

        search_query = build_search_query(
            "unit",
            search
        )

        query.update(search_query)

        incomes = await self.collection.find(
            query
        ).to_list(length=None)

        formatted_incomes = []

        for income in incomes:

            income["id"] = str(
                income["_id"]
            )

            income.pop("_id")

            formatted_incomes.append(
                income
            )

        return formatted_incomes

    async def get_income_by_id(
        self,
        income_id: str,
        user_id: str
    ):

        income = await self.collection.find_one({
            "_id": ObjectId(income_id),
            "user_id": user_id,
            "is_deleted": False
        })

        if income:

            income["id"] = str(
                income["_id"]
            )

            income.pop("_id")

        return income

    async def update_income(
        self,
        income_id: str,
        user_id: str,
        update_data: dict
    ):

        update_data["updated_at"] = datetime.utcnow()

        result = await self.collection.update_one(
            {
                "_id": ObjectId(income_id),
                "user_id": user_id,
                "is_deleted": False
            },
            {
                "$set": update_data
            }
        )

        return result.modified_count

    async def delete_income(
        self,
        income_id: str,
        user_id: str
    ):

        result = await self.collection.update_one(
            {
                "_id": ObjectId(income_id),
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