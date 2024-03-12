import boto3
from .models import Order
from typing import List
import os

class OrderService:
    def __init__(self):
        access_key = os.environ.get('AWS_ACCESS_KEY_ID')
        secret_key = os.environ.get('AWS_SECRET_ACCESS_KEY')
        region = 'us-east-1'
        
        self.dynamodb = boto3.client('dynamodb', region_name=region, aws_access_key_id=access_key, aws_secret_access_key=secret_key)
        self.TABLE_NAME = 'Orders'

    def create_order(self, order: Order) -> bool:
        # Code to create order in the database
        try:
            self.dynamodb.put_item(
                TableName=self.TABLE_NAME,
                Item={
                    'order_id': {'S': order.order_id},
                    'pickup_location': {'S': order.pickup_location},
                    'destination': {'S': order.destination},
                    'package_dimension': {'SS': order.package_dimension},
                    'special_handling_instruction': {'S': order.special_handling_instruction}
                }
            )
            return True
        except Exception as e:
            print(f"Error creating order: {e}")
            return False

    def update_order(self, order_id: str, order: Order) -> bool:
        # Code to update order in the database
        try:
            self.dynamodb.put_item(
                TableName=self.TABLE_NAME,
                Item={
                    'order_id': {'S': order_id},
                    'pickup_location': {'S': order.pickup_location},
                    'destination': {'S': order.destination},
                    'package_dimension': {'SS': order.package_dimension},
                    'special_handling_instruction': {'S': order.special_handling_instruction}
                }
            )
            return True
        except Exception as e:
            print(f"Error updating order: {e}")
            return False

    def get_order(self, order_id: str) -> Order:
        # Code to retrieve order from the database
        try:
            response = self.dynamodb.get_item(
                TableName=self.TABLE_NAME,
                Key={'order_id': {'S': order_id}}
            )
            item = response.get('Item')
            if item:
                return Order(
                    order_id=item['order_id']['S'],
                    pickup_location=item['pickup_location']['S'],
                    destination=item['destination']['S'],
                    package_dimension=item['package_dimension']['SS'],
                    special_handling_instruction=item['special_handling_instruction']['S']
                )
            else:
                return None
        except Exception as e:
            print(f"Error retrieving order: {e}")
            return None

    def delete_order(self, order_id: str) -> bool:
        # Code to delete order from the database
        try:
            self.dynamodb.delete_item(
                TableName=self.TABLE_NAME,
                Key={'order_id': {'S': order_id}}
            )
            return True
        except Exception as e:
            print(f"Error deleting order: {e}")
            return False
