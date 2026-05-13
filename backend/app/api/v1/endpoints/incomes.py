from typing import Optional

from fastapi import APIRouter
from fastapi import Depends
from fastapi import Query

from app.schemas.income import (
    IncomeCreate,
    IncomeUpdate
)

from app.services.income_service import (
    IncomeService
)

from app.api.dependencies.auth import (
    get_current_user
)


router = APIRouter(
    prefix="/incomes",
    tags=["Incomes"]
)

income_service = (
    IncomeService()
)


@router.post("")
async def create_income(
    data: IncomeCreate,
    current_user=Depends(
        get_current_user
    )
):

    return await income_service.create_income(
        str(current_user["_id"]),
        data
    )


@router.get("")
async def get_all_incomes(
    farm_id: Optional[str] = Query(None),
    crop_id: Optional[str] = Query(None),
    financial_year: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    current_user=Depends(
        get_current_user
    )
):

    return await income_service.get_all_incomes(
        str(current_user["_id"]),
        farm_id,
        crop_id,
        financial_year,
        search
    )


@router.get("/{income_id}")
async def get_income_by_id(
    income_id: str,
    current_user=Depends(
        get_current_user
    )
):

    return await income_service.get_income_by_id(
        income_id,
        str(current_user["_id"])
    )


@router.patch("/{income_id}")
async def update_income(
    income_id: str,
    data: IncomeUpdate,
    current_user=Depends(
        get_current_user
    )
):

    return await income_service.update_income(
        income_id,
        str(current_user["_id"]),
        data
    )


@router.delete("/{income_id}")
async def delete_income(
    income_id: str,
    current_user=Depends(
        get_current_user
    )
):

    return await income_service.delete_income(
        income_id,
        str(current_user["_id"])
    )