# app/services/messages.py
from typing import Optional
from app.exceptions.messages import MessageNotFoundError
from app.schemes.messages import SMessageCreate, SMessageUpdate, SMessagePatch
from app.services.base import BaseService


class MessageService(BaseService):

    async def create_message(self, message_data: SMessageCreate):
        try:
            # Создание нового сообщения
            new_message = await self.db.messages.create(message_data.model_dump())
            await self.db.commit()
            return new_message
        except Exception as e:
            await self.db.rollback()
            raise e

    async def get_message(self, message_id: int):
        message = await self.db.messages.get_one_or_none(id=message_id)
        if not message:
            raise MessageNotFoundError
        return message

    async def update_message(self, message_id: int, message_data: SMessageUpdate):
        message = await self.db.messages.get_one_or_none(id=message_id)
        if not message:
            raise MessageNotFoundError
        # Обновление данных сообщения
        updated_message = await self.db.messages.update(message_id, message_data.model_dump())
        await self.db.commit()
        return updated_message

    async def patch_message(self, message_id: int, message_data: SMessagePatch):
        message = await self.db.messages.get_one_or_none(id=message_id)
        if not message:
            raise MessageNotFoundError
        # Обновление только непустых полей
        patch_data = message_data.model_dump(exclude_unset=True)
        if patch_data:
            await self.db.messages.update(message_id, patch_data)
            await self.db.commit()
        return

    async def delete_message(self, message_id: int):
        message = await self.db.messages.get_one_or_none(id=message_id)
        if not message:
            raise MessageNotFoundError
        await self.db.messages.delete(message_id)
        await self.db.commit()
        return

    async def get_messages(self):
        return await self.db.messages.get_all()