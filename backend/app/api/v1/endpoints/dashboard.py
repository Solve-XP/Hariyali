# app/api/v1/endpoints/dashboard.py

from fastapi import (
    APIRouter,
    Depends,
    Query
)

from app.api.dependencies.auth import get_current_user
from app.services.dashboard_service import DashboardService


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

dashboard_service = DashboardService()


@router.get("/summary")
async def get_dashboard_summary(
    financial_year: str = Query(...),
    current_user=Depends(get_current_user)
):

    return await dashboard_service.get_dashboard_summary(
        str(current_user["_id"]),
        financial_year
    )


@router.get("/financial-analytics")
async def get_financial_analytics(
    financial_year: str = Query(...),
    current_user=Depends(get_current_user)
):

    return await dashboard_service.get_financial_analytics(
        str(current_user["_id"]),
        financial_year
    )


@router.get("/recent-incomes")
async def get_recent_incomes(
    current_user=Depends(get_current_user)
):

    return await dashboard_service.get_recent_incomes(
        str(current_user["_id"])
    )


@router.get("/recent-expenses")
async def get_recent_expenses(
    current_user=Depends(get_current_user)
):

    return await dashboard_service.get_recent_expenses(
        str(current_user["_id"])
    )


@router.get("/recent-rentals")
async def get_recent_rentals(
    current_user=Depends(get_current_user)
):

    return await dashboard_service.get_recent_rentals(
        str(current_user["_id"])
    )


@router.get("/expense-breakdown")
async def get_expense_breakdown(
    financial_year: str = Query(...),
    current_user=Depends(get_current_user)
):

    return await dashboard_service.get_expense_breakdown(
        str(current_user["_id"]),
        financial_year
    )


@router.get("/income-breakdown")
async def get_income_breakdown(
    financial_year: str = Query(...),
    current_user=Depends(get_current_user)
):

    return await dashboard_service.get_income_breakdown(
        str(current_user["_id"]),
        financial_year
    )


@router.get("/filter-options")
async def get_filter_options(
    current_user=Depends(get_current_user)
):

    return await dashboard_service.get_filter_options(
        str(current_user["_id"])
    )