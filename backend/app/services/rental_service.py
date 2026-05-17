from bson import ObjectId

from datetime import (
    datetime,
    time
)

from fastapi import (
    HTTPException,
    UploadFile,
    status
)

from app.db.database import (
    rentals_collection
)

from app.repositories.rental_repo import (
    RentalRepository
)

from app.integrations.s3 import (
    upload_file_to_s3
)

from app.utils.financial_year import (
    get_current_financial_year
)


class RentalService:

    def __init__(self):

        self.rental_repo = (
            RentalRepository(
                rentals_collection
            )
        )

    async def create_rental(
        self,
        user_id: str,
        equipment_name: str,
        price_per_hour: float,
        price_per_day: float,
        location: str,
        owner_name: str,
        phone: str,
        description: str,
        equipment_photo: UploadFile
    ):

        if (
            price_per_hour is None and
            price_per_day is None
        ):

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Price per hour or "
                    "price per day required"
                )
            )

        if (
            price_per_hour is not None and
            price_per_hour <= 0
        ):

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Price per hour must be greater than 0"
            )

        if (
            price_per_day is not None and
            price_per_day <= 0
        ):

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Price per day must be greater than 0"
            )

        listing_day = datetime.utcnow().date()

        start_of_day = datetime.combine(
            listing_day,
            time.min
        )

        end_of_day = datetime.combine(
            listing_day,
            time.max
        )

        existing_rental = await rentals_collection.find_one({

            "user_id": user_id,

            "equipment_name": equipment_name,

            "location": location,

            "created_at": {
                "$gte": start_of_day,
                "$lte": end_of_day
            },

            "is_deleted": False
        })

        if existing_rental:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Similar equipment listing already exists"
            )

        equipment_photo_url = await upload_file_to_s3(
            equipment_photo,
            "rentals"
        )

        rental_data = {

            "user_id": user_id,

            "financial_year": (
                get_current_financial_year()
            ),

            "equipment_name": equipment_name,

            "price_per_hour": price_per_hour,

            "price_per_day": price_per_day,

            "location": location,

            "owner_name": owner_name,

            "phone": phone,

            "equipment_photo": equipment_photo_url,

            "description": description,

            "is_available": True,

            "is_deleted": False,

            "created_at": datetime.utcnow(),

            "updated_at": datetime.utcnow()
        }

        rental_id = await self.rental_repo.create_rental(
            rental_data
        )

        return {
            "message": "Equipment listed successfully",
            "rental_id": rental_id
        }

    async def get_all_rentals(
        self,
        financial_year: str = None,
        search: str = None
    ):

        return await self.rental_repo.get_all_rentals(
            financial_year,
            search
        )

    async def get_rental_by_id(
        self,
        rental_id: str
    ):

        rental = await self.rental_repo.get_rental_by_id(
            rental_id
        )

        if not rental:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Rental not found"
            )

        return rental

    async def update_rental(
        self,
        rental_id: str,
        user_id: str,
        data,
        equipment_photo=None
    ):

        rental = await self.rental_repo.get_rental_by_id(
            rental_id
        )

        if not rental:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Rental not found"
            )

        if rental["user_id"] != user_id:

            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )

        update_data = data.dict(
            exclude_unset=True,
            exclude_none=True
        )

        if (
            "price_per_hour" in update_data and
            update_data["price_per_hour"] is not None and
            update_data["price_per_hour"] <= 0
        ):

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Price per hour must be greater than 0"
            )

        if (
            "price_per_day" in update_data and
            update_data["price_per_day"] is not None and
            update_data["price_per_day"] <= 0
        ):

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Price per day must be greater than 0"
            )

        final_equipment_name = update_data.get(
            "equipment_name",
            rental["equipment_name"]
        )

        final_location = update_data.get(
            "location",
            rental["location"]
        )

        listing_day = datetime.utcnow().date()

        start_of_day = datetime.combine(
            listing_day,
            time.min
        )

        end_of_day = datetime.combine(
            listing_day,
            time.max
        )

        existing_rental = await rentals_collection.find_one({

            "_id": {
                "$ne": ObjectId(rental_id)
            },

            "user_id": user_id,

            "equipment_name": final_equipment_name,

            "location": final_location,

            "created_at": {
                "$gte": start_of_day,
                "$lte": end_of_day
            },

            "is_deleted": False
        })

        if existing_rental:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Similar equipment listing already exists"
            )

        if equipment_photo:

            equipment_photo_url = await upload_file_to_s3(
                equipment_photo,
                "rentals"
            )

            update_data["equipment_photo"] = (
                equipment_photo_url
            )

        modified_count = await self.rental_repo.update_rental(
            rental_id,
            user_id,
            update_data
        )

        if modified_count == 0:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Rental not updated"
            )

        return {
            "message": "Rental updated successfully"
        }

    async def delete_rental(
        self,
        rental_id: str,
        user_id: str
    ):

        rental = await self.rental_repo.get_rental_by_id(
            rental_id
        )

        if not rental:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Rental not found"
            )

        if rental["user_id"] != user_id:

            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )

        modified_count = await self.rental_repo.delete_rental(
            rental_id,
            user_id
        )

        if modified_count == 0:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Rental not deleted"
            )

        return {
            "message": "Rental deleted successfully"
        }