# app/schemes/relations_items_categories.py
from .items import SItemGet
from .categories import SCategoryGet

class SItemGetWithRels(SItemGet):
    category: SCategoryGet

class SCategoryGetWithItems(SCategoryGet):
    items: list[SItemGet] | None = None