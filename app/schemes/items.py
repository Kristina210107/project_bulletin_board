from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class ItemBase(BaseModel):
    title: str
    description: Optional[str] = None
    condition: Optional[str] = None
    is_active: bool = True
    user_id: int
    category_id: int
    location_id: int


class ItemCreate(ItemBase):
    pass


class ItemUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    condition: Optional[str] = None
    is_active: Optional[bool] = None
    category_id: Optional[int] = None
    location_id: Optional[int] = None


class Item(ItemBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True