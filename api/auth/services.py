import boto3
from .models import User, UserLogin
import hashlib
from fastapi_jwt_auth import AuthJWT
from fastapi import HTTPException, Depends
from typing import Optional
import hashlib
import uuid

class AuthService:

    def __init__(self):
        self.dynamodb = boto3.client('dynamodb', region_name='us-east-1')
        self.TABLE_NAME = 'Users'

    
    def login(self, user: UserLogin, Authorize: AuthJWT) -> Optional[dict]:
        try:
            email_response = None
            
            email_response = self.dynamodb.query(
                TableName=self.TABLE_NAME,
                IndexName='email_index',  
                KeyConditionExpression='email = :email',
                ExpressionAttributeValues={':email': {'S': user.email}}
            )
            
            if email_response['Items']:
                user_data = email_response['Items'][0]
                hashed_password = hashlib.sha256(user.password.encode("utf-8")).hexdigest()
                
                if hashed_password == user_data.get("password").get("S") and user.role == user_data.get("role").get("S"):
                    access_token = Authorize.create_access_token(subject=user.email, user_claims={"role": user_data.get("role").get("S")})
                    return {"access_token": access_token}
        except Exception as e:
            print(f"Error during login: {e}")
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
            # Check if user already exists by email
            email_response = self.dynamodb.query(
                TableName=self.TABLE_NAME,
                IndexName='email_index',  # Assuming 'email_index' is the name of the GSI on the 'email' attribute
                KeyConditionExpression='email = :email',
                ExpressionAttributeValues={':email': {'S': user.email}}
            )
            if email_response['Items']:
                raise ValueError("User with this email already exists")

            # Generate UUID for the user ID
            user_uuid = str(uuid.uuid4())

            # Define user item including UUID
            hashed_password = hashlib.sha256(user.password.encode("utf-8")).hexdigest()
            user_item = {
                'pk': {'S': user_uuid},
                'user_id': {'S': user_uuid},
                'email': {'S': user.email},
                'first_name': {'S': user.first_name},
                'last_name': {'S': user.last_name},
                'password': {'S': hashed_password},
                'role': {'S': user.role},
                # Add other attributes as needed
            }

      
            # Store user data in DynamoDB
            self.dynamodb.put_item(
                TableName=self.TABLE_NAME,
                Item=user_item
            )


            return True
        except ValueError as ve:
            print(f"Error storing user data: {ve}")
            return False
        except Exception as e:
            print(f"Error storing user data: {e}")
            return False
        finally:
            # Add any cleanup or logging operations here
            pass 

    def get_all_drivers(self):
        try:
            response = self.dynamodb.scan(
                TableName=self.TABLE_NAME,
                FilterExpression="#r = :role",
                ExpressionAttributeNames={"#r": "role"},
                ExpressionAttributeValues={":role": {"S": "driver"}}
            )
            drivers = [{
                "name":f"{item['first_name']['S']} {item['last_name']['S']}",
                "user_id": item['user_id']['S'],
                } for item in response['Items']]
            return drivers
        except Exception as e:
            print(f"Error fetching drivers: {e}")
            return []

