from pydantic import BaseModel

from typing import Optional

from datetime import datetime


class FertilizerCreate(BaseModel):

    fertilizer_name: str

    quantity: float

    unit: str

    application_date: datetime

    notes: Optional[str] = None


class FertilizerUpdate(BaseModel):

    fertilizer_name: Optional[str] = None

    quantity: Optional[float] = None

    unit: Optional[str] = None

    application_date: Optional[datetime] = None

    notes: Optional[str] = None