
import os
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException
from pydantic import BaseModel
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

class User(BaseModel):
    email: str
    password: str
    role: str

class Settings(BaseModel):
    authjwt_secret_key: str = os.environ.get('AUTHJWT_SECRET_KEY')

@AuthJWT.load_config
def get_config():
    return Settings()

@app.exception_handler(AuthJWTException)
def authjwt_exception_handler(request: Request, exc: AuthJWTException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message}
    )

