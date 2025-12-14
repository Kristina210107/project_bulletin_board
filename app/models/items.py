# app/models/items.py
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship, Mapped, mapped_column
from datetime import datetime
from app.database.database import Base
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .users import UserModel
    from .categories import CategoryModel
    from .locations import LocationModel
    from .reviews import ReviewModel
    from .messages import MessageModel

class ItemModel(Base):
    __tablename__ = "items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    condition: Mapped[str] = mapped_column(String, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"), nullable=False)
    location_id: Mapped[int] = mapped_column(ForeignKey("locations.id"), nullable=False)

    # Связи — через TYPE_CHECKING
    owner: Mapped["UserModel"] = relationship("UserModel", back_populates="items")
    category: Mapped["CategoryModel"] = relationship("CategoryModel", back_populates="items")
    location: Mapped["LocationModel"] = relationship("LocationModel", back_populates="items")
    reviews: Mapped[list["ReviewModel"]] = relationship("ReviewModel", back_populates="item")
    messages: Mapped[list["MessageModel"]] = relationship("MessageModel", back_populates="item")