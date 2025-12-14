# app/schemes/relations_reviews_items.py
from .reviews import SReviewGet
from .items import SItemGet

class SReviewGetWithRels(SReviewGet):
    item: SItemGet

class SItemGetWithReviews(SItemGet):
    reviews: list[SReviewGet] | None = None