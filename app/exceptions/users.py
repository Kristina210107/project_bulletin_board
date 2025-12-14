from app.exceptions.base import MyAppError, MyAppHTTPError


class UserNotFoundError(MyAppError):
    detail = "Пользователя не существует"


class UserNotFoundHTTPError(MyAppHTTPError):
    status_code = 404
    detail = "Пользователя не существует"


class UserAlreadyExistsError(MyAppError):
    detail = "Такой пользователь уже существует"


class UserAlreadyExistsHTTPError(MyAppHTTPError):
    status_code = 409
    detail = "Такой пользователь уже существует"