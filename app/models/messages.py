# app/models/messages.py
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship, Mapped, mapped_column
from datetime import datetime
from app.database.database import Base
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .users import UserModel
    from .items import ItemModel

class MessageModel(Base):
    __tablename__ = "messages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    text: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Внешние ключи
    sender_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    recipient_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    item_id: Mapped[int] = mapped_column(ForeignKey("items.id"), nullable=False)

    # Связи — через TYPE_CHECKING
    sender: Mapped["UserModel"] = relationship("UserModel", foreign_keys="MessageModel.sender_id", back_populates="sent_messages")
    recipient: Mapped["UserModel"] = relationship("UserModel", foreign_keys="MessageModel.recipient_id", back_populates="received_messages")
    item: Mapped["ItemModel"] = relationship("ItemModel", back_populates="messages")