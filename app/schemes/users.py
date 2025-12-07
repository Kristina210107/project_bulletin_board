from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    phone: Optional[str] = None
    is_verified: bool = False
    image_id: Optional[int] = None


class UserCreate(UserBase):
    pass


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    is_verified: Optional[bool] = None
    image_id: Optional[int] = None


class User(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True