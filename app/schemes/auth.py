# app/schemes/auth.py
from pydantic import BaseModel
from .users import SUserResponse


class SLoginRequest(BaseModel):
    email: str
    password: str


class SRegisterRequest(BaseModel):
    username: str
    email: str
    password: str
    name: str


class STokenResponse(BaseModel):
    success: bool = True
    message: str = "Успешно"
    token: str
    user: SUserResponse