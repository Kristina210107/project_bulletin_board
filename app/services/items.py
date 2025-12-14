# app/services/items.py
from typing import Optional
from app.exceptions.items import ItemNotFoundError, ItemAlreadyExistsError
from app.schemes.items import SItemCreate, SItemUpdate, SItemPatch
from app.services.base import BaseService


class ItemService(BaseService):

    async def create_item(self, item_data: SItemCreate):
        try:
            # Создание нового объявления
            new_item = await self.db.items.create(item_data.model_dump())
            await self.db.commit()
            return new_item
        except Exception as e:
            await self.db.rollback()
            raise e

    async def get_item(self, item_id: int):
        item = await self.db.items.get_one_or_none(id=item_id)
        if not item:
            raise ItemNotFoundError
        return item

    async def update_item(self, item_id: int, item_data: SItemUpdate):
        item = await self.db.items.get_one_or_none(id=item_id)
        if not item:
            raise ItemNotFoundError
        # Обновление данных объявления
        updated_item = await self.db.items.update(item_id, item_data.model_dump())
        await self.db.commit()
        return updated_item

    async def patch_item(self, item_id: int, item_data: SItemPatch):
        item = await self.db.items.get_one_or_none(id=item_id)
        if not item:
            raise ItemNotFoundError
        # Обновление только непустых полей
        patch_data = item_data.model_dump(exclude_unset=True)
        if patch_data:
            await self.db.items.update(item_id, patch_data)
            await self.db.commit()
        return

    async def delete_item(self, item_id: int):
        item = await self.db.items.get_one_or_none(id=item_id)
        if not item:
            raise ItemNotFoundError
        await self.db.items.delete(item_id)
        await self.db.commit()
        return

    async def get_items(self):
        return await self.db.items.get_all()