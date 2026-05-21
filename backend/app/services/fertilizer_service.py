from bson import ObjectId
from bson.errors import InvalidId

from datetime import datetime, timezone

from fastapi import HTTPException
from fastapi import status

from app.db.database import (
    fertilizers_collection
)

from app.repositories.fertilizer_repo import (
    FertilizerRepository
)

from app.utils.financial_year import (
    get_financial_year_from_date
)


class FertilizerService:

    def __init__(self):

        self.fertilizer_repo = (
            FertilizerRepository(
                fertilizers_collection
            )
        )

    async def create_fertilizer(
        self,
        user_id: str,
        data
    ):

        if data.quantity <= 0:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Quantity must be greater than 0"
            )

        financial_year = get_financial_year_from_date(
            data.application_date.date()
        )

        normalized_fertilizer_name = (
            data.fertilizer_name.lower().strip()
        )

        existing_fertilizer = await (
            self.fertilizer_repo.check_duplicate_fertilizer(
                user_id=user_id,
                financial_year=financial_year,
                fertilizer_name=normalized_fertilizer_name,
                quantity=data.quantity,
                application_date=data.application_date
            )
        )

        if existing_fertilizer:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Similar fertilizer record already exists"
            )

        fertilizer_data = {

            "user_id": user_id,

            "financial_year": financial_year,

            # ORIGINAL VALUE
            "fertilizer_name": (
                data.fertilizer_name.strip()
            ),

            # NORMALIZED VALUE
            "normalized_fertilizer_name": (
                normalized_fertilizer_name
            ),

            "quantity": data.quantity,

            "unit": data.unit,

            "application_date": data.application_date,

            "notes": data.notes,

            "is_deleted": False,

            "created_at": datetime.now(
                timezone.utc
            ),

            "updated_at": datetime.now(
                timezone.utc
            )
        }

        fertilizer_id = await (
            self.fertilizer_repo.create_fertilizer(
                fertilizer_data
            )
        )

        return {
            "message": "Fertilizer added successfully",
            "fertilizer_id": fertilizer_id
        }

    async def get_all_fertilizers(
        self,
        user_id: str,
        financial_year: str = None,
        search: str = None
    ):

        return await (
            self.fertilizer_repo.get_all_fertilizers(
                user_id=user_id,
                financial_year=financial_year,
                search=search
            )
        )

    async def get_fertilizer_by_id(
        self,
        fertilizer_id: str,
        user_id: str
    ):

        fertilizer = await (
            self.fertilizer_repo.get_fertilizer_by_id(
                fertilizer_id,
                user_id
            )
        )

        if not fertilizer:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Fertilizer not found"
            )

        return fertilizer

    async def update_fertilizer(
        self,
        fertilizer_id: str,
        user_id: str,
        data
    ):

        try:

            ObjectId(fertilizer_id)

        except InvalidId:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid fertilizer id"
            )

        fertilizer = await (
            self.fertilizer_repo.get_fertilizer_by_id(
                fertilizer_id,
                user_id
            )
        )

        if not fertilizer:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Fertilizer not found"
            )

        update_data = data.dict(
            exclude_unset=True
        )

        if (
            "quantity" in update_data
            and
            update_data["quantity"] <= 0
        ):

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Quantity must be greater than 0"
            )

        final_application_date = update_data.get(
            "application_date",
            fertilizer["application_date"]
        )

        final_financial_year = (
            get_financial_year_from_date(
                final_application_date.date()
            )
        )

        final_fertilizer_name = update_data.get(
            "fertilizer_name",
            fertilizer["fertilizer_name"]
        )

        final_quantity = update_data.get(
            "quantity",
            fertilizer["quantity"]
        )

        normalized_fertilizer_name = (
            final_fertilizer_name.lower().strip()
        )

        existing_fertilizer = await (
            self.fertilizer_repo.check_duplicate_fertilizer_for_update(
                fertilizer_id=fertilizer_id,
                user_id=user_id,
                financial_year=final_financial_year,
                fertilizer_name=normalized_fertilizer_name,
                quantity=final_quantity,
                application_date=final_application_date
            )
        )

        if existing_fertilizer:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Similar fertilizer record already exists"
            )

        if "fertilizer_name" in update_data:

            update_data["fertilizer_name"] = (
                update_data["fertilizer_name"].strip()
            )

            update_data[
                "normalized_fertilizer_name"
            ] = (
                update_data["fertilizer_name"]
                .lower()
                .strip()
            )

        if "application_date" in update_data:

            update_data["financial_year"] = (
                get_financial_year_from_date(
                    update_data[
                        "application_date"
                    ].date()
                )
            )

        modified_count = await (
            self.fertilizer_repo.update_fertilizer(
                fertilizer_id,
                user_id,
                update_data
            )
        )

        if modified_count == 0:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Fertilizer not updated"
            )

        return {
            "message": "Fertilizer updated successfully"
        }

    async def delete_fertilizer(
        self,
        fertilizer_id: str,
        user_id: str
    ):

        fertilizer = await (
            self.fertilizer_repo.get_fertilizer_by_id(
                fertilizer_id,
                user_id
            )
        )

        if not fertilizer:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Fertilizer not found"
            )

        modified_count = await (
            self.fertilizer_repo.delete_fertilizer(
                fertilizer_id,
                user_id
            )
        )

        if modified_count == 0:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Fertilizer not deleted"
            )

        return {
            "message": "Fertilizer deleted successfully"
        }