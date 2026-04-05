   from .database import Base
from sqlalchemy import Column, Integer, String, Boolean

class VaultItem(Base):
    __tablename__ = "vault_items"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    category = Column(String)  # Idea, Task, or Payment
    date = Column(String)      # Storing as string for simplicity
    is_completed = Column(Boolean, default=False)
