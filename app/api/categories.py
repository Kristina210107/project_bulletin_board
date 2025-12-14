from fastapi import APIRouter

from app.exceptions.categories import (
    CategoryNotFoundError,
    CategoryNotFoundHTTPError,
    CategoryAlreadyExistsError,
    CategoryAlreadyExistsHTTPError
)
from app.schemes.categories import (
    SCategoryAdd,
    SCategoryGet,
    SCategoryUpdate,
    SCategoryPatch
)
from app.services.categories import CategoryService

router = APIRouter(prefix="/categories", tags=["Категории"])


@router.post("", summary="Создание новой категории")
async def create_new_category(
    category_data: SCategoryAdd,
) -> dict[str, str]:
    try:
        await CategoryService().create_category(category_data)
    except CategoryAlreadyExistsError:
        raise CategoryAlreadyExistsHTTPError
    return {"status": "OK"}


@router.get("", summary="Получение списка всех категорий")
async def get_all_categories(
) -> list[SCategoryGet]:
    return await CategoryService().get_categories()


@router.get("/{id}", summary="Получение конкретной категории")
async def get_category(
    id: int,
) -> SCategoryGet:
    return await CategoryService().get_category(category_id=id)


@router.put("/{id}", summary="Изменение конкретной категории")
async def update_category(
    category_data: SCategoryUpdate,
    id: int,
) -> dict[str, str]:
    try:
        await CategoryService().edit_category(category_id=id, category_data=category_data)
    except CategoryNotFoundError:
        raise CategoryNotFoundHTTPError

    return {"status": "OK"}


@router.patch("/{id}", summary="Частичное изменение конкретной категории")
async def patch_category(
    category_data: SCategoryPatch,
    id: int,
) -> dict[str, str]:
    try:
        await CategoryService().patch_category(category_id=id, category_data=category_data)
    except CategoryNotFoundError:
        raise CategoryNotFoundHTTPError

    return {"status": "OK"}


@router.delete("/{id}", summary="Удаление конкретной категории")
async def delete_category(
    id: int,
) -> dict[str, str]:
    try:
        await CategoryService().delete_category(category_id=id)
    except CategoryNotFoundError:
        raise CategoryNotFoundHTTPError

    return {"status": "OK"}