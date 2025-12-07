from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class MessageBase(BaseModel):
    sender_id: int
    recipient_id: int
    item_id: int
    text: str


class MessageCreate(MessageBase):
    pass


class MessageUpdate(BaseModel):
    text: Optional[str] = None


class Message(MessageBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True