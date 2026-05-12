from bson import ObjectId

from datetime import datetime


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

    async def get_all_farms(
        self,
        user_id: str,
        search: str = None
    ):

        query = {
            "user_id": user_id,
            "is_deleted": False
        }

        if search:

            query["farm_name"] = {
                "$regex": search,
                "$options": "i"
            }

        farms = await self.collection.find(
            query
        ).to_list(length=None)

        return farms

    async def get_farm_by_id(
        self,
        farm_id: str,
        user_id: str
    ):

        farm = await self.collection.find_one({
            "_id": ObjectId(farm_id),
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

        update_data["updated_at"] = datetime.utcnow()

        result = await self.collection.update_one(
            {
                "_id": ObjectId(farm_id),
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

        result = await self.collection.update_one(
            {
                "_id": ObjectId(farm_id),
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