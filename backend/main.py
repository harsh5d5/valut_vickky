from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from . import models, schemas, database

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Vault API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://valut-vickky.vercel.app",
        "https://valut-vickky-qsgo4iuw8-vickkys-projects-d62053fa.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/items/", response_model=List[schemas.VaultItem])
def read_items(db: Session = Depends(database.get_db)):
    items = db.query(models.VaultItem).order_by(models.VaultItem.id.desc()).all()
    return items

@app.post("/items/", response_model=schemas.VaultItem)
def create_item(item: schemas.VaultItemCreate, db: Session = Depends(database.get_db)):
    db_item = models.VaultItem(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.delete("/items/{item_id}")
def delete_item(item_id: int, db: Session = Depends(database.get_db)):
    db_item = db.query(models.VaultItem).filter(models.VaultItem.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(db_item)
    db.commit()
    return {"message": "Item deleted successfully"}

@app.patch("/items/{item_id}/toggle", response_model=schemas.VaultItem)
def toggle_item_complete(item_id: int, db: Session = Depends(database.get_db)):
    db_item = db.query(models.VaultItem).filter(models.VaultItem.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    db_item.is_completed = not db_item.is_completed
    db.commit()
    db.refresh(db_item)
    return db_item

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
