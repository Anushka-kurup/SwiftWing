from .models import User
from user.user_controller import get_users_by_email
import hashlib
from fastapi_jwt_auth import AuthJWT
from fastapi import HTTPException, Depends
from typing import Optional


class AuthService:
    
    @staticmethod
    def authenticate_user(user: User, Authorize: AuthJWT) -> Optional[dict]:
        user_data = get_users_by_email(user.email)

        for profile_key, profile_data in user_data.items():
            if profile_data["email"] == user.email:
                hashed_password = hashlib.sha256(user.password.encode("utf-8")).hexdigest()

                if hashed_password == profile_data["password"] and profile_data["role"] == user.role:
                     access_token = Authorize.create_access_token(subject=user.email, user_claims={"role": user.role})
                     return {"access_token": access_token}

        return None
    
    @staticmethod
    def get_current_user(Authorize: AuthJWT = Depends()):
        Authorize.jwt_required()
        raw_jwt = Authorize.get_raw_jwt()
        role = raw_jwt.get("role")
        current_user = raw_jwt.get("sub")
        return {"user": current_user, "role": role}

    def verify_role(self, role: str, Authorize: AuthJWT = Depends()):

        Authorize.jwt_required()
        raw_jwt = Authorize.get_raw_jwt()
        user_role = raw_jwt.get("role")
        
        if user_role != role:
            raise HTTPException(status_code=403, detail=f"Only {role}s can access this endpoint")
        
        return {f"{role.capitalize()} verified"}
