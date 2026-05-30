# app/services/rental_service.py

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
from app.utils.mask import (
    mask_name,
    mask_phone
)

from app.utils.normalize import (
    normalize_text
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

        village: str,

        taluka: str,

        district: str,

        state: str,

        owner_name: str,
        

        phone: str,

        description: str,

        equipment_images,
         
        latitude: float = None,

        longitude: float = None,
    ):

        if (
            price_per_hour is None
            and
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
            price_per_hour is not None
            and
            price_per_hour <= 0
        ):

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Price per hour must "
                    "be greater than 0"
                )
            )

        if (
            price_per_day is not None
            and
            price_per_day <= 0
        ):

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Price per day must "
                    "be greater than 0"
                )
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

            "village": village,

            "taluka": taluka,

            "district": district,

            "state": state,

            "created_at": {

                "$gte": start_of_day,

                "$lte": end_of_day
            },

            "is_deleted": False
        })

        if existing_rental:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Similar equipment "
                    "listing already exists"
                )
            )

        uploaded_images = []

        for image in equipment_images:

            image_url = await upload_file_to_s3(
                image,
                "rentals"
            )

            uploaded_images.append(
                image_url
            )

        rental_data = {

            "user_id": user_id,

            "financial_year": (
                get_current_financial_year()
            ),

            "equipment_name":
                equipment_name,

            "normalized_equipment_name":
                normalize_text(
                    equipment_name
                ),

            "price_per_hour":
                price_per_hour,

            "price_per_day":
                price_per_day,

            "village":
                village,

            "normalized_village":
                normalize_text(
                    village
                ),

            "taluka":
                taluka,

            "normalized_taluka":
                normalize_text(
                    taluka
                ),

            "district":
                district,

            "normalized_district":
                normalize_text(
                    district
                ),

            "state":
                state,

            "latitude":
                latitude,

            "longitude":
                longitude,

            "normalized_state":
                normalize_text(
                    state
                ),

            "owner_name":
                owner_name,

            "phone":
                phone,

            "equipment_images":
                uploaded_images,

            "description":
                description or "",

            "is_available":
                True,

            "is_deleted":
                False,

            "created_at":
                datetime.utcnow(),

            "updated_at":
                datetime.utcnow()
        }

        rental_id = await self.rental_repo.create_rental(
            rental_data
        )

        return {

            "message":
                "Equipment listed successfully",

            "rental_id":
                rental_id
        }

    async def get_all_rentals(

        self,

        financial_year: str = None,

        search: str = None,

        current_user_id: str = None,

        exclude_my_listings: bool = False
    ):

        return await self.rental_repo.get_all_rentals(

            financial_year,

            search,

            current_user_id,

            exclude_my_listings
        )

    async def get_my_rentals(
        self,
        user_id: str
    ):

        return await self.rental_repo.get_my_rentals(
            user_id
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
    


    async def get_public_rentals(

        self,

        financial_year: str = None,

        search: str = None
    ):

        rentals = await self.rental_repo.get_all_rentals(

            financial_year,

            search
        )

        masked_rentals = []

        for item in rentals:

            masked_rentals.append({

                "id":
                    item["id"],

                "equipment_name":
                    item["equipment_name"],

                "price_per_hour":
                    item["price_per_hour"],

                "price_per_day":
                    item["price_per_day"],

                "village":
                    item["village"],

                "taluka":
                    item["taluka"],

                "district":
                    item["district"],

                "state":
                    item["state"],

                "latitude":
                    item.get("latitude"),

                "longitude":
                    item.get("longitude"),

                "equipment_images":
                    item["equipment_images"],

                "description":
                    item["description"],

                "created_at": 
                    item["created_at"],

                "owner_name":
                    mask_name(
                        item["owner_name"]
                    ),

                "phone":
                    mask_phone(
                        item["phone"]
                    ),

                "is_locked":
                    True
            })

        return masked_rentals




    async def update_rental(

        self,

        rental_id: str,

        user_id: str,

        data,

        equipment_images=None
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
            "price_per_hour" in update_data
            and
            update_data["price_per_hour"] is not None
            and
            update_data["price_per_hour"] <= 0
        ):

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Price per hour must "
                    "be greater than 0"
                )
            )

        if (
            "price_per_day" in update_data
            and
            update_data["price_per_day"] is not None
            and
            update_data["price_per_day"] <= 0
        ):

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Price per day must "
                    "be greater than 0"
                )
            )

        final_equipment_name = update_data.get(
            "equipment_name",
            rental["equipment_name"]
        )

        final_village = update_data.get(
            "village",
            rental["village"]
        )

        final_taluka = update_data.get(
            "taluka",
            rental["taluka"]
        )

        final_district = update_data.get(
            "district",
            rental["district"]
        )

        final_state = update_data.get(
            "state",
            rental["state"]
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

            "equipment_name":
                final_equipment_name,

            "village":
                final_village,

            "taluka":
                final_taluka,

            "district":
                final_district,

            "state":
                final_state,

            "created_at": {

                "$gte": start_of_day,

                "$lte": end_of_day
            },

            "is_deleted": False
        })

        if existing_rental:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Similar equipment "
                    "listing already exists"
                )
            )

        if "equipment_name" in update_data:

            update_data[
                "normalized_equipment_name"
            ] = normalize_text(
                update_data["equipment_name"]
            )

        if "village" in update_data:

            update_data[
                "normalized_village"
            ] = normalize_text(
                update_data["village"]
            )

        if "taluka" in update_data:

            update_data[
                "normalized_taluka"
            ] = normalize_text(
                update_data["taluka"]
            )

        if "district" in update_data:

            update_data[
                "normalized_district"
            ] = normalize_text(
                update_data["district"]
            )

        if "state" in update_data:

            update_data[
                "normalized_state"
            ] = normalize_text(
                update_data["state"]
            )

        if equipment_images:

            uploaded_images = []

            for image in equipment_images:

                image_url = await upload_file_to_s3(
                    image,
                    "rentals"
                )

                uploaded_images.append(
                    image_url
                )

            update_data[
                "equipment_images"
            ] = uploaded_images

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
            "message":
                "Rental updated successfully"
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
            "message":
                "Rental deleted successfully"
        }