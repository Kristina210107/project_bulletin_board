import uvicorn
from fastapi import FastAPI
from fastapi.responses import RedirectResponse
#from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

# Импортируем роутеры
from app.api.auth import router as auth_router
from app.api.users import router as user_router
from app.api.items import router as item_router
from app.api.categories import router as category_router
from app.api.locations import router as location_router
from app.api.messages import router as message_router
from app.api.reviews import router as review_router
from app.api.roles import router as role_router

app = FastAPI(title="ТовароОбмен", version="0.0.1")

# Подключаем статику
#app.mount("/static", StaticFiles(directory="static"), name="static")

# Подключаем шаблоны (если используешь Jinja2)
# templates = Jinja2Templates(directory="app/templates")

# Подключаем роутеры
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(user_router, prefix="/users", tags=["users"])
app.include_router(item_router, prefix="/items", tags=["items"])
app.include_router(category_router, prefix="/categories", tags=["categories"])
app.include_router(location_router, prefix="/locations", tags=["locations"])
app.include_router(message_router, prefix="/messages", tags=["messages"])
app.include_router(review_router, prefix="/reviews", tags=["reviews"])
app.include_router(role_router, prefix="/roles", tags=["roles"])


@app.get("/")
def home_page():
    return RedirectResponse(url="/users")

if __name__ == "__main__":
    uvicorn.run(app=app, host="0.0.0.0", port=8000)

# uvicorn main:app --reload