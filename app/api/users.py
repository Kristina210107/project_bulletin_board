from fastapi import APIRouter, Depends

from app.api.dependencies import DBDep, UserIdDep, IsAdminDep
from app.exceptions.users import (
    UserAlreadyExistsError,
    UserAlreadyExistsHTTPError,
    UserNotFoundError,
    UserNotFoundHTTPError,
)
from app.schemes.users import SUserAdd, SUserAddRequest, SUserGet
from app.schemes.relations_users_roles import SUserGetWithRels
from app.services.users import UserService
from typing import Optional
from pydantic import BaseModel

router = APIRouter(prefix="/admin", tags=["Управление пользователями"])


@router.post("/users", summary="Создание нового пользователя")
async def create_new_user(
    user_data: SUserAddRequest,
    db: DBDep,
) -> dict[str, str]:
    try:
        await UserService(db).create_user(user_data)
    except UserAlreadyExistsError:
        raise UserAlreadyExistsHTTPError
    return {"status": "OK"}


@router.get("/users", summary="Получение списка пользователей")
async def get_all_users(
    db: DBDep,
) -> list[SUserGet]:
    return await UserService(db).get_users()


@router.get("/users/{id}", summary="Получение конкретного пользователя")
async def get_user_by_id(
    db: DBDep,
    id: int,
    current_user_id: int = Depends(UserIdDep)
) -> SUserGetWithRels:
    # Проверяем, что пользователь запрашивает свои данные или является администратором
    if id != current_user_id:
        # Если пользователь не является администратором, выбрасываем ошибку
        await IsAdminDep()
    
    return await UserService(db).get_user(user_id=id)


@router.put("/users/{id}", summary="Изменение конкретного пользователя")
async def update_user(
    db: DBDep,
    user_data: SUserAdd,
    id: int,
    current_user_id: int = Depends(UserIdDep)
) -> dict[str, str]:
    # Проверяем, что пользователь обновляет свои данные или является администратором
    if id != current_user_id:
        # Если пользователь не является администратором, выбрасываем ошибку
        await IsAdminDep()
    
    try:
        await UserService(db).edit_user(user_id=id, user_data=user_data)
    except UserNotFoundError:
        raise UserNotFoundHTTPError

    return {"status": "OK"}


@router.delete("/users/{id}", summary="Удаление конкретного пользователя")
async def delete_user(
    db: DBDep,
    id: int,
    current_user_id: int = Depends(UserIdDep)
) -> dict[str, str]:
    # Проверяем, что пользователь удаляет свои данные или является администратором
    if id != current_user_id:
        # Если пользователь не является администратором, выбрасываем ошибку
        await IsAdminDep()
    
    try:
        await UserService(db).delete_user(user_id=id)
    except UserNotFoundError:
        raise UserNotFoundHTTPError

    return {"status": "OK"}

class SUserGet(BaseModel):
    """Схема для репозиториев"""
    id: int
    email: str
    name: str
    full_name: Optional[str] = None
    phone: Optional[str] = None
    is_verified: bool = False
    image_id: Optional[int] = None

    class Config:
        from_attributes = True