# app/repositories/marketplace_repo.py

from bson import ObjectId

from app.utils.search import (
    build_search_query
)


class MarketplaceRepository:

    def __init__(self, collection):

        self.collection = collection

    async def create_listing(
        self,
        data: dict
    ):

        result = await self.collection.insert_one(
            data
        )

        return str(result.inserted_id)

    async def find_duplicate_listing(
        self,
        user_id: str,
        crop_name: str,
        quantity: float,
        village: str,
        taluka: str,
        district: str,
        state: str,
        harvest_date_string: str,
        exclude_listing_id: str = None
    ):

        query = {

            "user_id": user_id,

            "crop_name": crop_name,

            "quantity": quantity,

            "village": village,

            "taluka": taluka,

            "district": district,

            "state": state,

            "harvest_date_string":
                harvest_date_string,

            "status": "active",

            "is_deleted": False
        }

        if exclude_listing_id:

            query["_id"] = {
                "$ne": ObjectId(
                    exclude_listing_id
                )
            }

        return await self.collection.find_one(
            query
        )

    async def get_all_listings(
        self,
        search: str = None,
        current_user_id: str = None,
        exclude_my_listings: bool = False
    ):

        search_query = build_search_query(
            fields=[
                "crop_name",
                "farm_name",
                "village",
                "taluka",
                "district",
                "state"
            ],
            search=search
        )

        final_query = {
            "is_deleted": False
        }

        if search_query:

            final_query.update(search_query)

        if (
            exclude_my_listings
            and
            current_user_id
        ):

            final_query["user_id"] = {
                "$ne": current_user_id
            }

        cursor = self.collection.find(
            final_query
        ).sort(
            "created_at",
            -1
        )

        return await cursor.to_list(None)

    async def get_my_listings(
        self,
        user_id: str
    ):

        cursor = self.collection.find({
            "user_id": user_id,
            "is_deleted": False
        }).sort(
            "created_at",
            -1
        )

        return await cursor.to_list(None)

    async def get_listing_by_id(
        self,
        listing_id: str
    ):

        return await self.collection.find_one({
            "_id": ObjectId(listing_id),
            "is_deleted": False
        })

    async def update_listing(
        self,
        listing_id: str,
        user_id: str,
        update_data: dict
    ):

        result = await self.collection.update_one(
            {
                "_id": ObjectId(listing_id),
                "user_id": user_id,
                "is_deleted": False
            },
            {
                "$set": update_data
            }
        )

        return result.modified_count > 0

    async def delete_listing(
        self,
        listing_id: str,
        user_id: str
    ):

        result = await self.collection.update_one(
            {
                "_id": ObjectId(listing_id),
                "user_id": user_id,
                "is_deleted": False
            },
            {
                "$set": {
                    "is_deleted": True
                }
            }
        )

        return result.modified_count > 0