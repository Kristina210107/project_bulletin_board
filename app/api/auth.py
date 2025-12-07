from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class LoginRequest(BaseModel):
    username: str
    password: str

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str
    name: str

@router.post("/login")
async def login(request: LoginRequest):
    """Вход в систему"""
    # Здесь должна быть реальная аутентификация
    if request.username and request.password:
        return {
            "success": True,
            "message": "Вход выполнен",
            "token": "demo_token_123",
            "user": {
                "id": 1,
                "name": request.username,
                "email": f"{request.username}@example.com"
            }
        }
    
    raise HTTPException(status_code=401, detail="Неверные учетные данные")

@router.post("/register")
async def register(request: RegisterRequest):
    """Регистрация нового пользователя"""
    # Здесь должна быть реальная регистрация
    return {
        "success": True,
        "message": "Регистрация выполнена",
        "user": {
            "id": 1,
            "name": request.name,
            "email": request.email,
            "trust_score": 5.0
        }
    }

@router.get("/me")
async def get_current_user():
    """Получить текущего пользователя"""
    return {
        "id": 1,
        "name": "Анна",
        "email": "anna@example.com",
        "trust_score": 4.8
    }