from typing import Optional
from pydantic import BaseModel


class LocationBase(BaseModel):
    city: str
    region: str


class LocationCreate(LocationBase):
    pass


class LocationUpdate(BaseModel):
    city: Optional[str] = None
    region: Optional[str] = None


class Location(LocationBase):
    id: int

    class Config:
        from_attributes = True