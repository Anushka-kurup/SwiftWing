from fastapi import APIRouter, Depends, HTTPException
from fastapi_jwt_auth import AuthJWT
from . import services
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