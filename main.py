"""
main.py - Точка входа для ТовароОбмен
Связывает фронтенд и API ручки
"""

from fastapi import FastAPI, Request, APIRouter, HTTPException, Depends
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import os
import sys
from typing import List, Dict, Any, Optional

# ==================== БАЗОВАЯ КОНФИГУРАЦИЯ ====================

# Создаем приложение
app = FastAPI(
    title="ТовароОбмен",
    description="Платформа для обмена вещами",
    version="1.0.0",
    docs_url="/docs",  # Документация API
    redoc_url="/redoc",
)

# CORS для фронтенда
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене укажите конкретные домены
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== ПУТИ К ФАЙЛАМ ====================

# Базовая директория проекта
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
API_DIR = os.path.join(BASE_DIR, "app", "api")

# Пути к фронтенду
STATIC_DIR = os.path.join(BASE_DIR, "app", "static")
TEMPLATES_DIR = os.path.join(BASE_DIR, "app", "templates")

# Проверяем существование папок
print(f"🔍 Проверка структуры проекта:")
print(f"   📁 Базовая папка: {BASE_DIR}")
print(f"   📁 Папка API: {API_DIR} {'✅' if os.path.exists(API_DIR) else '❌'}")
print(f"   📁 Статика: {STATIC_DIR} {'✅' if os.path.exists(STATIC_DIR) else '❌'}")
print(f"   📁 Шаблоны: {TEMPLATES_DIR} {'✅' if os.path.exists(TEMPLATES_DIR) else '❌'}")

# ==================== ПОДКЛЮЧАЕМ ФРОНТЕНД ====================

# 1. Статические файлы (CSS, JS, изображения)
if os.path.exists(STATIC_DIR):
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
    print("✅ Статические файлы подключены")
else:
    print("⚠️ Папка со статикой не найдена")

# 2. HTML шаблоны
if os.path.exists(TEMPLATES_DIR):
    templates = Jinja2Templates(directory=TEMPLATES_DIR)
    print("✅ HTML шаблоны подключены")
else:
    print("⚠️ Папка с шаблонами не найдена")
    templates = None

# ==================== ВЕБ-СТРАНИЦЫ (ФРОНТЕНД) ====================

@app.get("/", response_class=HTMLResponse)
async def serve_index(request: Request):
    """Главная страница"""
    if templates:
        try:
            return templates.TemplateResponse("index.html", {"request": request})
        except:
            pass
    return HTMLResponse("<h1>ТовароОбмен</h1><p>Главная страница</p>")

@app.get("/account", response_class=HTMLResponse)
async def serve_account(request: Request):
    """Страница аккаунта"""
    if templates:
        try:
            return templates.TemplateResponse("account.html", {"request": request})
        except:
            pass
    return HTMLResponse("<h1>Мой аккаунт</h1>")

@app.get("/messages", response_class=HTMLResponse)
async def serve_messages(request: Request):
    """Страница сообщений"""
    if templates:
        try:
            return templates.TemplateResponse("messages.html", {"request": request})
        except:
            pass
    return HTMLResponse("<h1>Сообщения</h1>")

@app.get("/product", response_class=HTMLResponse)
async def serve_product(request: Request):
    """Страница товара"""
    if templates:
        try:
            return templates.TemplateResponse("product.html", {"request": request})
        except:
            pass
    return HTMLResponse("<h1>Товар</h1>")

# ==================== МОДЕЛИ PYDANTIC ====================

class ItemCreate(BaseModel):
    name: str
    description: Optional[str] = None

class ItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class UserCreate(BaseModel):
    username: str
    password: str
    email: str

class UserLogin(BaseModel):
    username: str
    password: str

# ==================== СОЗДАЕМ ПОЛНОЦЕННЫЕ РУЧКИ ДЛЯ ВСЕХ МОДУЛЕЙ ====================

print("\n📡 СОЗДАНИЕ ПОЛНЫХ API МОДУЛЕЙ:")

