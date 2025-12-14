from fastapi import APIRouter
from typing import Optional

from app.exceptions.reviews import (
    ReviewNotFoundError,
    ReviewNotFoundHTTPError,
    ReviewAlreadyExistsError,
    ReviewAlreadyExistsHTTPError
)
from app.schemes.reviews import (
    SReviewAdd,
    SReviewGet,
    SReviewUpdate,
    SReviewPatch,
    SReviewFilter
)
from app.services.reviews import ReviewService

router = APIRouter(prefix="/reviews", tags=["Отзывы"])


@router.post("", summary="Создание нового отзыва")
async def create_new_review(
    review_data: SReviewAdd,
) -> dict[str, str]:
    try:
        await ReviewService().create_review(review_data)
    except ReviewAlreadyExistsError:
        raise ReviewAlreadyExistsHTTPError
    return {"status": "OK"}


@router.get("", summary="Получение списка всех отзывов")
async def get_all_reviews(
    item_id: Optional[int] = None,
    user_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100
) -> list[SReviewGet]:
    filters = SReviewFilter(item_id=item_id, user_id=user_id)
    return await ReviewService().get_reviews(filters=filters, skip=skip, limit=limit)


@router.get("/{id}", summary="Получение конкретного отзыва")
async def get_review(
    id: int,
) -> SReviewGet:
    return await ReviewService().get_review(review_id=id)


@router.put("/{id}", summary="Изменение конкретного отзыва")
async def update_review(
    review_data: SReviewUpdate,
    id: int,
) -> dict[str, str]:
    try:
        await ReviewService().edit_review(review_id=id, review_data=review_data)
    except ReviewNotFoundError:
        raise ReviewNotFoundHTTPError

    return {"status": "OK"}


@router.patch("/{id}", summary="Частичное изменение конкретного отзыва")
async def patch_review(
    review_data: SReviewPatch,
    id: int,
) -> dict[str, str]:
    try:
        await ReviewService().patch_review(review_id=id, review_data=review_data)
    except ReviewNotFoundError:
        raise ReviewNotFoundHTTPError

    return {"status": "OK"}


@router.delete("/{id}", summary="Удаление конкретного отзыва")
async def delete_review(
    id: int,
) -> dict[str, str]:
    try:
        await ReviewService().delete_review(review_id=id)
    except ReviewNotFoundError:
        raise ReviewNotFoundHTTPError

    return {"status": "OK"}


@router.get("/item/{item_id}", summary="Получение отзывов для товара")
async def get_item_reviews(
    item_id: int,
    skip: int = 0,
    limit: int = 100
) -> list[SReviewGet]:
    return await ReviewService().get_item_reviews(item_id=item_id, skip=skip, limit=limit)


@router.get("/item/{item_id}/average-rating", summary="Получение среднего рейтинга товара")
async def get_item_average_rating(
    item_id: int,
) -> dict[str, float]:
    return {"average_rating": await ReviewService().get_item_average_rating(item_id=item_id)}