import boto3
from .models import Delivery
from typing import List, Optional
import os
from datetime import date
import uuid
from dotenv import load_dotenv
from fastapi import HTTPException

load_dotenv()

class DeliveryService:
    def __init__(self):
        access_key = os.environ.get('AWS_ACCESS_KEY_ID')
        secret_key = os.environ.get('AWS_SECRET_ACCESS_KEY')
        region = 'us-east-1'
        
        self.dynamodb = boto3.client('dynamodb', region_name=region, aws_access_key_id=access_key, aws_secret_access_key=secret_key)
        self.TABLE_NAME = 'Delivery'

    def create_delivery(self, delivery: Delivery) -> bool:
        # Code to create order in the database
        try:
            delivery_map = {
                key: {'L': [{'S': item} for item in value]}  
                for key, value in delivery.delivery_map.items()
            }
            delivery_date = str(date.fromisoformat(str(delivery.delivery_date)))
            self.dynamodb.put_item(
                TableName=self.TABLE_NAME,
                Item={
                    'delivery_date':{'S': delivery_date},
                    'delivery_map':{'M': delivery_map}
                }
            )
            return True

        except Exception as e:
            print(f"Error creating order: {e}")
            return False

    def get_delivery(self, delivery_date: str) -> Delivery:
        # Code to retrieve order from the database
        try:
            delivery_date = str(date.fromisoformat(str(delivery_date)))
            response = self.dynamodb.get_item(
                TableName=self.TABLE_NAME,
                Key={'delivery_date': {'S': delivery_date}}
            )

            item = response.get('Item')
            delivery_dict = {}

            for key, value in item['delivery_map']['M'].items():
                cur_delivery = [item['S'] for item in value['L']]
                delivery_dict[key] = cur_delivery

            if item:
                return Delivery(
                    delivery_date = item['delivery_date']['S'],
                    delivery_map = delivery_dict,
                )
            else:
                print("Error 404, Delivery Date " + delivery_date + " not found")
                return None
            
        except Exception as e:
            print(f"Error retrieving order: {e}")
            return None

    def get_all_delivery(self) -> List[Delivery]:
        # Code to retrieve order from the database
        try:
            response = self.dynamodb.scan(
                TableName=self.TABLE_NAME
            )

            item_list = response.get('Items', [])
            delivery_list = []

            for item in item_list:
                delivery_dict = {}

                for key, value in item['delivery_map']['M'].items():
                    cur_delivery = [item['S'] for item in value['L']]
                    delivery_dict[key] = cur_delivery

                cur_delivery = Delivery(
                        delivery_date = item['delivery_date']['S'],
                        delivery_map = delivery_dict,
                    )
                
                delivery_list.append(cur_delivery)

            return delivery_list
            
        except Exception as e:
            print(f"Error retrieving order: {e}")
            return None

    def update_delivery(self, delivery: Delivery) -> bool:
        # Code to update order in the database
        try:
            delivery_date = str(date.fromisoformat(str(delivery.delivery_date)))
            delivery_check = self.get_delivery(delivery_date)

            if not delivery_check:
                raise HTTPException(status_code=404, detail="Order not found")

            delivery_map = {
                key: {'L': [{'S': item} for item in value]}  
                for key, value in delivery.delivery_map.items()
            }

            update_expression = "SET delivery_map = :delivery_map" 

            expression_attribute_values = {
                ':delivery_map': {'M': delivery_map},
                }

            key = {'delivery_date': {'S': delivery_date}}

            self.dynamodb.update_item(Key=key,
                TableName=self.TABLE_NAME,
                UpdateExpression=update_expression,
                ExpressionAttributeValues=expression_attribute_values
            )
            return True
        except Exception as e:
            print(f"Error updating order: {e}")
            return False

    def add_delivery(self, delivery: Delivery) -> bool:
        # Code to update order in the database
        try:
            delivery_date = str(date.fromisoformat(str(delivery.delivery_date)))
            delivery_check = self.get_delivery(delivery_date)

            if not delivery_check:
                raise HTTPException(status_code=404, detail="Order not found")

            delivery_map = delivery_check.delivery_map
            new_delivery_map = delivery.delivery_map
            delivery_map.update(new_delivery_map)

            delivery_map = {
                key: {'L': [{'S': item} for item in value]}  
                for key, value in delivery_map.items()
            }

            update_expression = "SET delivery_map = :delivery_map" 

            expression_attribute_values = {
                ':delivery_map': {'M': delivery_map},
                }

            key = {'delivery_date': {'S': delivery_date}}

            self.dynamodb.update_item(Key=key,
                TableName=self.TABLE_NAME,
                UpdateExpression=update_expression,
                ExpressionAttributeValues=expression_attribute_values
            )
            return True
        except Exception as e:
            print(f"Error updating order: {e}")
            return False

    def update_delivery_list(self, delivery: Delivery) -> bool:
        # Code to update order in the database
        try:
            delivery_date = str(date.fromisoformat(str(delivery.delivery_date)))
            delivery_check = self.get_delivery(delivery_date)

            if not delivery_check:
                raise HTTPException(status_code=404, detail="Order not found")

            delivery_map = delivery_check.delivery_map
            new_delivery_map = delivery.delivery_map

            for user_id, delivery_list in new_delivery_map.items():
                delivery_map[user_id] = delivery_list

            delivery_map = {
                key: {'L': [{'S': item} for item in value]}  
                for key, value in delivery_map.items()
            }

            update_expression = "SET delivery_map = :delivery_map" 

            expression_attribute_values = {
                ':delivery_map': {'M': delivery_map},
                }

            key = {'delivery_date': {'S': delivery_date}}

            self.dynamodb.update_item(Key=key,
                TableName=self.TABLE_NAME,
                UpdateExpression=update_expression,
                ExpressionAttributeValues=expression_attribute_values
            )
            return True
        except Exception as e:
            print(f"Error updating delivery: {e}")
            return False
