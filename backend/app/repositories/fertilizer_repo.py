from bson import ObjectId

from datetime import datetime

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

            query["financial_year"] = financial_year

        search_query = build_search_query(
            "fertilizer_name",
            search
        )

        query.update(search_query)

        fertilizers = await self.collection.find(
            query
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

        fertilizer = await self.collection.find_one({
            "_id": ObjectId(fertilizer_id),
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

        update_data["updated_at"] = datetime.utcnow()

        result = await self.collection.update_one(
            {
                "_id": ObjectId(fertilizer_id),
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

        result = await self.collection.update_one(
            {
                "_id": ObjectId(fertilizer_id),
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