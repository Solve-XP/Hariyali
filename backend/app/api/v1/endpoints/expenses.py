from typing import Optional

from fastapi import APIRouter
from fastapi import Depends
from fastapi import Query

from app.schemas.expense import (
    ExpenseCreate,
    ExpenseUpdate
)

from app.services.expense_service import (
    ExpenseService
)

from app.api.dependencies.auth import (
    get_current_user
)


router = APIRouter(
    prefix="/expenses",
    tags=["Expenses"]
)

expense_service = (
    ExpenseService()
)


@router.post("")
async def create_expense(
    data: ExpenseCreate,
    current_user=Depends(
        get_current_user
    )
):

    return await expense_service.create_expense(
        str(current_user["_id"]),
        data
    )


@router.get("")
async def get_all_expenses(
    farm_id: Optional[str] = Query(None),
    crop_id: Optional[str] = Query(None),
    financial_year: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    current_user=Depends(
        get_current_user
    )
):

    return await expense_service.get_all_expenses(
        str(current_user["_id"]),
        farm_id,
        crop_id,
        financial_year,
        category,
        search
    )


@router.get("/{expense_id}")
async def get_expense_by_id(
    expense_id: str,
    current_user=Depends(
        get_current_user
    )
):

    return await expense_service.get_expense_by_id(
        expense_id,
        str(current_user["_id"])
    )


@router.patch("/{expense_id}")
async def update_expense(
    expense_id: str,
    data: ExpenseUpdate,
    current_user=Depends(
        get_current_user
    )
):

    return await expense_service.update_expense(
        expense_id,
        str(current_user["_id"]),
        data
    )


@router.delete("/{expense_id}")
async def delete_expense(
    expense_id: str,
    current_user=Depends(
        get_current_user
    )
):

    return await expense_service.delete_expense(
        expense_id,
        str(current_user["_id"])
    )