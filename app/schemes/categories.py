# app/schemes/categories.py
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# app/schemes/categories.py
from pydantic import BaseModel
from typing import Optional, List


# ==================== ОСНОВНЫЕ СХЕМЫ ====================

class SCategoryAdd(BaseModel):
    """Схема для добавления категории (используется в API)"""
    name: str
    description: Optional[str] = None


class SCategoryCreate(BaseModel):
    """Схема для создания категории (синоним SCategoryAdd)"""
    name: str
    description: Optional[str] = None


class SCategoryGet(BaseModel):
    """Схема для получения категории"""
    id: int
    name: str
    description: Optional[str] = None
    count: int = 0  # количество товаров в категории

    class Config:
        from_attributes = True


class SCategoryUpdate(BaseModel):
    """Схема для обновления категории"""
    name: Optional[str] = None
    description: Optional[str] = None


class SCategoryPatch(BaseModel):
    """Схема для частичного обновления категории"""
    name: Optional[str] = None
    description: Optional[str] = None


class SCategoryFilter(BaseModel):
    """Схема для фильтрации категорий"""
    name: Optional[str] = None
    
class SCategoryGetWithItems(SCategoryGet):
    """Схема категории с товарами (для репозиториев)"""
    items: List = []