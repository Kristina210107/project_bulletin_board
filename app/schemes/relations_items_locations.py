# app/schemes/relations_items_locations.py
from .items import SItemGet
from .locations import SLocationGet

class SItemGetWithRels(SItemGet):
    location: SLocationGet

class SLocationGetWithItems(SLocationGet):
    items: list[SItemGet] | None = None