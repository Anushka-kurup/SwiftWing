from flask import Flask, request, jsonify
from flask_cors import CORS
import boto3
import os

app = Flask(__name__)
CORS(app)

# dynamodb = boto3.resource(
#     'dynamodb', 
#     region_name=os.environ.get('REGION'), 
#     aws_access_key_id=os.environ.get('ACCESS_KEY'), 
#     aws_secret_access_key=os.environ.get('SECRET_KEY')
# )

# user_table = dynamodb.Table('user')

# def get_all_users():
#     return user_table.scan()

# def get_user_by_email(email):
#     res = user_table.get_item(
#         Key={
#             'user_email': email
#         },
#         AttributesToGet=[
#             'password',
#             'user_name',
#             'user_address',
#         ]
#     )
#     return res

# @app.route("/api/v1/user/health")
# def check_health():
#     return "User service is up and running"

# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5001, debug=True)

def get_user_by_email(email):
    # Mock user data for testing
    mock_user_data = {
        "UserProfile": {
            "email": "test@example.com",
            "password": "b2867617492e26c338ab49f72afabc984d798b59755a27e312b953716ae964d7",
            "role": "admin",
            "user_name": "Test User",
            "user_address": "123 Test St, Test City"
        }
    }
    return mock_user_data
