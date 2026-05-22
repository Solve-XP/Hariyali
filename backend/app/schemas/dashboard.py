from pydantic import BaseModel
from typing import List


class DashboardSummary(BaseModel):
    total_income: float
    total_expenses: float
    net_profit: float
    total_farms: int
    total_crops: int
    total_rentals: int


class ChartData(BaseModel):
    label: str
    value: float


class FinancialAnalytics(BaseModel):
    income: List[ChartData]
    expenses: List[ChartData]
