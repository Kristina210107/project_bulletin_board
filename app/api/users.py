from fastapi import APIRouter, HTTPException
from typing import List
import json
import os

router = APIRouter()

DATA_FILE = "app/data/users.json"

def load_users():
    """Загружаем пользователей"""
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return [
            {
                "id": 1,
                "name": "Анна",
                "email": "anna@example.com",
                "trust_score": 4.8,
                "created_at": "2024-01-01T12:00:00"
            }
        ]

@router.get("/", response_model=List[dict])
async def get_users():
    """Получить всех пользователей"""
    return load_users()

@router.get("/{user_id}", response_model=dict)
async def get_user(user_id: int):
    """Получить пользователя по ID"""
    users = load_users()
    user = next((user for user in users if user.get("id") == user_id), None)
    
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    return user

@router.get("/{user_id}/offers", response_model=List[dict])
async def get_user_offers(user_id: int):
    """Получить предложения пользователя"""
    from .items import load_items
    
    users = load_users()
    user = next((user for user in users if user.get("id") == user_id), None)
    
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    items = load_items()
    user_items = [item for item in items if item.get("owner") == user.get("name")]
    
    return user_items