from typing import Dict
from .models import Shipping
from auth.routes import verify_operator
from fastapi import HTTPException
import boto3
import os
from order.services import OrderService
from typing import List
from dotenv import load_dotenv
load_dotenv()

class ShippingService:
    def __init__(self, order_service: OrderService):
        self.order_service = order_service
        
        access_key = os.environ.get('AWS_ACCESS_KEY_ID')
        secret_key = os.environ.get('AWS_SECRET_ACCESS_KEY')
        region = 'us-east-1'
        
        self.dynamodb = boto3.client('dynamodb', region_name=region, aws_access_key_id=access_key, aws_secret_access_key=secret_key)
        self.orders_table_name = 'Orders'
        self.shippings_table_name = 'Shippings'

    def create_shipping(self, shipping: Shipping):
        # Check if the order exists
        order = self.order_service.get_order(shipping.shipping_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        try:
            self.dynamodb.put_item(
                TableName=self.shippings_table_name,
                Item={
                    'shipping_id': {'S': shipping.shipping_id},
                    'status': {'S': shipping.status},
                    'operator_id': {'S': shipping.operator_id},
                }
            )
            return True
        except Exception as e:
            print(f"Error creating shipping: {e}")
            return False

    def update_shipping(self, shipping: Shipping) -> bool:
        # Code to update order in the database
        try:
            shipping_check = self.get_shipping(shipping.shipping_id)
            if not shipping_check:
                raise HTTPException(status_code=404, detail="Shipping not found")
            self.dynamodb.put_item(
                TableName=self.shippings_table_name,
                Item={
                    'shipping_id': {'S': shipping.shipping_id},
                    'status': {'S': shipping.status},
                    'operator_id': {'S': shipping.operator_id},
                }
            )
            return True
        except Exception as e:
            print(f"Error updating order: {e}")
            return False


    def get_shipping(self, shipping_id: str) -> Shipping:
        # Code to retrieve order from the database
        try:
            response = self.dynamodb.get_item(
                TableName=self.shippings_table_name,
                Key={'shipping_id': {'S': shipping_id}}
            )
            item = response.get('Item')
            if item:
                return Shipping(
                    shipping_id=item['shipping_id']['S'],
                    status=item['status']['S'],
                    operator_id=item['operator_id']['S'],
                )
            else:
                print("Error 404, Order ID " + shipping_id + " not found")
                return None
        except Exception as e:
            print(f"Error retrieving order: {e}")
            return None

    def get_all_shipping(self) -> List[Shipping]:
        try:
            response = self.dynamodb.scan(
                TableName=self.shippings_table_name
            )
            items = response.get('Items', [])
            orders = []
            for item in items:
                order = Shipping(
                    shipping_id=item['shipping_id']['S'],
                    status=item['status']['S'],
                    operator_id=item['operator_id']['S']
                )
                orders.append(order)
            return orders
        except Exception as e:
            print(f"Error retrieving orders: {e}")
            return []
