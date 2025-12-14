# app/schemes/messages.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# ==================== ОСНОВНЫЕ СХЕМЫ ====================

class SMessageGet(BaseModel):
    """Схема для получения сообщения"""
    id: int
    text: str
    sender_id: int
    receiver_id: int
    is_read: bool = False
    created_at: datetime

    class Config:
        from_attributes = True


class SMessageGetWithRels(SMessageGet):
    """Схема сообщения с отношениями"""
    sender: Optional[dict] = None
    receiver: Optional[dict] = None


# ==================== ДЛЯ API ====================

class SMessageAdd(BaseModel):
    """Схема для добавления сообщения"""
    text: str
    receiver_id: int


SMessageCreate = SMessageAdd  # Алиас для совместимости


class SMessageUpdate(BaseModel):
    """Схема для обновления сообщения"""
    text: Optional[str] = None
    is_read: Optional[bool] = None


class SMessagePatch(BaseModel):
    """Схема для частичного обновления сообщения"""
    text: Optional[str] = None
    is_read: Optional[bool] = None


# ==================== ДЛЯ ЧАТОВ ====================

class SConversationGet(BaseModel):
    """Схема для получения чата"""
    id: int
    partner_name: str
    last_message: str
    unread_count: int = 0
    last_message_time: str


class SConversationList(BaseModel):
    """Схема для списка чатов"""
    id: int
    partner: str
    last_message: str
    unread: int
    time: str