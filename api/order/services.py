import boto3
from .models import Order,DeliveryTimeUpdate,DeliveryTimeStampUpdate
from typing import List, Optional
import os
from datetime import datetime
import uuid
from dotenv import load_dotenv
from fastapi import HTTPException

load_dotenv()

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
            order_id = str(uuid.uuid4())
            created_date_str = str(datetime.now().isoformat())
            package_dimension = [str(cur_measurement) for cur_measurement in order.package_dimension]
            recipient_map = {key: {'S': value} for key, value in order.recipient.items()}
            self.dynamodb.put_item(
                TableName=self.TABLE_NAME,
                Item={
                    'sender_id':{'S': order.sender_id},
                    'order_id': {'S': order_id},
                    'warehouse': {'S': order.warehouse},
                    'destination': {'S': order.destination},
                    'package_dimension': {'NS': package_dimension},
                    'special_handling_instruction': {'S': order.special_handling_instruction},
                    'package_weight':{'N':str(order.package_weight)},
                    'latitude':{'N':str(order.latitude)},
                    'longitude':{'N':str(order.longitude)},
                    'recipient':{'M':recipient_map},
                    'created_date': {'S': created_date_str},
                    'delivery_date': {'S': ""},
                    'delivery_timestamp': {'S': ""}
                }
            )
            return {"status":True,"order_id":order_id}
        except Exception as e:
            print(f"Error creating order: {e}")
            return {"status":False,"order_id":""}

    def update_order(self, order: Order) -> bool:
        # Code to update order in the database
        try:
            order_check = self.get_order(order.order_id)
            if not order_check:
                raise HTTPException(status_code=404, detail="Order not found")
            created_date = str(order_check.created_date.isoformat())

            package_dimension = [str(cur_measurement) for cur_measurement in order.package_dimension]
            recipient_map = {key: {'S': value} for key, value in order.recipient.items()}
            sender_id = order_check.sender_id

            update_expression = "SET warehouse = :warehouse, destination = :destination, " \
                "package_dimension = :package_dimension, special_handling_instruction = :special_handling_instruction, " \
                "package_weight = :package_weight, latitude = :latitude, longitude = :longitude, " \
                "recipient = :recipient, created_date = :created_date" 

            expression_attribute_values = {
                ':warehouse': {'S': order.warehouse},
                ':destination': {'S': order.destination},
                ':package_dimension': {'NS': package_dimension},
                ':special_handling_instruction': {'S': order.special_handling_instruction},
                ':package_weight': {'N': str(order.package_weight)},
                ':latitude': {'N': str(order.latitude)},
                ':longitude': {'N': str(order.longitude)},
                ':recipient': {'M': recipient_map},
                ':created_date': {'S': created_date}
                }

            key = {'order_id': {'S': order.order_id}}

            self.dynamodb.update_item(Key=key,
                TableName=self.TABLE_NAME,
                UpdateExpression=update_expression,
                ExpressionAttributeValues=expression_attribute_values
            )
            return True
        except Exception as e:
            print(f"Error updating order: {e}")
            return False

    def update_delivery_date(self, delivery_date_update:DeliveryTimeUpdate) -> bool:
        # Code to update order in the database
        try:
            order_id = delivery_date_update.order_id
            order_check = self.get_order(order_id)

            if not order_check:
                raise HTTPException(status_code=404, detail="Order not found")

            delivery_date = str(delivery_date_update.delivery_date.isoformat())
            update_expression = "SET delivery_date = :delivery_date"
            
            expression_attribute_values = {
                ':delivery_date': {'S': delivery_date},
                }

            key = {'order_id': {'S': order_id}}

            self.dynamodb.update_item(Key=key,
                TableName=self.TABLE_NAME,
                UpdateExpression=update_expression,
                ExpressionAttributeValues=expression_attribute_values
            )
            return True
        except Exception as e:
            print(f"Error updating order: {e}")
            return False

    def update_delivery_timestamp(self, delivery_timestamp_update:DeliveryTimeStampUpdate) -> bool:
        # Code to update order in the database
        try:
            order_id = delivery_timestamp_update.order_id
            order_check = self.get_order(order_id)

            if not order_check:
                raise HTTPException(status_code=404, detail="Order not found")

            delivery_timestamp = str(delivery_timestamp_update.delivery_timestamp.isoformat())
            update_expression = "SET delivery_timestamp = :delivery_timestamp"
            
            expression_attribute_values = {
                ':delivery_timestamp': {'S': delivery_timestamp},
                }

            key = {'order_id': {'S': order_id}}

            self.dynamodb.update_item(Key=key,
                TableName=self.TABLE_NAME,
                UpdateExpression=update_expression,
                ExpressionAttributeValues=expression_attribute_values
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
                if item['delivery_date']['S'] == "":
                    delivery_date = None
                else:
                    delivery_date = item['delivery_date']['S']

                if item['delivery_timestamp']['S'] == "":
                    delivery_timestamp = None
                else:
                    delivery_timestamp = item['delivery_timestamp']['S']

                return Order(
                    sender_id = item['sender_id']['S'],
                    order_id=item['order_id']['S'],
                    warehouse=item['warehouse']['S'],
                    destination=item['destination']['S'],
                    package_dimension=item['package_dimension']['NS'],
                    special_handling_instruction=item['special_handling_instruction']['S'],
                    package_weight = item['package_weight']['N'],
                    latitude = item['latitude']['N'],
                    longitude = item['longitude']['N'],
                    recipient = item['recipient']['M'],
                    created_date = item['created_date']['S'],
                    delivery_date = delivery_date,
                    delivery_timestamp = delivery_timestamp,
                )
            else:
                print("Error 404, Order ID " + order_id + " not found")
                return None
        except Exception as e:
            print(f"Error retrieving order: {e}")
            return None

    def get_all_order(self) -> List[Order]:
        try:
            response = self.dynamodb.scan(
                TableName=self.TABLE_NAME
            )
            items = response.get('Items', [])
            orders = []
            for item in items:
                if item['delivery_date']['S'] == "":
                    delivery_date = None
                else:
                    delivery_date = item['delivery_date']['S']

                if item['delivery_timestamp']['S'] == "":
                    delivery_timestamp = None
                else:
                    delivery_timestamp = item['delivery_timestamp']['S']

                order = Order(
                    sender_id = item['sender_id']['S'],
                    order_id=item['order_id']['S'],
                    warehouse=item['warehouse']['S'],
                    destination=item['destination']['S'],
                    package_dimension=item['package_dimension']['NS'],
                    special_handling_instruction=item['special_handling_instruction']['S'],
                    package_weight = item['package_weight']['N'],
                    latitude = item['latitude']['N'],
                    longitude = item['longitude']['N'],
                    recipient = item['recipient']['M'],
                    created_date = item['created_date']['S'],
                    delivery_date = delivery_date,
                    delivery_timestamp = delivery_timestamp,
                )
                orders.append(order)
            return orders
        except Exception as e:
            print(f"Error retrieving orders: {e}")
            return []

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

    def get_order_by_user_id(self,sender_id:str) -> List[Order]:
        try:
            response = self.dynamodb.query(
                TableName=self.TABLE_NAME,
                IndexName="sender_id-index",  # Secondary index on sender_id
                KeyConditionExpression="#sender_id = :sender_id_val",
                ExpressionAttributeNames={"#sender_id": "sender_id"},
                ExpressionAttributeValues={":sender_id_val": {"S": sender_id}}
            )

            items = response.get('Items', [])
            orders = []
            for item in items:
                if item['delivery_date']['S'] == "":
                    delivery_date = None
                else:
                    delivery_date = item['delivery_date']['S']

                if item['delivery_timestamp']['S'] == "":
                    delivery_timestamp = None
                else:
                    delivery_timestamp = item['delivery_timestamp']['S']

                order = Order(
                    sender_id = item['sender_id']['S'],
                    order_id=item['order_id']['S'],
                    warehouse=item['warehouse']['S'],
                    destination=item['destination']['S'],
                    package_dimension=item['package_dimension']['NS'],
                    special_handling_instruction=item['special_handling_instruction']['S'],
                    package_weight = item['package_weight']['N'],
                    latitude = item['latitude']['N'],
                    longitude = item['longitude']['N'],
                    recipient = item['recipient']['M'],
                    created_date = item['created_date']['S'],
                    delivery_date = delivery_date,
                    delivery_timestamp = delivery_timestamp,
                )
                orders.append(order)
            return orders
        except Exception as e:
            print(f"Error retrieving orders: {e}")
            return []
