from fastapi import APIRouter, Request
from starlette.responses import Response

from app.api.dependencies import DBDep, UserIdDep
from app.exceptions.auth import (
    UserAlreadyExistsError,
    UserAlreadyExistsHTTPError,
    UserNotFoundError,
    UserNotFoundHTTPError,
    InvalidPasswordError,
    InvalidPasswordHTTPError,
    InvalidJWTTokenError,
    InvalidTokenHTTPError,
    NoAccessTokenHTTPError,
    JWTTokenExpiredError,
)
from app.schemes.users import SUserAddRequest, SUserAuth
from app.schemes.relations_users_roles import SUserGetWithRels
from app.services.auth import AuthService

router = APIRouter(prefix="/auth", tags=["Авторизация и аутентификация"])


@router.post("/register", summary="Регистрация нового пользователя")
async def register_user(
    db: DBDep,
    user_data: SUserAddRequest,
) -> dict[str, str]:
    try:
        await AuthService(db).register_user(user_data)
    except UserAlreadyExistsError:
        raise UserAlreadyExistsHTTPError
    return {"status": "OK"}


@router.post("/login", summary="Аутентификация пользователя")
async def login_user(
    db: DBDep,
    response: Response,
    user_data: SUserAuth,
) -> dict[str, str]:
    try:
        token_response: dict = await AuthService(db).login_user(user_data)
        access_token = token_response.token
        refresh_token = AuthService.create_refresh_token({"user_id": token_response.user.id, "email": token_response.user.email})
    except UserNotFoundError:
        raise UserNotFoundHTTPError
    except InvalidPasswordError:
        raise InvalidPasswordHTTPError
    
    # Сохраняем refresh token в базе данных
    # await AuthService(db).save_refresh_token(user_data.id, refresh_token)
    
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="strict"
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="strict"
    )
    return {"access_token": access_token, "refresh_token": refresh_token}


@router.get("/me", summary="Получение текущего пользователя для профиля")
async def get_me(db: DBDep, user_id: UserIdDep) -> SUserGetWithRels | None:
    try:
        user: None | SUserGetWithRels = await AuthService(db).get_me(user_id)
    except UserNotFoundError:
        raise UserNotFoundHTTPError
    return user


@router.post("/logout", summary="Выход пользователя из системы")
async def logout(response: Response) -> dict[str, str]:
    response.delete_cookie(
        key="access_token",
        httponly=True,
        secure=True,
        samesite="strict"
    )
    response.delete_cookie(
        key="refresh_token",
        httponly=True,
        secure=True,
        samesite="strict"
    )
    return {"status": "OK"}


@router.post("/refresh", summary="Обновление access токена")
async def refresh_access_token(
    request: Request,
    response: Response,
    db: DBDep
):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise NoAccessTokenHTTPError
    
    try:
        payload = AuthService.decode_token(refresh_token)
        if payload.get("type") != "refresh":
            raise InvalidTokenHTTPError
        
        # Проверяем, что refresh token не был инвалидирован
        user_id = payload.get("user_id")
        if await AuthService(db).is_refresh_token_revoked(user_id, refresh_token):
             raise InvalidTokenHTTPError
        
        new_access_token = AuthService.create_access_token({"user_id": payload.get("user_id"), "email": payload.get("email")})
        
        response.set_cookie(
            key="access_token",
            value=new_access_token,
            httponly=True,
            secure=True,
            samesite="strict"
        )
        
        return {"access_token": new_access_token}
    except (InvalidJWTTokenError, JWTTokenExpiredError):
        raise InvalidTokenHTTPError
