# app/services/marketplace_service.py

from datetime import (
    datetime
)

from fastapi import (
    HTTPException
)

from app.integrations.s3 import (
    upload_file_to_s3
)

from app.utils.normalize import (
    normalize_text
)


class MarketplaceService:

    def __init__(self, repo):

        self.repo = repo

    async def create_listing(
        self,
        current_user,
        payload,
        crop_images
    ):

        harvest_datetime = datetime.combine(
            payload.harvest_date,
            datetime.min.time()
        )

        harvest_date_string = (
            payload.harvest_date.isoformat()
        )

        duplicate_listing = await self.repo.find_duplicate_listing(
            user_id=str(current_user["_id"]),
            crop_name=payload.crop_name,
            quantity=payload.quantity,
            village=payload.village,
            taluka=payload.taluka,
            district=payload.district,
            state=payload.state,
            harvest_date_string=harvest_date_string
        )

        if duplicate_listing:

            raise HTTPException(
                status_code=400,
                detail="Similar marketplace listing already exists"
            )

        image_urls = []

        for image in crop_images:

            image_url = await upload_file_to_s3(
                image,
                "marketplace"
            )

            image_urls.append(image_url)

        listing_data = {

            "user_id":
                str(current_user["_id"]),

            "seller_name":
                current_user["name"],

            "seller_phone":
                current_user["phone"],

            "seller_role":
                current_user["role"],

            "farm_id":
                payload.farm_id,

            "farm_name":
                payload.farm_name,

            "crop_id":
                payload.crop_id,

            "crop_name":
                payload.crop_name,

            "normalized_crop_name":
                normalize_text(
                    payload.crop_name
                ),

            "quantity":
                payload.quantity,

            "unit":
                payload.unit,

            "expected_price":
                payload.expected_price,

            "harvest_date":
                harvest_datetime,

            "harvest_date_string":
                harvest_date_string,

            "village":
                payload.village,

            "normalized_village":
                normalize_text(
                    payload.village
                ),

            "taluka":
                payload.taluka,

            "normalized_taluka":
                normalize_text(
                    payload.taluka
                ),

            "district":
                payload.district,

            "normalized_district":
                normalize_text(
                    payload.district
                ),

            "state":
                payload.state,

            "normalized_state":
                normalize_text(
                    payload.state
                ),

            "description":
                payload.description or "",

            "crop_images":
                image_urls,

            "status":
                "active",

            "created_at":
                datetime.utcnow(),

            "updated_at":
                datetime.utcnow(),

            "is_deleted":
                False
        }

        listing_id = await self.repo.create_listing(
            listing_data
        )

        return {
            "message":
                "Marketplace listing created successfully",

            "listing_id":
                listing_id
        }

    async def get_all_listings(
        self,
        search: str = None,
        current_user_id: str = None,
        exclude_my_listings: bool = False
    ):

        listings = await self.repo.get_all_listings(
            search=search,
            current_user_id=current_user_id,
            exclude_my_listings=exclude_my_listings
        )

        formatted_list = []

        for item in listings:

            formatted_list.append({

                "id":
                    str(item["_id"]),

                "seller_name":
                    item["seller_name"],

                "seller_phone":
                    item["seller_phone"],

                "seller_role":
                    item["seller_role"],

                "farm_id":
                    item["farm_id"],

                "farm_name":
                    item["farm_name"],

                "crop_id":
                    item["crop_id"],

                "crop_name":
                    item["crop_name"],

                "quantity":
                    item["quantity"],

                "unit":
                    item["unit"],

                "expected_price":
                    item["expected_price"],

                "harvest_date":
                    item["harvest_date"],

                "village":
                    item["village"],

                "taluka":
                    item["taluka"],

                "district":
                    item["district"],

                "state":
                    item["state"],

                "description":
                    item.get(
                        "description",
                        ""
                    ),

                "crop_images":
                    item.get(
                        "crop_images",
                        []
                    ),

                "status":
                    item["status"]
            })

        return formatted_list

    async def get_my_listings(
        self,
        user_id: str
    ):

        listings = await self.repo.get_my_listings(
            user_id
        )

        formatted_list = []

        for item in listings:

            formatted_list.append({

                "id":
                    str(item["_id"]),

                "farm_id":
                    item["farm_id"],

                "farm_name":
                    item["farm_name"],

                "crop_id":
                    item["crop_id"],

                "crop_name":
                    item["crop_name"],

                "quantity":
                    item["quantity"],

                "unit":
                    item["unit"],

                "expected_price":
                    item["expected_price"],

                "harvest_date":
                    item["harvest_date"],

                "village":
                    item["village"],

                "taluka":
                    item["taluka"],

                "district":
                    item["district"],

                "state":
                    item["state"],

                "description":
                    item.get(
                        "description",
                        ""
                    ),

                "crop_images":
                    item.get(
                        "crop_images",
                        []
                    ),

                "status":
                    item["status"]
            })

        return formatted_list

    async def get_listing_by_id(
        self,
        listing_id: str
    ):

        listing = await self.repo.get_listing_by_id(
            listing_id
        )

        if not listing:

            raise HTTPException(
                status_code=404,
                detail="Listing not found"
            )

        return {

            "id":
                str(listing["_id"]),

            "seller_name":
                listing["seller_name"],

            "seller_phone":
                listing["seller_phone"],

            "seller_role":
                listing["seller_role"],

            "farm_id":
                listing["farm_id"],

            "farm_name":
                listing["farm_name"],

            "crop_id":
                listing["crop_id"],

            "crop_name":
                listing["crop_name"],

            "quantity":
                listing["quantity"],

            "unit":
                listing["unit"],

            "expected_price":
                listing["expected_price"],

            "harvest_date":
                listing["harvest_date"],

            "village":
                listing["village"],

            "taluka":
                listing["taluka"],

            "district":
                listing["district"],

            "state":
                listing["state"],

            "description":
                listing.get(
                    "description",
                    ""
                ),

            "crop_images":
                listing.get(
                    "crop_images",
                    []
                ),

            "status":
                listing["status"]
        }

    async def update_listing(
        self,
        listing_id: str,
        user_id: str,
        payload
    ):

        existing_listing = await self.repo.get_listing_by_id(
            listing_id
        )

        if not existing_listing:

            raise HTTPException(
                status_code=404,
                detail="Listing not found"
            )

        crop_name = (
            payload.crop_name
            or existing_listing["crop_name"]
        )

        quantity = (
            payload.quantity
            or existing_listing["quantity"]
        )

        village = (
            payload.village
            or existing_listing["village"]
        )

        taluka = (
            payload.taluka
            or existing_listing["taluka"]
        )

        district = (
            payload.district
            or existing_listing["district"]
        )

        state = (
            payload.state
            or existing_listing["state"]
        )

        harvest_date = (
            payload.harvest_date
            or existing_listing["harvest_date"]
        )

        if isinstance(harvest_date, datetime):

            harvest_date_string = (
                harvest_date.date().isoformat()
            )

        else:

            harvest_date_string = (
                harvest_date.isoformat()
            )

        duplicate_listing = await self.repo.find_duplicate_listing(
            user_id=user_id,
            crop_name=crop_name,
            quantity=quantity,
            village=village,
            taluka=taluka,
            district=district,
            state=state,
            harvest_date_string=harvest_date_string,
            exclude_listing_id=listing_id
        )

        if duplicate_listing:

            raise HTTPException(
                status_code=400,
                detail="Similar marketplace listing already exists"
            )

        update_data = payload.dict(
            exclude_none=True,
            exclude_unset=True
        )

        if "crop_name" in update_data:

            update_data[
                "normalized_crop_name"
            ] = normalize_text(
                update_data["crop_name"]
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

        if "harvest_date" in update_data:

            update_data["harvest_date"] = (
                datetime.combine(
                    update_data["harvest_date"],
                    datetime.min.time()
                )
            )

            update_data[
                "harvest_date_string"
            ] = update_data[
                "harvest_date"
            ].date().isoformat()

        update_data["updated_at"] = (
            datetime.utcnow()
        )

        updated = await self.repo.update_listing(
            listing_id,
            user_id,
            update_data
        )

        if not updated:

            raise HTTPException(
                status_code=404,
                detail="Listing not found"
            )

        return {
            "message":
                "Listing updated successfully"
        }

    async def delete_listing(
        self,
        listing_id: str,
        user_id: str
    ):

        deleted = await self.repo.delete_listing(
            listing_id,
            user_id
        )

        if not deleted:

            raise HTTPException(
                status_code=404,
                detail="Listing not found"
            )

        return {
            "message":
                "Listing deleted successfully"
        }