# app/exceptions/messages.py
from .base import MyAppError, MyAppHTTPError


class MessageNotFoundError(MyAppError):
    detail = "Сообщение не найдено"


class MessageNotFoundHTTPError(MyAppHTTPError):
    status_code = 404
    detail = "Сообщение не найдено"


class ConversationNotFoundError(MyAppError):
    detail = "Чат не найден"


class ConversationNotFoundHTTPError(MyAppHTTPError):
    status_code = 404
    detail = "Чат не найден"


class MessageAccessDeniedError(MyAppError):
    detail = "Нет доступа к этому сообщению"


class MessageAccessDeniedHTTPError(MyAppHTTPError):
    status_code = 403
    detail = "Нет доступа к этому сообщению"


class MessageAlreadyExistsError(MyAppError):
    detail = "Сообщение уже существует"


class MessageAlreadyExistsHTTPError(MyAppHTTPError):
    status_code = 409
    detail = "Сообщение уже существует"