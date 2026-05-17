from pydantic import BaseModel

from typing import Optional


class RentalUpdate(BaseModel):

    equipment_name: Optional[str] = None

    price_per_hour: Optional[float] = None

    price_per_day: Optional[float] = None

    location: Optional[str] = None

    owner_name: Optional[str] = None

    phone: Optional[str] = None

    description: Optional[str] = None

    is_available: Optional[bool] = None