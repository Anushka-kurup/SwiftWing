import os
import uvicorn
import boto3
from dotenv import load_dotenv
from fastapi import FastAPI
from auth.routes import router as auth_router
from order.routes import router as order_router
from shipping.routes import router as shipping_router
from session.routes import router as sessions_router
from shipping.services import ShippingService
from order.services import OrderService
from others.routes import router as optimize_router
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

# Get AWS credentials from environment variables
access_key = os.environ.get('AWS_ACCESS_KEY_ID')
secret_key = os.environ.get('AWS_SECRET_ACCESS_KEY')
region = 'us-east-1'

# Create a DynamoDB client with the obtained credentials
dynamodb = boto3.client('dynamodb', region_name=region, aws_access_key_id=access_key, aws_secret_access_key=secret_key)

# Initialize FastAPI app
app = FastAPI()

# Configure CORS:
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)


# Instantiate order service
order_service = OrderService()

# Instantiate shipping service with the order service instance
shipping_service = ShippingService(order_service)

# Include the routers
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(sessions_router, prefix="/session", tags=["Session Management"])
app.include_router(order_router, prefix="/order", tags=["Order Management"])
app.include_router(shipping_router, prefix="/shipping", tags=["Shipping Management"])
app.include_router(optimize_router, prefix="/optimize", tags=["Optimize Route"])

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=5000, log_level="info")
