from bson import ObjectId
from bson.errors import InvalidId

from datetime import datetime

from app.utils.search import (
    build_search_query
)


class FarmRepository:

    def __init__(self, collection):
        self.collection = collection

    async def create_farm(
        self,
        farm_data: dict
    ):

        result = await self.collection.insert_one(
            farm_data
        )

        return str(result.inserted_id)

    async def check_duplicate_farm(
        self,
        user_id: str,
        farm_name: str,
        location: str
    ):

        farm = await self.collection.find_one({
            "user_id": user_id,
            "farm_name": farm_name,
            "location": location,
            "is_deleted": False
        })

        return farm

    async def check_duplicate_farm_for_update(
        self,
        farm_id: str,
        user_id: str,
        farm_name: str,
        location: str
    ):

        try:

            object_id = ObjectId(farm_id)

        except InvalidId:

            return None

        farm = await self.collection.find_one({
            "_id": {
                "$ne": object_id
            },
            "user_id": user_id,
            "farm_name": farm_name,
            "location": location,
            "is_deleted": False
        })

        return farm

    async def get_all_farms(
        self,
        user_id: str,
        search: str = None
    ):

        query = {
            "user_id": user_id,
            "is_deleted": False
        }

        search_query = build_search_query(
            "farm_name",
            search
        )

        query.update(search_query)

        farms = await self.collection.find(
            query
        ).sort(
            "created_at",
            -1
        ).to_list(length=None)

        return farms

    async def get_farm_by_id(
        self,
        farm_id: str,
        user_id: str
    ):

        try:

            object_id = ObjectId(farm_id)

        except InvalidId:

            return None

        farm = await self.collection.find_one({
            "_id": object_id,
            "user_id": user_id,
            "is_deleted": False
        })

        return farm

    async def update_farm(
        self,
        farm_id: str,
        user_id: str,
        update_data: dict
    ):

        try:

            object_id = ObjectId(farm_id)

        except InvalidId:

            return 0

        update_data["updated_at"] = datetime.utcnow()

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

    async def delete_farm(
        self,
        farm_id: str,
        user_id: str
    ):

        try:

            object_id = ObjectId(farm_id)

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