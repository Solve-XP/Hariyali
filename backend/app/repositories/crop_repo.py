from bson import ObjectId
from bson.errors import InvalidId

from datetime import (
    datetime,
    timezone
)

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

    async def check_duplicate_crop(
        self,
        user_id: str,
        farm_id: str,
        financial_year: str,
        crop_name: str,
        season: str,
        sowing_date: datetime
    ):

        crop = await self.collection.find_one({
            "user_id": user_id,
            "farm_id": farm_id,
            "financial_year": financial_year,
            "normalized_crop_name": crop_name,
            "normalized_season": season,
            "sowing_date": sowing_date,
            "is_deleted": False
        })

        return crop

    async def check_duplicate_crop_for_update(
        self,
        crop_id: str,
        user_id: str,
        farm_id: str,
        financial_year: str,
        crop_name: str,
        season: str,
        sowing_date: datetime
    ):

        try:

            object_id = ObjectId(crop_id)

        except InvalidId:

            return None

        crop = await self.collection.find_one({
            "_id": {
                "$ne": object_id
            },
            "user_id": user_id,
            "farm_id": farm_id,
            "financial_year": financial_year,
            "normalized_crop_name": crop_name,
            "normalized_season": season,
            "sowing_date": sowing_date,
            "is_deleted": False
        })

        return crop

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
            [
                "crop_name",
                "season",
                "financial_year",
                "normalized_crop_name",
                "normalized_season"
            ],
            search
        )

        query.update(search_query)

        if (
            farm_id
            and
            farm_id.strip()
        ):

            query["farm_id"] = farm_id

        if (
            season
            and
            season.strip()
        ):

            query["normalized_season"] = (
                season.lower().strip()
            )

        if (
            financial_year
            and
            financial_year.strip()
        ):

            query["financial_year"] = (
                financial_year.strip()
            )

        crops = await self.collection.find(
            query
        ).sort(
            "created_at",
            -1
        ).to_list(length=None)

        return crops

    async def get_crop_by_id(
        self,
        crop_id: str,
        user_id: str
    ):

        try:

            object_id = ObjectId(crop_id)

        except InvalidId:

            return None

        crop = await self.collection.find_one({
            "_id": object_id,
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

        try:

            object_id = ObjectId(crop_id)

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

    async def delete_crop(
        self,
        crop_id: str,
        user_id: str
    ):

        try:

            object_id = ObjectId(crop_id)

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
                    "updated_at":
                        datetime.now(timezone.utc)
                }
            }
        )

        return result.modified_count