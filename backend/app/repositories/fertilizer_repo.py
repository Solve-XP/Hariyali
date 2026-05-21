from bson import ObjectId
from bson.errors import InvalidId

from datetime import datetime, timezone

from app.utils.search import (
    build_search_query
)


class FertilizerRepository:

    def __init__(self, collection):

        self.collection = collection

    async def create_fertilizer(
        self,
        fertilizer_data: dict
    ):

        result = await self.collection.insert_one(
            fertilizer_data
        )

        return str(result.inserted_id)

    async def check_duplicate_fertilizer(
        self,
        user_id: str,
        financial_year: str,
        fertilizer_name: str,
        quantity: float,
        application_date: datetime
    ):

        fertilizer = await self.collection.find_one({

            "user_id": user_id,

            "financial_year": financial_year,

            "normalized_fertilizer_name": (
                fertilizer_name
            ),

            "quantity": quantity,

            "application_date": application_date,

            "is_deleted": False
        })

        return fertilizer

    async def check_duplicate_fertilizer_for_update(
        self,
        fertilizer_id: str,
        user_id: str,
        financial_year: str,
        fertilizer_name: str,
        quantity: float,
        application_date: datetime
    ):

        try:

            object_id = ObjectId(
                fertilizer_id
            )

        except InvalidId:

            return None

        fertilizer = await self.collection.find_one({

            "_id": {
                "$ne": object_id
            },

            "user_id": user_id,

            "financial_year": financial_year,

            "normalized_fertilizer_name": (
                fertilizer_name
            ),

            "quantity": quantity,

            "application_date": application_date,

            "is_deleted": False
        })

        return fertilizer

    async def get_all_fertilizers(
        self,
        user_id: str,
        financial_year: str = None,
        search: str = None
    ):

        query = {

            "user_id": user_id,

            "is_deleted": False
        }

        if financial_year:

            query["financial_year"] = (
                financial_year
            )

        if search and search.strip():

            search_query = build_search_query(
                [
                    "fertilizer_name",
                    "normalized_fertilizer_name",
                    "financial_year",
                    "unit"
                ],
                search
            )

            query.update(search_query)

        fertilizers = await self.collection.find(
            query
        ).sort(
            "created_at",
            -1
        ).to_list(length=None)

        formatted_fertilizers = []

        for fertilizer in fertilizers:

            fertilizer["id"] = str(
                fertilizer["_id"]
            )

            fertilizer.pop("_id")

            formatted_fertilizers.append(
                fertilizer
            )

        return formatted_fertilizers

    async def get_fertilizer_by_id(
        self,
        fertilizer_id: str,
        user_id: str
    ):

        try:

            object_id = ObjectId(
                fertilizer_id
            )

        except InvalidId:

            return None

        fertilizer = await self.collection.find_one({

            "_id": object_id,

            "user_id": user_id,

            "is_deleted": False
        })

        if fertilizer:

            fertilizer["id"] = str(
                fertilizer["_id"]
            )

            fertilizer.pop("_id")

        return fertilizer

    async def update_fertilizer(
        self,
        fertilizer_id: str,
        user_id: str,
        update_data: dict
    ):

        try:

            object_id = ObjectId(
                fertilizer_id
            )

        except InvalidId:

            return 0

        update_data["updated_at"] = (
            datetime.now(timezone.utc)
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

    async def delete_fertilizer(
        self,
        fertilizer_id: str,
        user_id: str
    ):

        try:

            object_id = ObjectId(
                fertilizer_id
            )

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
                    "updated_at": (
                        datetime.now(
                            timezone.utc
                        )
                    )
                }
            }
        )

        return result.modified_count