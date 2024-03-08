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

@app.post('/login')
def login(user: User, Authorize: AuthJWT = Depends()):
    user_data = user_controller.get_users_by_email(user.email)

    for profile_key, profile_data in user_data.items():
        if profile_data["email"] == user.email:
            # Found matching user profile
            hashed_password = hashlib.sha256(user.password.encode("utf-8")).hexdigest()

            if hashed_password == profile_data["password"] and profile_data["role"] == user.role:
                # Passwords match, generate access token
                access_token = Authorize.create_access_token(subject=user.email, user_claims={"role": profile_data["role"]})
                return {"access_token": access_token}
  
    raise HTTPException(status_code=401, detail="wrong email, password or role")

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

@app.get('/verify-client', status_code=201)
def verify_client(Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    raw_jwt = Authorize.get_raw_jwt()
    role = raw_jwt.get("role")

    if role != "client":
        raise HTTPException(status_code=403, detail="Only clients can access this endpoint")

    return "Client verified"

# New endpoint to verify operator
@app.get('/verify-operator')
def verify_operator(Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    raw_jwt = Authorize.get_raw_jwt()
    role = raw_jwt.get("role")
    
    if role != "operator":
        raise HTTPException(status_code=403, detail="Only operators can access this endpoint")
    
    return {"Operator verified"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)