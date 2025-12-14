# app/schemes/reviews.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# ==================== ОСНОВНЫЕ СХЕМЫ ====================

class SReviewGet(BaseModel):
    """Схема для получения отзыва"""
    id: int
    user_id: int
    item_id: int
    rating: int
    comment: str
    created_at: datetime

    class Config:
        from_attributes = True


class SReviewGetWithRels(SReviewGet):
    """Схема отзыва с отношениями"""
    user: Optional[dict] = None
    item: Optional[dict] = None


# ==================== ДЛЯ API ====================

class SReviewAdd(BaseModel):
    """Схема для добавления отзыва"""
    item_id: int
    rating: int
    comment: str


SReviewCreate = SReviewAdd  # Алиас для совместимости


class SReviewUpdate(BaseModel):
    """Схема для обновления отзыва"""
    rating: Optional[int] = None
    comment: Optional[str] = None


class SReviewPatch(BaseModel):
    """Схема для частичного обновления отзыва"""
    rating: Optional[int] = None
    comment: Optional[str] = None


class SReviewFilter(BaseModel):
    """Схема для фильтрации отзывов"""
    item_id: Optional[int] = None
    user_id: Optional[int] = None
    min_rating: Optional[int] = None
    max_rating: Optional[int] = None
    
ReviewCreate = SReviewAdd
ReviewUpdate = SReviewUpdate