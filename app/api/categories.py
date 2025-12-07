from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_categories():
    """Получить все категории"""
    return [
        {"id": 1, "name": "Книги", "count": 45},
        {"id": 2, "name": "Одежда", "count": 32},
        {"id": 3, "name": "Техника", "count": 28},
        {"id": 4, "name": "Детское", "count": 56},
        {"id": 5, "name": "Мебель", "count": 18},
        {"id": 6, "name": "Дом", "count": 39},
        {"id": 7, "name": "Развлечения", "count": 22},
        {"id": 8, "name": "Инструменты", "count": 15},
        {"id": 9, "name": "Коллекции", "count": 8},
        {"id": 10, "name": "Интерьер", "count": 27}
    ]