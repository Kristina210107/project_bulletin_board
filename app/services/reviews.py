# app/services/reviews.py
from typing import Optional
from app.exceptions.reviews import ReviewNotFoundError
from app.schemes.reviews import SReviewCreate, SReviewUpdate, SReviewPatch
from app.services.base import BaseService


class ReviewService(BaseService):

    async def create_review(self, review_data: SReviewCreate):
        try:
            # Создание нового отзыва
            new_review = await self.db.reviews.create(review_data.model_dump())
            await self.db.commit()
            return new_review
        except Exception as e:
            await self.db.rollback()
            raise e

    async def get_review(self, review_id: int):
        review = await self.db.reviews.get_one_or_none(id=review_id)
        if not review:
            raise ReviewNotFoundError
        return review

    async def update_review(self, review_id: int, review_data: SReviewUpdate):
        review = await self.db.reviews.get_one_or_none(id=review_id)
        if not review:
            raise ReviewNotFoundError
        # Обновление данных отзыва
        updated_review = await self.db.reviews.update(review_id, review_data.model_dump())
        await self.db.commit()
        return updated_review

    async def patch_review(self, review_id: int, review_data: SReviewPatch):
        review = await self.db.reviews.get_one_or_none(id=review_id)
        if not review:
            raise ReviewNotFoundError
        # Обновление только непустых полей
        patch_data = review_data.model_dump(exclude_unset=True)
        if patch_data:
            await self.db.reviews.update(review_id, patch_data)
            await self.db.commit()
        return

    async def delete_review(self, review_id: int):
        review = await self.db.reviews.get_one_or_none(id=review_id)
        if not review:
            raise ReviewNotFoundError
        await self.db.reviews.delete(review_id)
        await self.db.commit()
        return

    async def get_reviews(self):
        return await self.db.reviews.get_all()