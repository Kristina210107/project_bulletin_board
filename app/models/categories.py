# app/models/categories.py
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.database.database import Base
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .items import ItemModel

class CategoryModel(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, nullable=False, unique=True)

    # Связь — через TYPE_CHECKING
    items: Mapped[list["ItemModel"]] = relationship("ItemModel", back_populates="category")