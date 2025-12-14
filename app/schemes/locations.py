from pydantic import BaseModel
from typing import Optional, List

# ==================== ОСНОВНЫЕ СХЕМЫ ====================

class SLocationGet(BaseModel):
    """Схема для получения локации"""
    id: int
    city: str
    region: str

    class Config:
        from_attributes = True


class SLocationGetWithItems(SLocationGet):
    """Схема локации с товарами (для репозиториев)"""
    items: List = []  # или List['SItemGet']


# ==================== ДЛЯ API ====================

class SLocationAdd(BaseModel):
    """Схема для добавления локации"""
    city: str
    region: str


SLocationCreate = SLocationAdd  # Алиас для совместимости


class SLocationUpdate(BaseModel):
    """Схема для обновления локации"""
    city: Optional[str] = None
    region: Optional[str] = None


class SLocationPatch(BaseModel):
    """Схема для частичного обновления локации"""
    city: Optional[str] = None
    region: Optional[str] = None


class SLocationFilter(BaseModel):
    """Схема для фильтрации локаций"""
    city: Optional[str] = None
    region: Optional[str] = None