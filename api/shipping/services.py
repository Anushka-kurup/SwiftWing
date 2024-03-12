from typing import Dict
from .models import Shipping
from auth.routes import verify_operator
from fastapi import HTTPException
import boto3
import os
from order.services import OrderService

class ShippingService:
    def __init__(self, order_service: OrderService):
        self.order_service = order_service
        
        access_key = os.environ.get('AWS_ACCESS_KEY_ID')
        secret_key = os.environ.get('AWS_SECRET_ACCESS_KEY')
        region = 'us-east-1'
        
        self.dynamodb = boto3.client('dynamodb', region_name=region, aws_access_key_id=access_key, aws_secret_access_key=secret_key)
        self.orders_table_name = 'Orders'
        self.shippings_table_name = 'Shippings'

    def create_shipping(self, shipping: Shipping, verify_operator: bool):
        # Check operator verification
        if not verify_operator:
            raise HTTPException(status_code=401, detail="Operator verification failed")
        
        # Check if the order exists
        order = self.order_service.get_order(shipping.order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        try:
            return True
        except Exception as e:
            print(f"Error creating shipping: {e}")
            return False

    def update_shipping_status(self, shipping_id: str, status: str, operator_verified: bool):
        # Check operator verification
        if not operator_verified:
            raise HTTPException(status_code=401, detail="Operator verification failed")
        
        # Code to update shipping status in the database
        try:
            # Add shipping status update logic here
            return True
        except Exception as e:
            print(f"Error updating shipping status: {e}")
            return False

    def view_shipping(self, shipping_id: str, operator_verified: bool):
    # Check operator verification
        if not operator_verified:
            raise HTTPException(status_code=401, detail="Operator verification failed")
        
        try:
            # Retrieve shipping details from the database
            response = self.dynamodb.get_item(
                TableName=self.TABLE_NAME,
                Key={'shipping_id': {'S': shipping_id}}
            )
            
            # Check if the item exists
            if 'Item' not in response:
                raise HTTPException(status_code=404, detail="Shipping ID not found")

            # Extract shipping details from the response
            shipping_details = response['Item']
            # Example: shipping_id = shipping_details['shipping_id']['S']
            # Extract other attributes as needed
            
            # Return shipping details
            return shipping_details
            
        except Exception as e:
            print(f"Error retrieving shipping: {e}")
            return None


