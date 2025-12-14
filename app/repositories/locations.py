# app/repositories/location_repository.py
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.models.locations import LocationModel
from app.schemes.locations import SLocationGet, SLocationGetWithItems
from .base import BaseRepository


class LocationsRepository(BaseRepository):
    model = LocationModel
    schema = SLocationGet

    async def get_one_or_none_with_items(self, **filter_by):
        query = (
            select(self.model)
            .filter_by(**filter_by)
            .options(selectinload(self.model.items))
        )

        result = await self.session.execute(query)

        model = result.scalars().one_or_none()
        if model is None:
            return None

        result = SLocationGetWithItems.model_validate(model, from_attributes=True)
        return result