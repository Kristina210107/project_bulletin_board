# app/repositories/messages.py
from sqlalchemy import select, or_, and_
from typing import List
from app.schemes.messages import SMessageAdd as MessageCreate, SMessageUpdate as MessageUpdate
from app.models.messages import MessageModel as Message
from .base import BaseRepository


class MessagesRepository(BaseRepository):
    def __init__(self, session):
        super().__init__(session)  # ← передаем только session
        self.model = Message  # ← устанавливаем модель отдельно

    async def get_conversation(self, user1_id: int, user2_id: int) -> List[Message]:
        result = await self.session.execute(
            select(Message).where(
                or_(
                    and_(Message.sender_id == user1_id, Message.recipient_id == user2_id),
                    and_(Message.sender_id == user2_id, Message.recipient_id == user1_id)
                )
            ).order_by(Message.created_at)
        )
        return result.scalars().all()

    async def get_user_messages(self, user_id: int) -> List[Message]:
        result = await self.session.execute(
            select(Message).where(
                or_(
                    Message.sender_id == user_id,
                    Message.recipient_id == user_id
                )
            ).order_by(Message.created_at.desc())
        )
        return result.scalars().all()

    async def mark_as_read(self, message_id: int, user_id: int) -> bool:
        try:
            message = await self.get(message_id)
            if message and message.recipient_id == user_id:
                message.is_read = True
                await self.session.commit()
                return True
            return False
        except Exception:
            await self.session.rollback()
            return False

    async def get(self, message_id: int) -> Message:
        result = await self.session.execute(
            select(Message).where(Message.id == message_id)
        )
        return result.scalars().first()

