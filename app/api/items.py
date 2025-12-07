from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemes import item as item_scheme

router = APIRouter(prefix="/items", tags=["items"])


@router.get("/", response_model=List[item_scheme.Item])
def get_items(
    skip: int = 0,
    limit: int = 100,
    category_id: Optional[int] = None,
    location_id: Optional[int] = None,
    user_id: Optional[int] = None,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """Получить список товаров с фильтрами"""
    # Временная заглушка
    return []


@router.get("/{item_id}", response_model=item_scheme.Item)
def get_item(item_id: int, db: Session = Depends(get_db)):
    """Получить товар по ID"""
    if item_id <= 0:
        raise HTTPException(status_code=404, detail="Item not found")
    return {
        "id": item_id,
        "title": f"Item {item_id}",
        "description": f"Description for item {item_id}",
        "condition": "new",
        "is_active": True,
        "user_id": 1,
        "category_id": 1,
        "location_id": 1,
        "created_at": "2024-01-01T00:00:00"
    }


@router.post("/", response_model=item_scheme.Item)
def create_item(item: item_scheme.ItemCreate, db: Session = Depends(get_db)):
    """Создать новый товар"""
    return {
        "id": 1,
        **item.dict(),
        "created_at": "2024-01-01T00:00:00"
    }


@router.put("/{item_id}", response_model=item_scheme.Item)
def update_item(
    item_id: int,
    item_update: item_scheme.ItemUpdate,
    db: Session = Depends(get_db)
):
    """Обновить данные товара"""
    return {
        "id": item_id,
        "title": f"Updated Item {item_id}",
        "description": "Updated description",
        "condition": "used",
        "is_active": True,
        "user_id": 1,
        "category_id": 1,
        "location_id": 1,
        "created_at": "2024-01-01T00:00:00"
    }


@router.delete("/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db)):
    """Удалить товар"""
    return {"message": f"Item {item_id} deleted successfully"}


@router.get("/user/{user_id}/items", response_model=List[item_scheme.Item])
def get_user_items(
    user_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Получить все товары пользователя"""
    # Временная заглушка
    return []