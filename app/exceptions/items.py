from .base import MyAppError, MyAppHTTPError


class ItemNotFoundError(MyAppError):
    detail = "Товар не найден"


class ItemNotFoundHTTPError(MyAppHTTPError):
    status_code = 404
    detail = "Товар не найден"


class ItemAlreadyExistsError(MyAppError):
    detail = "Товар с таким названием уже существует"


class ItemAlreadyExistsHTTPError(MyAppHTTPError):
    status_code = 409
    detail = "Товар с таким названием уже существует"