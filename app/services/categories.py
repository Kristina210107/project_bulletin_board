# app/services/categories.py
from typing import Optional
from app.exceptions.categories import CategoryNotFoundError, CategoryAlreadyExistsError
from app.schemes.categories import SCategoryCreate, SCategoryUpdate, SCategoryPatch
from app.services.base import BaseService


class CategoryService(BaseService):

    async def create_category(self, category_data: SCategoryCreate):
        try:
            # Проверка на существование категории по имени
            existing_category = await self.db.categories.get_by_name(category_data.name)
            if existing_category:
                raise CategoryAlreadyExistsError
            # Создание новой категории
            new_category = await self.db.categories.create(category_data.model_dump())
            await self.db.commit()
            return new_category
        except Exception as e:
            await self.db.rollback()
            raise e

    async def get_category(self, category_id: int):
        category = await self.db.categories.get_one_or_none(id=category_id)
        if not category:
            raise CategoryNotFoundError
        return category

    async def update_category(self, category_id: int, category_data: SCategoryUpdate):
        category = await self.db.categories.get_one_or_none(id=category_id)
        if not category:
            raise CategoryNotFoundError
        # Обновление данных категории
        updated_category = await self.db.categories.update(category_id, category_data.model_dump())
        await self.db.commit()
        return updated_category

    async def patch_category(self, category_id: int, category_data: SCategoryPatch):
        category = await self.db.categories.get_one_or_none(id=category_id)
        if not category:
            raise CategoryNotFoundError
        # Обновление только непустых полей
        patch_data = category_data.model_dump(exclude_unset=True)
        if patch_data:
            await self.db.categories.update(category_id, patch_data)
            await self.db.commit()
        return

    async def delete_category(self, category_id: int):
        category = await self.db.categories.get_one_or_none(id=category_id)
        if not category:
            raise CategoryNotFoundError
        await self.db.categories.delete(category_id)
        await self.db.commit()
        return

    async def get_categories(self):
        return await self.db.categories.get_all()