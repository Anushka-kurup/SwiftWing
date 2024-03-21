import boto3
from .models import User
#from user.user_controller import get_users_by_email
import hashlib
from fastapi_jwt_auth import AuthJWT
from fastapi import HTTPException, Depends
from typing import Optional

class AuthService:

    def __init__(self):
        self.dynamodb = boto3.client('dynamodb', region_name='us-east-1')
        self.TABLE_NAME = 'Users'

    def authenticate_user(self, user: User, Authorize: AuthJWT) -> Optional[dict]:
        try:
            response = self.dynamodb.get_item(
                TableName=self.TABLE_NAME,
                Key={'email': {'S': user.email}}
            )
            item = response.get('Item')
            if item:
                hashed_password = hashlib.sha256(user.password.encode("utf-8")).hexdigest()
                if hashed_password == item.get("password").get("S") and item.get("role").get("S") == user.role:
                    access_token = Authorize.create_access_token(subject=user.email, user_claims={"role": user.role})
                    return {"access_token": access_token}
        except Exception as e:
            print(f"Error authenticating user: {e}")
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
    
    def store_user_data(self, user: User):
        try:
            hashed_password = hashlib.sha256(user.password.encode("utf-8")).hexdigest()
            self.dynamodb.put_item(
                TableName=self.TABLE_NAME,
                Item={
                    'email': {'S': user.email},
                    'password': {'S': hashed_password},
                    'role': {'S': user.role}
                }
            )
            return True
        except Exception as e:
            print(f"Error storing user data: {e}")
            return False
    
    def get_all_drivers(self):
        try:
            response = self.dynamodb.scan(
                TableName=self.TABLE_NAME,
                FilterExpression="#r = :role",
                ExpressionAttributeNames={"#r": "role"},
                ExpressionAttributeValues={":role": {"S": "driver"}}
            )
            drivers = [item['email']['S'] for item in response['Items']]
            return drivers
        except Exception as e:
            print(f"Error fetching drivers: {e}")
            return []
