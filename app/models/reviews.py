# app/models/reviews.py
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship, Mapped, mapped_column
from datetime import datetime
from app.database.database import Base
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .users import UserModel
    from .items import ItemModel

class ReviewModel(Base):
    __tablename__ = "reviews"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    rating: Mapped[int] = mapped_column(Integer, nullable=False)  # 1-5
    comment: Mapped[str] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Внешние ключи
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    item_id: Mapped[int] = mapped_column(ForeignKey("items.id"), nullable=False)

    # Связи — через TYPE_CHECKING
    author: Mapped["UserModel"] = relationship("UserModel", back_populates="reviews_as_author")
    item: Mapped["ItemModel"] = relationship("ItemModel", back_populates="reviews")