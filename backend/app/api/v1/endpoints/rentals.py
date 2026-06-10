# app/api/v1/endpoints/rentals.py

from typing import (
    Optional
)

from fastapi import (
    APIRouter,
    Depends,
    Query
)

from app.schemas.rental import (
    RentalCreate,
    RentalUpdate
)

from app.services.rental_service import (
    RentalService
)

from app.api.dependencies.auth import (
    get_current_user
)


router = APIRouter(
    prefix="/rentals",
    tags=["Rentals"]
)

rental_service = (
    RentalService()
)


@router.post("")
async def create_rental(

    payload: RentalCreate,

    current_user=Depends(
        get_current_user
    )
):

    return await rental_service.create_rental(

        str(current_user["_id"]),

        payload
    )

@router.get("")
async def get_all_rentals(

    financial_year: Optional[str] = Query(None),

    search: Optional[str] = Query(None),

    exclude_my_listings: bool = Query(False),

    current_user=Depends(
        get_current_user
    )
):

    return await rental_service.get_all_rentals(

        financial_year,

        search,

        str(current_user["_id"]),

        exclude_my_listings
    )

@router.get("/public")
async def get_public_rentals(

    financial_year: Optional[str] = None,

    search: Optional[str] = None
):

    return await rental_service.get_public_rentals(
        financial_year,
        search
    )


@router.get("/my-listings")
async def get_my_rentals(

    current_user=Depends(
        get_current_user
    )
):

    return await rental_service.get_my_rentals(
        str(current_user["_id"])
    )


@router.get("/{rental_id}")
async def get_rental_by_id(
    rental_id: str
):

    return await rental_service.get_rental_by_id(
        rental_id
    )

@router.patch("/{rental_id}")
async def update_rental(

    rental_id: str,

    payload: RentalUpdate,

    current_user=Depends(
        get_current_user
    )
):

    return await rental_service.update_rental(

        rental_id,

        str(current_user["_id"]),

        payload
    )

@router.delete("/{rental_id}")
async def delete_rental(

    rental_id: str,

    current_user=Depends(
        get_current_user
    )
):

    return await rental_service.delete_rental(
        rental_id,
        str(current_user["_id"])
    )