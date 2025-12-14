from fastapi import APIRouter
from typing import Optional

from app.exceptions.locations import (
    LocationNotFoundError,
    LocationNotFoundHTTPError,
    LocationAlreadyExistsError,
    LocationAlreadyExistsHTTPError
)
from app.schemes.locations import (
    SLocationAdd,
    SLocationGet,
    SLocationUpdate,
    SLocationPatch,
    SLocationFilter
)
from app.services.locations import LocationService

router = APIRouter(prefix="/locations", tags=["Локации"])


@router.post("", summary="Создание новой локации")
async def create_new_location(
    location_data: SLocationAdd,
) -> dict[str, str]:
    try:
        await LocationService().create_location(location_data)
    except LocationAlreadyExistsError:
        raise LocationAlreadyExistsHTTPError
    return {"status": "OK"}


@router.get("", summary="Получение списка всех локаций")
async def get_all_locations(
    city: Optional[str] = None,
    region: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
) -> list[SLocationGet]:
    filters = SLocationFilter(city=city, region=region)
    return await LocationService().get_locations(filters=filters, skip=skip, limit=limit)


@router.get("/{id}", summary="Получение конкретной локации")
async def get_location(
    id: int,
) -> SLocationGet:
    return await LocationService().get_location(location_id=id)


@router.put("/{id}", summary="Изменение конкретной локации")
async def update_location(
    location_data: SLocationUpdate,
    id: int,
) -> dict[str, str]:
    try:
        await LocationService().edit_location(location_id=id, location_data=location_data)
    except LocationNotFoundError:
        raise LocationNotFoundHTTPError

    return {"status": "OK"}


@router.patch("/{id}", summary="Частичное изменение конкретной локации")
async def patch_location(
    location_data: SLocationPatch,
    id: int,
) -> dict[str, str]:
    try:
        await LocationService().patch_location(location_id=id, location_data=location_data)
    except LocationNotFoundError:
        raise LocationNotFoundHTTPError

    return {"status": "OK"}


@router.delete("/{id}", summary="Удаление конкретной локации")
async def delete_location(
    id: int,
) -> dict[str, str]:
    try:
        await LocationService().delete_location(location_id=id)
    except LocationNotFoundError:
        raise LocationNotFoundHTTPError

    return {"status": "OK"}