# app/schemes/relations_users_favourites.py
from .users import SUserGet
from .favourites import SFavouriteGet

class SFavouriteGetWithRels(SFavouriteGet):
    user: SUserGet

class SUserGetWithRels(SUserGet):
    favourites: list[SFavouriteGet] | None = None