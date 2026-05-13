from bson import ObjectId

from datetime import datetime

from app.utils.search import (
    build_search_query
)


class PesticideRepository:

    def __init__(self, collection):

        self.collection = collection

    async def create_pesticide(
        self,
        pesticide_data: dict
    ):

        result = await self.collection.insert_one(
            pesticide_data
        )

        return str(
            result.inserted_id
        )

    async def get_all_pesticides(
        self,
        user_id: str,
        farm_id: str = None,
        crop_id: str = None,
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

        search_query = build_search_query(
            "pesticide_name",
            search
        )

        query.update(
            search_query
        )

        pesticides = await self.collection.find(
            query
        ).to_list(length=None)

        formatted_pesticides = []

        for pesticide in pesticides:

            pesticide["id"] = str(
                pesticide["_id"]
            )

            pesticide.pop("_id")

            formatted_pesticides.append(
                pesticide
            )

        return formatted_pesticides

    async def get_pesticide_by_id(
        self,
        pesticide_id: str,
        user_id: str
    ):

        pesticide = await self.collection.find_one({
            "_id": ObjectId(pesticide_id),
            "user_id": user_id,
            "is_deleted": False
        })

        if pesticide:

            pesticide["id"] = str(
                pesticide["_id"]
            )

            pesticide.pop("_id")

        return pesticide

    async def update_pesticide(
        self,
        pesticide_id: str,
        user_id: str,
        update_data: dict
    ):

        update_data["updated_at"] = datetime.utcnow()

        result = await self.collection.update_one(
            {
                "_id": ObjectId(pesticide_id),
                "user_id": user_id,
                "is_deleted": False
            },
            {
                "$set": update_data
            }
        )

        return result.modified_count

    async def delete_pesticide(
        self,
        pesticide_id: str,
        user_id: str
    ):

        result = await self.collection.update_one(
            {
                "_id": ObjectId(pesticide_id),
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