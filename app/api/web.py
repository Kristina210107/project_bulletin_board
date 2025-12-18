# app/api/web.py
from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse

router = APIRouter()
templates = Jinja2Templates(directory="app/templates")

@router.get("/web/index", response_class=HTMLResponse)
async def get_index(request: Request):
    return templates.TemplateResponse(
        "index.html",
        {"request": request}
    )


@router.get("/web/auth", response_class=HTMLResponse)
async def get_auth(request: Request):
    return templates.TemplateResponse(
        "auth.html",
        {"request": request}
    )


@router.get("/web/profile", response_class=HTMLResponse)
async def get_profile(request: Request):
    return templates.TemplateResponse(
        "profile.html",
        {"request": request}
    )