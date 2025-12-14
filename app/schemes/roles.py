# app/schemes/roles.py
from pydantic import BaseModel
from typing import Optional


class SRoleGet(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

    class Config:
        from_attributes = True


# Для API
class SRoleAdd(BaseModel):
    name: str
    description: Optional[str] = None