# Функция для создания полноценного модуля с CRUD операциями
def create_full_module(module_name: str, russian_name: str = None) -> APIRouter:
    """Создает полноценный модуль с CRUD операциями"""
    router = APIRouter()
    
    # Используем русское имя для тегов, если указано
    tag_name = russian_name if russian_name else module_name.capitalize()
    
    # Пример данных
    sample_data = [
        {"id": 1, "name": f"Пример 1 {module_name}", "description": f"Описание 1 для {module_name}"},
        {"id": 2, "name": f"Пример 2 {module_name}", "description": f"Описание 2 для {module_name}"},
        {"id": 3, "name": f"Пример 3 {module_name}", "description": f"Описание 3 для {module_name}"},
    ]
    
    # CRUD операции
    
    @router.get(f"/{module_name}", tags=[tag_name])
    async def get_all_items(skip: int = 0, limit: int = 100):
        """Получить все элементы"""
        return sample_data[skip:skip + limit]
    
    @router.get(f"/{module_name}/{{item_id}}", tags=[tag_name])
    async def get_item(item_id: int):
        """Получить элемент по ID"""
        for item in sample_data:
            if item["id"] == item_id:
                return item
        raise HTTPException(status_code=404, detail="Элемент не найден")
    
    @router.post(f"/{module_name}", tags=[tag_name])
    async def create_item(item: ItemCreate):
        """Создать новый элемент"""
        new_id = max([i["id"] for i in sample_data]) + 1 if sample_data else 1
        new_item = {
            "id": new_id,
            "name": item.name,
            "description": item.description
        }
        sample_data.append(new_item)
        return new_item
    
    @router.put(f"/{module_name}/{{item_id}}", tags=[tag_name])
    async def update_item(item_id: int, item: ItemUpdate):
        """Обновить элемент"""
        for i, existing_item in enumerate(sample_data):
            if existing_item["id"] == item_id:
                if item.name is not None:
                    sample_data[i]["name"] = item.name
                if item.description is not None:
                    sample_data[i]["description"] = item.description
                return sample_data[i]
        raise HTTPException(status_code=404, detail="Элемент не найден")
    
    @router.delete(f"/{module_name}/{{item_id}}", tags=[tag_name])
    async def delete_item(item_id: int):
        """Удалить элемент"""
        for i, item in enumerate(sample_data):
            if item["id"] == item_id:
                deleted = sample_data.pop(i)
                return {"message": "Элемент удален", "item": deleted}
        raise HTTPException(status_code=404, detail="Элемент не найден")
    
    # Дополнительные ручки
    
    @router.get(f"/{module_name}/search/{{query}}", tags=[tag_name])
    async def search_items(query: str):
        """Поиск элементов"""
        results = [item for item in sample_data if query.lower() in item["name"].lower()]
        return {"query": query, "results": results}
    
    @router.get(f"/{module_name}/count", tags=[tag_name])
    async def count_items():
        """Получить количество элементов"""
        return {"count": len(sample_data)}
    
    return router

# ==================== СОЗДАЕМ КОНКРЕТНЫЕ МОДУЛИ ====================

# 1. Sample (Образец)
sample_router = APIRouter()

@sample_router.get("/sample", tags=["Sample"])
async def get_sample():
    """Пример функции - получить данные"""
    return {
        "message": "Это пример API ручки",
        "data": ["данные 1", "данные 2", "данные 3"],
        "count": 3
    }

@sample_router.post("/sample", tags=["Sample"])
async def create_sample():
    """Создать пример"""
    return {"message": "Пример создан", "id": 123}

@sample_router.get("/sample/{id}", tags=["Sample"])
async def get_sample_by_id(id: int):
    """Получить пример по ID"""
    return {"id": id, "name": f"Пример {id}", "value": id * 10}

@sample_router.put("/sample/{id}", tags=["Sample"])
async def update_sample(id: int):
    """Обновить пример"""
    return {"message": f"Пример {id} обновлен"}

@sample_router.delete("/sample/{id}", tags=["Sample"])
async def delete_sample(id: int):
    """Удалить пример"""
    return {"message": f"Пример {id} удален"}

@sample_router.get("/sample/search/{query}", tags=["Sample"])
async def search_sample(query: str):
    """Поиск примеров"""
    return {"query": query, "results": [f"результат 1 для {query}", f"результат 2 для {query}"]}

# 2. Dependencies (Зависимости)
dependencies_router = create_full_module("dependencies", "Зависимости")

# 3. Items (Предметы)
items_router = create_full_module("items", "Предметы")

# 4. Roles (Роли)
roles_router = create_full_module("roles", "Роли")

# 5. Categories (Категории)
categories_router = create_full_module("categories", "Категории")

# 6. Users (Пользователи)
users_router = create_full_module("users", "Пользователи")

# 7. Reviews (Отзывы)
reviews_router = create_full_module("reviews", "Отзывы")

# 8. Messages (Сообщения)
messages_router = create_full_module("messages", "Сообщения")

# 9. Locations (Локации)
locations_router = create_full_module("locations", "Локации")

# 10. Auth (Аутентификация) - специальный модуль
auth_router = APIRouter()

@auth_router.post("/auth/register", tags=["Аутентификация"])
async def register_user(user: UserCreate):
    """Регистрация пользователя"""
    return {
        "message": "Пользователь зарегистрирован", 
        "username": user.username, 
        "email": user.email
    }

@auth_router.post("/auth/login", tags=["Аутентификация"])
async def login_user(user: UserLogin):
    """Вход в систему"""
    return {
        "message": "Вход выполнен", 
        "token": "jwt_token_here", 
        "username": user.username
    }

@auth_router.post("/auth/logout", tags=["Аутентификация"])
async def logout_user():
    """Выход из системы"""
    return {"message": "Выход выполнен"}

