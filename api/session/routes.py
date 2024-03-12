from fastapi import APIRouter, Response, Depends, Cookie
from uuid import UUID
from .models import SessionData
from .services import SessionService

router = APIRouter()
session_service = SessionService()


@router.post("/create_session/{email}")
async def create_session(email: str, response: Response):
    return await session_service.create_session(email, response)


@router.get("/whoami", dependencies=[Depends(session_service.cookie)])
async def whoami(session_data: SessionData = Depends(session_service.verifier)):
    return session_data


@router.post("/delete_session")
async def del_session(response: Response, session_id: UUID = Depends(session_service.cookie)):
    return await session_service.del_session(response, session_id)
