# app/repositories/reviews.py
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.schemes.reviews import SReviewAdd as ReviewCreate, SReviewUpdate as ReviewUpdate
from app.models.reviews import ReviewModel as Review
from .base import BaseRepository


class ReviewsRepository(BaseRepository):
    def __init__(self, session):
        super().__init__(session)  # ← только session, не передавайте Review
        self.model = Review  # ← устанавливаем модель отдельно

    async def get_one_or_none_with_relations(self, **filter_by):
        query = (
            select(self.model)
            .filter_by(**filter_by)
            .options(selectinload(self.model.user))
            .options(selectinload(self.model.item))
        )

        result = await self.session.execute(query)
        model = result.scalars().one_or_none()

        if model is None:
            return None

        # Если есть схема с отношениями
        # return SReviewGetWithRels.model_validate(model, from_attributes=True)
        return model

    async def get_item_reviews(self, item_id: int):
        query = (
            select(self.model)
            .where(self.model.item_id == item_id)
            .options(selectinload(self.model.user))
        )

        result = await self.session.execute(query)
        return result.scalars().all()