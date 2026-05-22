# app/services/dashboard_service.py

from app.repositories.dashboard_repo import DashboardRepository


class DashboardService:

    def __init__(self):

        self.repo = DashboardRepository()

    async def get_dashboard_summary(
        self,
        user_id: str,
        financial_year: str
    ):

        data = await self.repo.get_dashboard_summary(
            user_id,
            financial_year
        )

        return {
            "success": True,
            "data": data
        }

    async def get_financial_analytics(
        self,
        user_id: str,
        financial_year: str
    ):

        data = await self.repo.get_financial_analytics(
            user_id,
            financial_year
        )

        return {
            "success": True,
            "data": data
        }

    async def get_recent_incomes(
        self,
        user_id: str
    ):

        data = await self.repo.get_recent_incomes(
            user_id
        )

        return {
            "success": True,
            "data": data
        }

    async def get_recent_expenses(
        self,
        user_id: str
    ):

        data = await self.repo.get_recent_expenses(
            user_id
        )

        return {
            "success": True,
            "data": data
        }

    async def get_recent_rentals(
        self,
        user_id: str
    ):

        data = await self.repo.get_recent_rentals(
            user_id
        )

        return {
            "success": True,
            "data": data
        }

    async def get_expense_breakdown(
        self,
        user_id: str,
        financial_year: str
    ):

        data = await self.repo.get_expense_breakdown(
            user_id,
            financial_year
        )

        return {
            "success": True,
            "data": data
        }

    async def get_income_breakdown(
        self,
        user_id: str,
        financial_year: str
    ):

        data = await self.repo.get_income_breakdown(
            user_id,
            financial_year
        )

        return {
            "success": True,
            "data": data
        }

    async def get_filter_options(
        self,
        user_id: str
    ):

        data = await self.repo.get_filter_options(
            user_id
        )

        return {
            "success": True,
            "data": data
        }