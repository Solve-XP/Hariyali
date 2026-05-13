from pydantic import BaseModel

from typing import Optional

from datetime import datetime


class ExpenseCreate(BaseModel):

    farm_id: str

    crop_id: Optional[str] = None

    category: str

    item_name: str

    quantity: Optional[float] = None

    unit: Optional[str] = None

    amount: float

    payment_method: str

    expense_date: datetime

    notes: Optional[str] = None


class ExpenseUpdate(BaseModel):

    farm_id: Optional[str] = None

    crop_id: Optional[str] = None

    category: Optional[str] = None

    item_name: Optional[str] = None

    quantity: Optional[float] = None

    unit: Optional[str] = None

    amount: Optional[float] = None

    payment_method: Optional[str] = None

    expense_date: Optional[datetime] = None

    notes: Optional[str] = None