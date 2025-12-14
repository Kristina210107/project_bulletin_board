from .base import MyAppError, MyAppHTTPError


class ReviewNotFoundError(MyAppError):
    detail = "Отзыв не найден"


class ReviewNotFoundHTTPError(MyAppHTTPError):
    status_code = 404
    detail = "Отзыв не найден"


class ReviewAlreadyExistsError(MyAppError):
    detail = "Отзыв от этого пользователя уже существует"


class ReviewAlreadyExistsHTTPError(MyAppHTTPError):
    status_code = 409
    detail = "Отзыв от этого пользователя уже существует"