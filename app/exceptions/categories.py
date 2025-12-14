from .base import MyAppError, MyAppHTTPError


class CategoryNotFoundError(MyAppError):
    detail = "Категория не найдена"


class CategoryNotFoundHTTPError(MyAppHTTPError):
    status_code = 404
    detail = "Категория не найдена"


class CategoryAlreadyExistsError(MyAppError):
    detail = "Категория с таким названием уже существует"


class CategoryAlreadyExistsHTTPError(MyAppHTTPError):
    status_code = 409
    detail = "Категория с таким названием уже существует"