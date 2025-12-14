from fastapi import APIRouter

from app.exceptions.messages import (
    MessageNotFoundError,
    MessageNotFoundHTTPError,
    ConversationNotFoundError,
    ConversationNotFoundHTTPError,
    MessageAccessDeniedError,
    MessageAccessDeniedHTTPError
)
from app.schemes.messages import (
    SMessageAdd,
    SMessageGet,
    SConversationGet,
    SConversationList
)
from app.services.messages import MessageService

router = APIRouter(prefix="/messages", tags=["Сообщения"])


@router.get("/conversations", summary="Получение списка всех чатов")
async def get_all_conversations(
) -> list[SConversationList]:
    return await MessageService().get_conversations()


@router.get("/conversations/{conversation_id}", summary="Получение конкретного чата")
async def get_conversation(
    conversation_id: int,
) -> SConversationGet:
    return await MessageService().get_conversation(conversation_id=conversation_id)


@router.post("/conversations/{conversation_id}/messages", summary="Отправка сообщения")
async def send_message(
    message_data: SMessageAdd,
    conversation_id: int,
) -> dict[str, str]:
    try:
        await MessageService().send_message(conversation_id=conversation_id, message_data=message_data)
    except ConversationNotFoundError:
        raise ConversationNotFoundHTTPError

    return {"status": "OK"}


@router.get("/conversations/{conversation_id}/messages", summary="Получение сообщений чата")
async def get_conversation_messages(
    conversation_id: int,
    skip: int = 0,
    limit: int = 100
) -> list[SMessageGet]:
    return await MessageService().get_messages(conversation_id=conversation_id, skip=skip, limit=limit)


@router.delete("/messages/{message_id}", summary="Удаление сообщения")
async def delete_message(
    message_id: int,
) -> dict[str, str]:
    try:
        await MessageService().delete_message(message_id=message_id)
    except MessageNotFoundError:
        raise MessageNotFoundHTTPError
    except MessageAccessDeniedError:
        raise MessageAccessDeniedHTTPError

    return {"status": "OK"}