from bson import ObjectId

from datetime import datetime

from app.utils.search import (
    build_search_query
)


class CropRepository:

    def __init__(self, collection):

        self.collection = collection

    async def create_crop(
        self,
        crop_data: dict
    ):

        result = await self.collection.insert_one(
            crop_data
        )

        return str(result.inserted_id)

    async def get_all_crops(
        self,
        user_id: str,
        search: str = None,
        farm_id: str = None,
        season: str = None,
        financial_year: str = None
    ):

        query = {
            "user_id": user_id,
            "is_deleted": False
        }

        search_query = build_search_query(
            "crop_name",
            search
        )

        query.update(search_query)

        if farm_id:
            query["farm_id"] = farm_id

        if season:
            query["season"] = season

        if financial_year:
            query["financial_year"] = (
                financial_year
            )

        crops = await self.collection.find(
            query
        ).to_list(length=None)

        return crops

    async def get_crop_by_id(
        self,
        crop_id: str,
        user_id: str
    ):

        crop = await self.collection.find_one({
            "_id": ObjectId(crop_id),
            "user_id": user_id,
            "is_deleted": False
        })

        return crop

    async def update_crop(
        self,
        crop_id: str,
        user_id: str,
        update_data: dict
    ):

        update_data["updated_at"] = (
            datetime.utcnow()
        )

        result = await self.collection.update_one(
            {
                "_id": ObjectId(crop_id),
                "user_id": user_id,
                "is_deleted": False
            },
            {
                "$set": update_data
            }
        )

        return result.modified_count

    async def delete_crop(
        self,
        crop_id: str,
        user_id: str
    ):

        result = await self.collection.update_one(
            {
                "_id": ObjectId(crop_id),
                "user_id": user_id
            },
            {
                "$set": {
                    "is_deleted": True,
                    "updated_at":
                        datetime.utcnow()
                }
            }
        )

        return result.modified_count