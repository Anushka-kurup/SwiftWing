from fastapi import APIRouter, Depends, HTTPException
from fastapi_jwt_auth import AuthJWT
from . import services
from .models import User
from auth.services import AuthService

router = APIRouter()


@router.post('/login')
def login(user: services.User, auth_service: AuthService = Depends(), Authorize: AuthJWT = Depends()):
    token_info = auth_service.authenticate_user(user, Authorize)
    if token_info:
        return token_info
    else:
        raise HTTPException(status_code=401, detail="Authentication failed")

@router.get('/user')
def user(auth_service: AuthService = Depends(), Authorize: AuthJWT = Depends()):
    return auth_service.get_current_user(Authorize)

@router.get('/verify-client', status_code=201)
def verify_client(auth_service: AuthService = Depends(), Authorize: AuthJWT = Depends()):
    auth_service.verify_role("client", Authorize)
    return True

@router.get('/verify-operator')
def verify_operator(auth_service: AuthService = Depends(), Authorize: AuthJWT = Depends()):
   auth_service.verify_role("admin", Authorize)
   return True

@router.post("/register")
def register_user(user: User, auth_service: AuthService = Depends()):
    # Store user data in DynamoDB
    if auth_service.store_user_data(user):
        return {"message": "User registered successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to register user")