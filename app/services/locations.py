# app/services/locations.py
from typing import Optional
from app.exceptions.locations import LocationNotFoundError, LocationAlreadyExistsError
from app.schemes.locations import SLocationCreate, SLocationUpdate, SLocationPatch
from app.services.base import BaseService


class LocationService(BaseService):

    async def create_location(self, location_data: SLocationCreate):
        try:
            # Создание нового места
            new_location = await self.db.locations.create(location_data.model_dump())
            await self.db.commit()
            return new_location
        except Exception as e:
            await self.db.rollback()
            raise e

    async def get_location(self, location_id: int):
        location = await self.db.locations.get_one_or_none(id=location_id)
        if not location:
            raise LocationNotFoundError
        return location

    async def update_location(self, location_id: int, location_data: SLocationUpdate):
        location = await self.db.locations.get_one_or_none(id=location_id)
        if not location:
            raise LocationNotFoundError
        # Обновление данных места
        updated_location = await self.db.locations.update(location_id, location_data.model_dump())
        await self.db.commit()
        return updated_location

    async def patch_location(self, location_id: int, location_data: SLocationPatch):
        location = await self.db.locations.get_one_or_none(id=location_id)
        if not location:
            raise LocationNotFoundError
        # Обновление только непустых полей
        patch_data = location_data.model_dump(exclude_unset=True)
        if patch_data:
            await self.db.locations.update(location_id, patch_data)
            await self.db.commit()
        return

    async def delete_location(self, location_id: int):
        location = await self.db.locations.get_one_or_none(id=location_id)
        if not location:
            raise LocationNotFoundError
        await self.db.locations.delete(location_id)
        await self.db.commit()
        return

    async def get_locations(self):
        return await self.db.locations.get_all()