from typing import Optional

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    Query,
    UploadFile
)

from app.schemas.rental import (
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
    equipment_name: str = Form(...),
    price_per_hour: Optional[float] = Form(None),
    price_per_day: Optional[float] = Form(None),
    location: str = Form(...),
    owner_name: str = Form(...),
    phone: str = Form(...),
    description: str = Form(None),
    equipment_photo: UploadFile = File(...),
    current_user=Depends(
        get_current_user
    )
):

    return await rental_service.create_rental(
        str(current_user["_id"]),
        equipment_name,
        price_per_hour,
        price_per_day,
        location,
        owner_name,
        phone,
        description,
        equipment_photo
    )


@router.get("")
async def get_all_rentals(
    financial_year: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):

    return await rental_service.get_all_rentals(
        financial_year,
        search
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
    equipment_name: Optional[str] = Form(None),
    price_per_hour: Optional[float] = Form(None),
    price_per_day: Optional[float] = Form(None),
    location: Optional[str] = Form(None),
    owner_name: Optional[str] = Form(None),
    phone: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    is_available: Optional[bool] = Form(None),
    equipment_photo: UploadFile = File(None),
    current_user=Depends(
        get_current_user
    )
):

    data = RentalUpdate(
        equipment_name=equipment_name,
        price_per_hour=price_per_hour,
        price_per_day=price_per_day,
        location=location,
        owner_name=owner_name,
        phone=phone,
        description=description,
        is_available=is_available
    )

    return await rental_service.update_rental(
        rental_id,
        str(current_user["_id"]),
        data,
        equipment_photo
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