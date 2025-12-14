from .base import MyAppError, MyAppHTTPError


class LocationNotFoundError(MyAppError):
    detail = "Локация не найдена"


class LocationNotFoundHTTPError(MyAppHTTPError):
    status_code = 404
    detail = "Локация не найдена"


class LocationAlreadyExistsError(MyAppError):
    detail = "Локация с таким названием уже существует"


class LocationAlreadyExistsHTTPError(MyAppHTTPError):
    status_code = 409
    detail = "Локация с таким названием уже существует"