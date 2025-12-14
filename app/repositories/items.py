# app/repositories/item_repository.py
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.models.items import ItemModel
from app.schemes.items import SItemGet, SItemGetWithRels
from .base import BaseRepository


class ItemsRepository(BaseRepository):
    model = ItemModel
    schema = SItemGet

    async def get_one_or_none_with_relations(self, **filter_by):
        query = (
            select(self.model)
            .filter_by(**filter_by)
            .options(selectinload(self.model.owner))
            .options(selectinload(self.model.category))
            .options(selectinload(self.model.location))
        )

        result = await self.session.execute(query)

        model = result.scalars().one_or_none()
        if model is None:
            return None

        result = SItemGetWithRels.model_validate(model, from_attributes=True)
        return result

    async def get_all_with_relations(self):
        query = (
            select(self.model)
            .options(selectinload(self.model.owner))
            .options(selectinload(self.model.category))
            .options(selectinload(self.model.location))
        )

        result = await self.session.execute(query)
        models = result.scalars().all()

        return [SItemGetWithRels.model_validate(m, from_attributes=True) for m in models]