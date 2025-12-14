# app/schemes/relations_messages_users.py
from .messages import SMessageGet
from .users import SUserGet

class SMessageGetWithRels(SMessageGet):
    sender: SUserGet
    recipient: SUserGet

class SUserGetWithMessages(SUserGet):
    sent_messages: list[SMessageGet] | None = None
    received_messages: list[SMessageGet] | None = None