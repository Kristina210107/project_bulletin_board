from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemes import review as review_scheme

router = APIRouter(prefix="/reviews", tags=["reviews"])


@router.get("/", response_model=List[review_scheme.Review])
def get_reviews(
    skip: int = 0,
    limit: int = 100,
    item_id: Optional[int] = None,
    user_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Получить список отзывов"""
    # Временная заглушка
    return []


@router.get("/{review_id}", response_model=review_scheme.Review)
def get_review(review_id: int, db: Session = Depends(get_db)):
    """Получить отзыв по ID"""
    if review_id <= 0:
        raise HTTPException(status_code=404, detail="Review not found")
    return {
        "id": review_id,
        "user_id": 1,
        "item_id": 1,
        "rating": 5,
        "comment": f"Great product {review_id}",
        "created_at": "2024-01-01T00:00:00"
    }


@router.post("/", response_model=review_scheme.Review)
def create_review(review: review_scheme.ReviewCreate, db: Session = Depends(get_db)):
    """Создать новый отзыв"""
    return {
        "id": 1,
        **review.dict(),
        "created_at": "2024-01-01T00:00:00"
    }


@router.put("/{review_id}", response_model=review_scheme.Review)
def update_review(
    review_id: int,
    review_update: review_scheme.ReviewUpdate,
    db: Session = Depends(get_db)
):
    """Обновить отзыв"""
    return {
        "id": review_id,
        "user_id": 1,
        "item_id": 1,
        "rating": review_update.rating or 4,
        "comment": review_update.comment or f"Updated review {review_id}",
        "created_at": "2024-01-01T00:00:00"
    }


@router.delete("/{review_id}")
def delete_review(review_id: int, db: Session = Depends(get_db)):
    """Удалить отзыв"""
    return {"message": f"Review {review_id} deleted successfully"}


@router.get("/item/{item_id}/reviews", response_model=List[review_scheme.Review])
def get_item_reviews(
    item_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Получить все отзывы для товара"""
    # Временная заглушка
    return []


@router.get("/item/{item_id}/average-rating")
def get_item_average_rating(item_id: int, db: Session = Depends(get_db)):
    """Получить средний рейтинг товара"""
    return {"item_id": item_id, "average_rating": 4.5}