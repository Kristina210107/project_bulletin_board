from fastapi import APIRouter
from typing import Optional

from app.exceptions.items import (
    ItemNotFoundError,
    ItemNotFoundHTTPError,
    ItemAlreadyExistsError,
    ItemAlreadyExistsHTTPError
)
from app.schemes.items import (
    SItemAdd,
    SItemGet,
    SItemUpdate,
    SItemPatch,
    SItemFilter
)
from app.services.items import ItemService

router = APIRouter(prefix="/items", tags=["Товары"])


@router.post("", summary="Создание нового товара")
async def create_new_item(
    item_data: SItemAdd,
) -> dict[str, str]:
    try:
        await ItemService().create_item(item_data)
    except ItemAlreadyExistsError:
        raise ItemAlreadyExistsHTTPError
    return {"status": "OK"}


@router.get("", summary="Получение списка всех товаров")
async def get_all_items(
    category_id: Optional[int] = None,
    location_id: Optional[int] = None,
    user_id: Optional[int] = None,
    is_active: Optional[bool] = None,
    skip: int = 0,
    limit: int = 100
) -> list[SItemGet]:
    filters = SItemFilter(
        category_id=category_id,
        location_id=location_id,
        user_id=user_id,
        is_active=is_active
    )
    return await ItemService().get_items(filters=filters, skip=skip, limit=limit)


@router.get("/{id}", summary="Получение конкретного товара")
async def get_item(
    id: int,
) -> SItemGet:
    return await ItemService().get_item(item_id=id)


@router.put("/{id}", summary="Изменение конкретного товара")
async def update_item(
    item_data: SItemUpdate,
    id: int,
) -> dict[str, str]:
    try:
        await ItemService().edit_item(item_id=id, item_data=item_data)
    except ItemNotFoundError:
        raise ItemNotFoundHTTPError

    return {"status": "OK"}


@router.patch("/{id}", summary="Частичное изменение конкретного товара")
async def patch_item(
    item_data: SItemPatch,
    id: int,
) -> dict[str, str]:
    try:
        await ItemService().patch_item(item_id=id, item_data=item_data)
    except ItemNotFoundError:
        raise ItemNotFoundHTTPError

    return {"status": "OK"}


@router.delete("/{id}", summary="Удаление конкретного товара")
async def delete_item(
    id: int,
) -> dict[str, str]:
    try:
        await ItemService().delete_item(item_id=id)
    except ItemNotFoundError:
        raise ItemNotFoundHTTPError

    return {"status": "OK"}


@router.get("/user/{user_id}", summary="Получение товаров пользователя")
async def get_user_items(
    user_id: int,
    skip: int = 0,
    limit: int = 100
) -> list[SItemGet]:
    return await ItemService().get_user_items(user_id=user_id, skip=skip, limit=limit)