from fastapi import APIRouter, HTTPException
from typing import List

router = APIRouter()

@router.get("/")
async def get_conversations():
    """Получить все чаты"""
    return [
        {
            "id": 1,
            "partner": "Ольга",
            "last_message": "Привет! Интересуюсь вашим предложением...",
            "unread": 2,
            "time": "12:30"
        },
        {
            "id": 2,
            "partner": "Марат",
            "last_message": "Готов обменять настольную игру",
            "unread": 0,
            "time": "Вчера"
        }
    ]

@router.get("/{conversation_id}")
async def get_messages(conversation_id: int):
    """Получить сообщения чата"""
    if conversation_id == 1:
        return [
            {
                "id": 1,
                "sender": "Ольга",
                "text": "Привет! Интересуюсь вашим предложением по обмену книг.",
                "time": "12:30",
                "is_me": False
            },
            {
                "id": 2,
                "sender": "Я",
                "text": "Здравствуйте! Отлично, можете прислать фото?",
                "time": "12:32",
                "is_me": True
            }
        ]
    
    raise HTTPException(status_code=404, detail="Чат не найден")