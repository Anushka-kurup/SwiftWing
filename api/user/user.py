
import uvicorn
import os
import user_controller
import hashlib
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.responses import JSONResponse
from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException
from pydantic import BaseModel


app = FastAPI()

load_dotenv()

class User(BaseModel):
    email: str
    password: str
    role: str

class Settings(BaseModel):
    print(os.environ.get('AUTHJWT_SECRET_KEY'))
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

@app.post('/login')
def login(user: User, Authorize: AuthJWT = Depends()):
    user_data = user_controller.get_user_by_email(user.email)
    password = user.password

    hashed_password = hashlib.sha256(password.encode("utf-8")).hexdigest()

    if hashed_password != user_data["UserProfile"]["password"]:
        raise HTTPException(status_code=401, detail="Bad email or password")

    # Include role in the JWT payload
    access_token = Authorize.create_access_token(subject=user.email, user_claims={"role": user.role})
    return {"access_token": access_token}

@app.get('/user')
def user(Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()

    # Retrieve the JWT token claims
    raw_jwt = Authorize.get_raw_jwt()
    
    # Retrieve the role from the JWT claims
    role = raw_jwt.get("role")

    # Retrieve the current user from the JWT claims
    current_user = raw_jwt.get("sub")

    # Implement role-based access control logic
    return {"user": current_user, "role": role}
    
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
