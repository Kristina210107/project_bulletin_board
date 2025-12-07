from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemes import location as location_scheme

router = APIRouter(prefix="/locations", tags=["locations"])


@router.get("/", response_model=List[location_scheme.Location])
def get_locations(
    skip: int = 0,
    limit: int = 100,
    city: Optional[str] = None,
    region: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Получить список локаций"""
    # Примерные локации
    locations = [
        {"id": 1, "city": "Moscow", "region": "Moscow Oblast"},
        {"id": 2, "city": "Saint Petersburg", "region": "Leningrad Oblast"},
        {"id": 3, "city": "Novosibirsk", "region": "Novosibirsk Oblast"},
        {"id": 4, "city": "Yekaterinburg", "region": "Sverdlovsk Oblast"},
        {"id": 5, "city": "Kazan", "region": "Tatarstan"}
    ]
    
    # Фильтрация
    if city:
        locations = [loc for loc in locations if city.lower() in loc["city"].lower()]
    if region:
        locations = [loc for loc in locations if region.lower() in loc["region"].lower()]
    
    return locations[skip:skip + limit]


@router.get("/{location_id}", response_model=location_scheme.Location)
def get_location(location_id: int, db: Session = Depends(get_db)):
    """Получить локацию по ID"""
    locations = {
        1: {"id": 1, "city": "Moscow", "region": "Moscow Oblast"},
        2: {"id": 2, "city": "Saint Petersburg", "region": "Leningrad Oblast"},
        3: {"id": 3, "city": "Novosibirsk", "region": "Novosibirsk Oblast"},
        4: {"id": 4, "city": "Yekaterinburg", "region": "Sverdlovsk Oblast"},
        5: {"id": 5, "city": "Kazan", "region": "Tatarstan"}
    }
    
    if location_id not in locations:
        raise HTTPException(status_code=404, detail="Location not found")
    
    return locations[location_id]


@router.post("/", response_model=location_scheme.Location)
def create_location(location: location_scheme.LocationCreate, db: Session = Depends(get_db)):
    """Создать новую локацию"""
    return {"id": 6, **location.dict()}


@router.put("/{location_id}", response_model=location_scheme.Location)
def update_location(
    location_id: int,
    location_update: location_scheme.LocationUpdate,
    db: Session = Depends(get_db)
):
    """Обновить локацию"""
    return {
        "id": location_id,
        "city": location_update.city or f"City {location_id}",
        "region": location_update.region or f"Region {location_id}"
    }


@router.delete("/{location_id}")
def delete_location(location_id: int, db: Session = Depends(get_db)):
    """Удалить локацию"""
    return {"message": f"Location {location_id} deleted successfully"}