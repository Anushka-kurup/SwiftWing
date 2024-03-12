from fastapi import HTTPException, Response, Depends
from uuid import UUID, uuid4
from .models import SessionData, backend, BasicVerifier
from fastapi_sessions.frontends.implementations import SessionCookie, CookieParameters
from fastapi_sessions.session_verifier import SessionVerifier
import os

class SessionService:
    def __init__(self):
        self.cookie_params = CookieParameters()

        self.cookie = SessionCookie(
            cookie_name="cookie",
            identifier="general_verifier",
            auto_error=True,
            secret_key=os.environ.get('AUTHJWT_SECRET_KEY'),
            cookie_params=self.cookie_params,
        )

        self.verifier = BasicVerifier(
            identifier="general_verifier",
            auto_error=True,
            backend=backend,
            auth_http_exception=HTTPException(status_code=403, detail="invalid session"),
        )

    async def create_session(self, email: str, response: Response):
        session = uuid4()
        data = SessionData(username=email)

        await backend.create(session, data)
        self.cookie.attach_to_response(response, session)

        return f"created session for {email} {data}"

    async def whoami(self, session_data: SessionData = Depends()):
        return session_data

    async def del_session(self, response: Response, session_id: UUID = Depends()):
        try:
            await backend.delete(session_id)
            self.cookie.delete_from_response(response)
            return "deleted session"
        except KeyError:
            return "Session not found"
