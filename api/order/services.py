import logging
import boto3
from .models import Order,DeliveryTimeUpdate,DeliveryTimeStampUpdate
from typing import List, Optional
import os
from datetime import datetime, date
import uuid
from dotenv import load_dotenv
from fastapi import HTTPException
from delivery.models import ClientDelivery
from delivery.services import DeliveryService

load_dotenv()

class OrderService:
    def __init__(self):
        access_key = os.environ.get('AWS_ACCESS_KEY_ID')
        secret_key = os.environ.get('AWS_SECRET_ACCESS_KEY')
        region = 'us-east-1'
        #DynamoDB
        self.dynamodb = boto3.client('dynamodb', region_name=region, aws_access_key_id=access_key, aws_secret_access_key=secret_key)
        self.TABLE_NAME = 'Orders'
        #S3
        self.SURPPORTED_FILE_TYPES = {
            'image/png': 'png',
            'image/jpeg': 'jpg',
            'image/jfif': 'jfif',
            'image/gif': 'gif',
            'image/bmp': 'bmp',
            'image/webp': 'webp',
            'image/tiff': 'tiff',
            'image/svg+xml': 'svg',
            'image/x-icon': 'ico'
        }
        self.s3 = boto3.client('s3', region_name=region, aws_access_key_id=access_key, aws_secret_access_key=secret_key)
        self.BUCKET_NAME = os.environ.get('S3_BUCKET_NAME')
        

    def create_order(self, order: Order) -> bool:
        # Code to create order in the database
        try:
            order_id = str(uuid.uuid4())
            created_date_str = str(datetime.now().isoformat())
            recipient_map = {key: {'S': value} for key, value in order.recipient.items()}
            package_map = {key: {'S': value} for key, value in order.package_dimension.items()}
            delivery_date = order.delivery_date
            if delivery_date=="" or delivery_date==None:
                delivery_date = ""

            else:
                delivery_date = str(order.delivery_date.isoformat())
            self.dynamodb.put_item(
                TableName=self.TABLE_NAME,
                Item={
                    'sender_id':{'S': order.sender_id},
                    'order_id': {'S': order_id},
                    'warehouse': {'S': order.warehouse},
                    'destination': {'S': order.destination},
                    'package_dimension': {'M': package_map},
                    'special_handling_instruction': {'S': order.special_handling_instruction},
                    'package_weight':{'N':str(order.package_weight)},
                    'latitude':{'N':str(order.latitude)},
                    'longitude':{'N':str(order.longitude)},
                    'recipient':{'M':recipient_map},
                    'created_date': {'S': created_date_str},
                    'delivery_date': {'S': delivery_date},
                    'delivery_timestamp': {'S': ""}
                }
            )

            delivery_date_str = str(date.today())  # Convert date to string in ISO format
            client_delivery = ClientDelivery(delivery_date=delivery_date_str, delivery_id=order_id)
            delivery_service = DeliveryService()
            delivery_service.update_delivery_client(client_delivery)

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
            recipient_map = {key: {'S': value} for key, value in order.recipient.items()}
            package_map = {key: {'S': value} for key, value in order.package_dimension.items()}

            update_expression = "SET warehouse = :warehouse, destination = :destination, " \
                "package_dimension = :package_dimension, special_handling_instruction = :special_handling_instruction, " \
                "package_weight = :package_weight, latitude = :latitude, longitude = :longitude, " \
                "recipient = :recipient, created_date = :created_date" 

            expression_attribute_values = {
                ':warehouse': {'S': order.warehouse},
                ':destination': {'S': order.destination},
                ':package_dimension': {'M': package_map},
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
                    package_dimension={key: value['S'] for key, value in item['package_dimension']['M'].items()},
                    special_handling_instruction=item['special_handling_instruction']['S'],
                    package_weight = item['package_weight']['N'],
                    latitude = item['latitude']['N'],
                    longitude = item['longitude']['N'],
                    recipient = {key: value['S'] for key, value in item['recipient']['M'].items()},
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
                    package_dimension={key: value['S'] for key, value in item['package_dimension']['M'].items()},
                    special_handling_instruction=item['special_handling_instruction']['S'],
                    package_weight = item['package_weight']['N'],
                    latitude = item['latitude']['N'],
                    longitude = item['longitude']['N'],
                    recipient = {key: value['S'] for key, value in item['recipient']['M'].items()},
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

    def get_order_by_user_id(self,sender_id:str,start_date: str = None, end_date: str = None) -> List[Order]:
        try:
            key_condition_expression = "#sender_id = :sender_id_val"
            expression_attribute_names = {"#sender_id": "sender_id"}
            expression_attribute_values = {":sender_id_val": {"S": sender_id}}
            
            if start_date!=None and end_date!=None:
                start_date =  datetime.strptime(start_date, "%Y-%m-%d").isoformat()
                end_date =  datetime.strptime(end_date, "%Y-%m-%d").replace(hour=23, minute=59, second=59).isoformat()
                key_condition_expression += " AND delivery_date BETWEEN :start_date_val AND :end_date_val"
                expression_attribute_values[":start_date_val"] = {"S": start_date}
                expression_attribute_values[":end_date_val"] = {"S": end_date}

            elif start_date!=None and end_date==None:
                start_date =  datetime.strptime(start_date, "%Y-%m-%d").isoformat()
                key_condition_expression += " AND delivery_date >= :start_date_val"
                expression_attribute_values[":start_date_val"] = {"S": start_date}

            elif start_date==None and end_date!=None:
                end_date =  datetime.strptime(end_date, "%Y-%m-%d").replace(hour=23, minute=59, second=59).isoformat()
                key_condition_expression += " AND delivery_date <= :end_date_val"
                expression_attribute_values[":end_date_val"] = {"S": end_date}
            
            response = self.dynamodb.query(
                TableName=self.TABLE_NAME,
                IndexName="sender_id-index",  # Secondary index on sender_id
                KeyConditionExpression=key_condition_expression,
                ExpressionAttributeNames=expression_attribute_names,
                ExpressionAttributeValues=expression_attribute_values
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
                    package_dimension={key: value['S'] for key, value in item['package_dimension']['M'].items()},
                    special_handling_instruction=item['special_handling_instruction']['S'],
                    package_weight = item['package_weight']['N'],
                    latitude = item['latitude']['N'],
                    longitude = item['longitude']['N'],
                    recipient = {key: value['S'] for key, value in item['recipient']['M'].items()},
                    created_date = item['created_date']['S'],
                    delivery_date = delivery_date,
                    delivery_timestamp = delivery_timestamp,
                )
                orders.append(order)
            return orders
        except Exception as e:
            print(f"Error retrieving orders: {e}")
            return []

    def get_order_by_delivery_date(self,start_date: str = None, end_date: str = None) -> List[Order]:
        try:
            expression_attribute_values = {}
            
            if start_date!=None and end_date!=None:
                start_date =  datetime.strptime(start_date, "%Y-%m-%d").isoformat()
                print(start_date)
                end_date =  datetime.strptime(end_date, "%Y-%m-%d").replace(hour=23, minute=59, second=59).isoformat()
                print(end_date)
                filter_expression = "delivery_date BETWEEN :start_date_val AND :end_date_val"
                expression_attribute_values[":start_date_val"] = {"S": start_date}
                expression_attribute_values[":end_date_val"] = {"S": end_date}

            elif start_date!=None and end_date==None:
                start_date =  datetime.strptime(start_date, "%Y-%m-%d").isoformat()
                filter_expression = "delivery_date >= :start_date_val"
                expression_attribute_values[":start_date_val"] = {"S": start_date}

            elif start_date==None and end_date!=None:
                end_date =  datetime.strptime(end_date, "%Y-%m-%d").replace(hour=23, minute=59, second=59).isoformat()
                filter_expression = "delivery_date <= :end_date_val"
                expression_attribute_values[":end_date_val"] = {"S": end_date}
            
            response = self.dynamodb.scan(
                TableName=self.TABLE_NAME,
                FilterExpression=filter_expression,
                ExpressionAttributeValues=expression_attribute_values
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
                    package_dimension={key: value['S'] for key, value in item['package_dimension']['M'].items()},
                    special_handling_instruction=item['special_handling_instruction']['S'],
                    package_weight = item['package_weight']['N'],
                    latitude = item['latitude']['N'],
                    longitude = item['longitude']['N'],
                    recipient = {key: value['S'] for key, value in item['recipient']['M'].items()},
                    created_date = item['created_date']['S'],
                    delivery_date = delivery_date,
                    delivery_timestamp = delivery_timestamp,
                )
                orders.append(order)
            return orders
        except Exception as e:
            print(f"Error retrieving orders: {e}")
            return []

    async def upload_to_s3(self, file_payload, file_name: str) -> bool:
        try:
            # Check size
            contents = []
            size = 0
            while True:
                chunk = await file_payload.read(8192)  # read 8192 bytes
                if not chunk:
                    break
                size += len(chunk)
                contents.append(chunk)
            if size > 5 * 1024 * 1024:
                raise ValueError("File size exceeds 5MB")
            
            print(f"Uploading file {file_name} to S3 of size {size} bytes")
            
            # Check content type
            file_extension = self.SURPPORTED_FILE_TYPES.get(file_payload.content_type)
            print(file_extension)
            if file_extension is None:
                raise ValueError("Unsupported file type")
            
            # Upload
            file_contents = b''.join(contents)
            self.s3.put_object(Body=file_contents, Bucket=self.BUCKET_NAME, Key=file_name, ContentType=file_payload.content_type)
            return True
        except Exception as e:
            print(f"Error uploading file: {e}")
            return False
        
        
    async def retrieve_S3_url(self, file_name: str) -> str:
        try:
            url = self.s3.generate_presigned_url('get_object', Params={'Bucket': self.BUCKET_NAME, 'Key': file_name}, ExpiresIn=3600)
            return url
        except Exception as e:
            print(f"Error retrieving file: {e}")
            return None
        

    