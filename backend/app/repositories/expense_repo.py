from bson import ObjectId
from bson.errors import InvalidId

from datetime import (
    datetime,
    time
)

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

    async def check_duplicate_expense(
        self,
        user_id: str,
        farm_id: str,
        crop_id: str,
        category: str,
        normalized_item_name: str,
        quantity,
        amount,
        expense_date: datetime
    ):

        expense_day = expense_date.date()

        start_of_day = datetime.combine(
            expense_day,
            time.min
        )

        end_of_day = datetime.combine(
            expense_day,
            time.max
        )

        expense = await self.collection.find_one({

            "user_id": user_id,

            "farm_id": farm_id,

            "crop_id": crop_id,

            "category": category,

            "normalized_item_name":
                normalized_item_name,

            "quantity": quantity,

            "amount": amount,

            "expense_date": {
                "$gte": start_of_day,
                "$lte": end_of_day
            },

            "is_deleted": False
        })

        return expense

    async def check_duplicate_expense_for_update(
        self,
        expense_id: str,
        user_id: str,
        farm_id: str,
        crop_id: str,
        category: str,
        normalized_item_name: str,
        quantity,
        amount,
        expense_date: datetime
    ):

        try:

            object_id = ObjectId(expense_id)

        except InvalidId:

            return None

        expense_day = expense_date.date()

        start_of_day = datetime.combine(
            expense_day,
            time.min
        )

        end_of_day = datetime.combine(
            expense_day,
            time.max
        )

        expense = await self.collection.find_one({

            "_id": {
                "$ne": object_id
            },

            "user_id": user_id,

            "farm_id": farm_id,

            "crop_id": crop_id,

            "category": category,

            "normalized_item_name":
                normalized_item_name,

            "quantity": quantity,

            "amount": amount,

            "expense_date": {
                "$gte": start_of_day,
                "$lte": end_of_day
            },

            "is_deleted": False
        })

        return expense

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

        if farm_id and farm_id.strip():

            query["farm_id"] = farm_id

        if crop_id and crop_id.strip():

            query["crop_id"] = crop_id

        if (
            financial_year
            and
            financial_year.strip()
        ):

            query["financial_year"] = (
                financial_year.strip()
            )

        if category and category.strip():

            query["category"] = (
                category.strip()
            )

        search_query = build_search_query(
            [
                "item_name",
                "category",
                "financial_year",
                "payment_method",
                "notes",
                "normalized_item_name"
            ],
            search
        )

        query.update(search_query)

        expenses = await self.collection.find(
            query
        ).sort(
            "created_at",
            -1
        ).to_list(length=None)

        formatted_expenses = []

        for expense in expenses:

            expense["id"] = str(
                expense["_id"]
            )

            expense.pop("_id")

            expense.pop(
                "normalized_item_name",
                None
            )

            formatted_expenses.append(
                expense
            )

        return formatted_expenses

    async def get_expense_by_id(
        self,
        expense_id: str,
        user_id: str
    ):

        try:

            object_id = ObjectId(expense_id)

        except InvalidId:

            return None

        expense = await self.collection.find_one({
            "_id": object_id,
            "user_id": user_id,
            "is_deleted": False
        })

        if expense:

            expense["id"] = str(
                expense["_id"]
            )

            expense.pop("_id")

            expense.pop(
                "normalized_item_name",
                None
            )

        return expense

    async def update_expense(
        self,
        expense_id: str,
        user_id: str,
        update_data: dict
    ):

        try:

            object_id = ObjectId(expense_id)

        except InvalidId:

            return 0

        update_data["updated_at"] = (
            datetime.utcnow()
        )

        result = await self.collection.update_one(
            {
                "_id": object_id,
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

        try:

            object_id = ObjectId(expense_id)

        except InvalidId:

            return 0

        result = await self.collection.update_one(
            {
                "_id": object_id,
                "user_id": user_id,
                "is_deleted": False
            },
            {
                "$set": {
                    "is_deleted": True,
                    "updated_at": datetime.utcnow()
                }
            }
        )

        return result.modified_count