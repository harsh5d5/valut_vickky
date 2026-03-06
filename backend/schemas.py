from pydantic import BaseModel
from typing import Optional

class VaultItemBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: str
    date: str

class VaultItemCreate(VaultItemBase):
    pass

class VaultItem(VaultItemBase):
    id: int
    is_completed: bool

    class Config:
        from_attributes = True