@auth_router.get("/auth/profile", tags=["Аутентификация"])
async def get_profile():
    """Получить профиль пользователя"""
    return {"username": "test_user", "email": "test@example.com", "role": "user"}

@auth_router.put("/auth/profile", tags=["Аутентификация"])
async def update_profile():
    """Обновить профиль"""
    return {"message": "Профиль обновлен"}

@auth_router.post("/auth/refresh", tags=["Аутентификация"])
async def refresh_token():
    """Обновить токен"""
    return {"token": "new_jwt_token_here"}

# ==================== ПОДКЛЮЧАЕМ ВСЕ РОУТЕРЫ ====================

print("\n🔗 ПОДКЛЮЧЕНИЕ РОУТЕРОВ:")

routers = [
    (sample_router, "Sample", "Образец"),
    (dependencies_router, "Dependencies", "Зависимости"),
    (items_router, "Items", "Предметы"),
    (roles_router, "Roles", "Роли"),
    (categories_router, "Categories", "Категории"),
    (users_router, "Users", "Пользователи"),
    (reviews_router, "Reviews", "Отзывы"),
    (messages_router, "Messages", "Сообщения"),
    (locations_router, "Locations", "Локации"),
    (auth_router, "Auth", "Аутентификация")
]

for router, eng_name, rus_name in routers:
    app.include_router(router, prefix="/api")
    print(f"  ✅ {eng_name} ({rus_name}) - подключен")
    
    # Считаем количество путей
    paths = [route.path for route in router.routes if hasattr(route, 'path')]
    print(f"     📍 {len(paths)} путей: {paths}")

# ==================== СИСТЕМНЫЕ ЭНДПОИНТЫ ====================

@app.get("/api")
async def api_root():
    """Корневой эндпоинт API"""
    all_paths = []
    
    for router, eng_name, rus_name in routers:
        for route in router.routes:
            if hasattr(route, 'path'):
                methods = list(route.methods) if hasattr(route, 'methods') else ['GET']
                for method in methods:
                    all_paths.append({
                        "method": method,
                        "path": f"/api{route.path}",
                        "module": rus_name
                    })
    
    return {
        "сервис": "ТовароОбмен API",
        "версия": "1.0.0",
        "модули": [rus_name for _, _, rus_name in routers],
        "всего_путей": len(all_paths),
        "пути_по_модулям": {
            rus_name: [
                f"{p['method']} {p['path']}" 
                for p in all_paths 
                if p['module'] == rus_name
            ]
            for _, _, rus_name in routers
        }
    }

@app.get("/health")
async def health_check():
    """Проверка здоровья"""
    total_paths = sum(len([r for r in router.routes if hasattr(r, 'path')]) for router, _, _ in routers)
    
    return {
        "статус": "ок",
        "сервис": "ТовароОбмен",
        "фронтенд": "подключен" if templates else "отсутствует",
        "api": {
            "модули": len(routers),
            "всего_ручек": total_paths,
            "список_модулей": [rus_name for _, _, rus_name in routers]
        }
    }

# ==================== ЗАПУСК И ИНФОРМАЦИЯ ====================

def print_startup_info():
    """Выводим информацию при запуске"""
    print("\n" + "="*60)
    print("🚀 ТОВАРООБМЕН ЗАПУЩЕН!")
    print("="*60)
    
    print("\n🌐 ФРОНТЕНД:")
    print("  📍 http://localhost:8000/           - Главная")
    print("  👤 http://localhost:8000/account    - Аккаунт")
    print("  💬 http://localhost:8000/messages   - Сообщения")
    print("  📦 http://localhost:8000/product    - Товар")
    
    print("\n📡 API МОДУЛИ (полные версии):")
    
    for i, (router, eng_name, rus_name) in enumerate(routers, 1):
        paths = [route.path for route in router.routes if hasattr(route, 'path')]
        print(f"  {i:2d}. {rus_name:15} - {len(paths):2d} ручек")
        
        # Показываем первые 4 пути
        for j, path in enumerate(paths[:4], 1):
            print(f"       {j}. /api{path}")
        if len(paths) > 4:
            print(f"       ... и еще {len(paths) - 4} ручек")
        print()
    
    print("🔧 СИСТЕМНЫЕ:")
    print("  🩺 http://localhost:8000/health      - Проверка здоровья")
    print("  📊 http://localhost:8000/api         - Все эндпоинты")
    
    print("\n📚 ДОКУМЕНТАЦИЯ:")
    print("  📖 http://localhost:8000/docs  - Swagger UI")
    print("  🔍 http://localhost:8000/redoc - ReDoc")
    
    print("\n" + "="*60)
    total_paths = sum(len([r for r in router.routes if hasattr(r, 'path')]) for router, _, _ in routers)
    print(f"✅ {len(routers)} модулей с {total_paths} ручками готовы к работе!")
    print("="*60)

# ==================== ТОЧКА ВХОДА ====================

if __name__ == "__main__":
    print_startup_info()
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )