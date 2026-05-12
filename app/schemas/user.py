from pydantic import BaseModel


class UserOut(BaseModel):
    id: str
    name: str
    phone: str
    status: str