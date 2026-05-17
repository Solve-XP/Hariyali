from bson import ObjectId

from datetime import datetime

from app.utils.search import (
    build_search_query
)


class RentalRepository:

    def __init__(self, collection):

        self.collection = collection

    async def create_rental(
        self,
        rental_data: dict
    ):

        result = await self.collection.insert_one(
            rental_data
        )

        return str(result.inserted_id)

    async def get_all_rentals(
        self,
        financial_year: str = None,
        search: str = None
    ):

        query = {
            "is_deleted": False,
            "is_available": True
        }

        if financial_year:

            query["financial_year"] = financial_year

        search_query = build_search_query(
            "equipment_name",
            search
        )

        query.update(search_query)

        rentals = await self.collection.find(
            query
        ).sort(
            "created_at",
            -1
        ).to_list(length=None)

        formatted_rentals = []

        for rental in rentals:

            rental["id"] = str(
                rental["_id"]
            )

            rental.pop("_id")

            formatted_rentals.append(
                rental
            )

        return formatted_rentals

    async def get_rental_by_id(
        self,
        rental_id: str
    ):

        rental = await self.collection.find_one({
            "_id": ObjectId(rental_id),
            "is_deleted": False
        })

        if rental:

            rental["id"] = str(
                rental["_id"]
            )

            rental.pop("_id")

        return rental

    async def update_rental(
        self,
        rental_id: str,
        user_id: str,
        update_data: dict
    ):

        update_data["updated_at"] = datetime.utcnow()

        result = await self.collection.update_one(
            {
                "_id": ObjectId(rental_id),
                "user_id": user_id,
                "is_deleted": False
            },
            {
                "$set": update_data
            }
        )

        return result.modified_count

    async def delete_rental(
        self,
        rental_id: str,
        user_id: str
    ):

        result = await self.collection.update_one(
            {
                "_id": ObjectId(rental_id),
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