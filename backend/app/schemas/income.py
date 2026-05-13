from pydantic import BaseModel

from typing import Optional

from datetime import datetime


class IncomeCreate(BaseModel):

    farm_id: str

    crop_id: str

    harvest_quantity: float

    unit: str

    amount: float

    income_date: datetime

    notes: Optional[str] = None


class IncomeUpdate(BaseModel):

    farm_id: Optional[str] = None

    crop_id: Optional[str] = None

    harvest_quantity: Optional[float] = None

    unit: Optional[str] = None

    amount: Optional[float] = None

    income_date: Optional[datetime] = None

    notes: Optional[str] = None