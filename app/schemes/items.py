from datetime import datetime
from typing import Optional
from pydantic import BaseModel


# app/schemes/items.py
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# ==================== ОСНОВНЫЕ СХЕМЫ ====================

class SItemGet(BaseModel):
    id: int
    title: str
    description: str
    condition: str
    is_active: bool = True
    user_id: int
    category_id: int
    location_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class SItemGetWithRels(SItemGet):
    owner: Optional[dict] = None
    category: Optional[dict] = None
    location: Optional[dict] = None


# ==================== ДЛЯ API ====================

class SItemAdd(BaseModel):
    """Схема для добавления товара"""
    title: str
    description: str
    condition: str
    user_id: int
    category_id: int
    location_id: int


class SItemCreate(BaseModel):
    """Схема для создания товара (может отличаться от SItemAdd)"""
    title: str
    description: str
    condition: str
    category_id: int
    location_id: int


class SItemUpdate(BaseModel):
    """Схема для обновления товара"""
    title: Optional[str] = None
    description: Optional[str] = None
    condition: Optional[str] = None
    is_active: Optional[bool] = None
    category_id: Optional[int] = None
    location_id: Optional[int] = None


class SItemPatch(BaseModel):
    """Схема для частичного обновления товара"""
    title: Optional[str] = None
    description: Optional[str] = None
    condition: Optional[str] = None
    is_active: Optional[bool] = None
    category_id: Optional[int] = None
    location_id: Optional[int] = None


class SItemFilter(BaseModel):
    """Схема для фильтрации товаров"""
    category_id: Optional[int] = None
    location_id: Optional[int] = None
    user_id: Optional[int] = None
    is_active: Optional[bool] = None
    title: Optional[str] = None