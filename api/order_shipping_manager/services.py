import logging
from typing import Dict
from order.models import DeliveryTimeUpdate, Order,OrderCreationResponse,DeliveryTimeStampUpdate
from shipping.models import Shipping
from .models import ShippingInfo,OrderID
from auth.routes import verify_operator
from fastapi import HTTPException
import boto3
import os
from order.services import OrderService
from shipping.services import ShippingService
from delivery.services import DeliveryService
from typing import List
from dotenv import load_dotenv
from datetime import date, datetime, time

load_dotenv()

class OrderShippingService:
    def __init__(self, order_service: OrderService,shipping_service:ShippingService ):
        self.order_service = order_service
        self.shipping_service = shipping_service
        self.delivery_service = DeliveryService()
        access_key = os.environ.get('AWS_ACCESS_KEY_ID')
        secret_key = os.environ.get('AWS_SECRET_ACCESS_KEY')
        region = 'us-east-1'

    def create_order_service(self, order:Order):
        # Check if the order exists
        try:
            print("Creating order....")
            order_result = self.order_service.create_order(order)
            order_creation_status = order_result["status"]
            order_id = order_result["order_id"]

            if order_creation_status == False:
                print("Error creating order")
                return False

            print("Order creation successful. Order created with ID: " + order_id)
            print("Creating shipping")

            shipping_item = Shipping(
                shipping_id=order_id,
                shipping_status="Awaiting Assignment",
                operator_id="")

            shipping_creation = self.shipping_service.create_shipping(shipping_item)

            if shipping_creation == False:
                print("Error creating shipping")
                return False

            print("Shipping creation successful.")
            return True

        except Exception as e:
            print(f"Error creating order/shipping: {e}")
            return False

    def get_shipping_info(self, shipping_id: str) -> ShippingInfo:
        # Code to retrieve order from the database
        try:
            print("Retrieving order information....")
            order = self.order_service.get_order(shipping_id)

            if order == None:
                print("Error retrieving order.")
                return None

            print("Order retrieval successful.")
            print("Retrieving shipping information....")
            shipping = self.shipping_service.get_shipping(shipping_id)

            if shipping == None:
                print("Error retrieving shipping.")
                return None

            print("Shipping retrieval successful.")
            print("Preparing information....")
            if order.delivery_date == "" or order.delivery_date == None:
                delivery_date = None
            else:
                delivery_date = order.delivery_date
            
            if order.delivery_timestamp == "" or order.delivery_timestamp == None:
                delivery_timestamp = None
            else:
                delivery_timestamp = order.delivery_timestamp

            return ShippingInfo(
                shipping_id=shipping.shipping_id,
                sender_id = order.sender_id,
                warehouse=order.warehouse,
                destination=order.destination,
                package_dimension=order.package_dimension,
                special_handling_instruction=order.special_handling_instruction,
                package_weight = order.package_weight,
                latitude = order.latitude,
                longitude = order.longitude,
                recipient = order.recipient,
                created_date = order.created_date,
                delivery_date = delivery_date,
                delivery_timestamp = delivery_timestamp,
                shipping_status = shipping.shipping_status,
                driver_id = shipping.driver_id
                )
        except Exception as e:
            print(f"Error retrieving order: {e}")
            return None

    def get_all_shipping_info(self) -> ShippingInfo:
        # Code to retrieve order from the database
        try:
            print("Retrieving shipping information....")
            shipping_list = self.shipping_service.get_all_shipping()

            if shipping_list == None:
                print("Error retrieving shipping.")
                return None

            print("Shipping retrieval successful.")
            print("Retrieving order information....")
            shipping_info_list = []
            for shipping in shipping_list:
                cur_shipping_id = shipping.shipping_id
                order = self.order_service.get_order(cur_shipping_id)

                if order.delivery_date == "" or order.delivery_date == None:
                    delivery_date = None
                else:
                    delivery_date = order.delivery_date
                
                if order.delivery_timestamp == "" or order.delivery_timestamp == None:
                    delivery_timestamp = None
                else:
                    delivery_timestamp = order.delivery_timestamp

                shipping_info_list.append(
                    ShippingInfo(
                        shipping_id=shipping.shipping_id,
                        sender_id = order.sender_id,
                        warehouse=order.warehouse,
                        destination=order.destination,
                        package_dimension=order.package_dimension,
                        special_handling_instruction=order.special_handling_instruction,
                        package_weight = order.package_weight,
                        latitude = order.latitude,
                        longitude = order.longitude,
                        recipient = order.recipient,
                        created_date = order.created_date,
                        delivery_date = delivery_date,
                        delivery_timestamp = delivery_timestamp,
                        shipping_status = shipping.shipping_status,
                        driver_id = shipping.driver_id
                    )
                )
            return shipping_info_list
        except Exception as e:
            print(f"Error retrieving order: {e}")
            return None

    def complete_delivery(self,order_id_object:OrderID) -> ShippingInfo:
        # Code to retrieve order from the database
        try:
            order_id = order_id_object.order_id
            delivery_timestamp = datetime.now().isoformat()

            print("Updating status....")
            self.shipping_service.update_shipping_status(Shipping(shipping_id=order_id,shipping_status="Delivered"))
            print("Status updated.")

            print("Updating timestamp....")
            self.order_service.update_delivery_timestamp(DeliveryTimeStampUpdate(order_id=order_id,delivery_timestamp=delivery_timestamp))
            print("Timestamp created.")

            return True
        except Exception as e:
            print(f"Error retrieving order: {e}")
            return None

    def create_mass_order_service(self, order_list:List[Order]):
        # Check if the order exists
        try:
            for order in order_list:
                order_result = self.order_service.create_order(order)
                order_creation_status = order_result["status"]
                order_id = order_result["order_id"]

                if order_creation_status == False:
                    print("Error creating order")
                    return False

                shipping_item = Shipping(
                    shipping_id=order_id,
                    shipping_status="Awaiting Assignment",
                    operator_id="")

                shipping_creation = self.shipping_service.create_shipping(shipping_item)

                if shipping_creation == False:
                    print("Error creating shipping")
                    return False
            return True

        except Exception as e:
            print(f"Error creating order/shipping: {e}")
            return False

    def get_shipping_info_by_user_id(self,sender_id:str,start_date: str, end_date: str ) -> ShippingInfo:
        # Code to retrieve order from the database
        try:
            print("Retrieving order information....")
            order_list = self.order_service.get_order_by_user_id(sender_id,start_date,end_date)

            if order_list == None:
                print("Error retrieving order.")
                return None

            print("Order retrieval successful.")
            print("Retrieving shipping information....")
            shipping_info_list = []
            for order in order_list:
                cur_shipping_id = order.order_id
                shipping = self.shipping_service.get_shipping(cur_shipping_id)

                if order.delivery_date == "" or order.delivery_date == None:
                    delivery_date = None
                else:
                    delivery_date = order.delivery_date
                
                if order.delivery_timestamp == "" or order.delivery_timestamp == None:
                    delivery_timestamp = None
                else:
                    delivery_timestamp = order.delivery_timestamp

                shipping_info_list.append(
                    ShippingInfo(
                        shipping_id=shipping.shipping_id,
                        sender_id = order.sender_id,
                        warehouse=order.warehouse,
                        destination=order.destination,
                        package_dimension=order.package_dimension,
                        special_handling_instruction=order.special_handling_instruction,
                        package_weight = order.package_weight,
                        latitude = order.latitude,
                        longitude = order.longitude,
                        recipient = order.recipient,
                        created_date = order.created_date,
                        delivery_date = delivery_date,
                        delivery_timestamp = delivery_timestamp,
                        shipping_status = shipping.shipping_status,
                        driver_id = shipping.driver_id
                    )
                )
            return shipping_info_list
        except Exception as e:
            print(f"Error retrieving order: {e}")
            return None

    def get_shipping_info_by_delivery_date(self,start_date: str, end_date: str ) -> ShippingInfo:
        # Code to retrieve order from the database
        try:
            print("Retrieving order information....")
            order_list = self.order_service.get_order_by_delivery_date(start_date,end_date)

            if order_list == None:
                print("Error retrieving order.")
                return None

            print("Order retrieval successful.")
            print("Retrieving shipping information....")
            shipping_info_list = []
            for order in order_list:
                cur_shipping_id = order.order_id
                shipping = self.shipping_service.get_shipping(cur_shipping_id)

                if order.delivery_date == "" or order.delivery_date == None:
                    delivery_date = None
                else:
                    delivery_date = order.delivery_date
                
                if order.delivery_timestamp == "" or order.delivery_timestamp == None:
                    delivery_timestamp = None
                else:
                    delivery_timestamp = order.delivery_timestamp

                shipping_info_list.append(
                    ShippingInfo(
                        shipping_id=shipping.shipping_id,
                        sender_id = order.sender_id,
                        warehouse=order.warehouse,
                        destination=order.destination,
                        package_dimension=order.package_dimension,
                        special_handling_instruction=order.special_handling_instruction,
                        package_weight = order.package_weight,
                        latitude = order.latitude,
                        longitude = order.longitude,
                        recipient = order.recipient,
                        created_date = order.created_date,
                        delivery_date = delivery_date,
                        delivery_timestamp = delivery_timestamp,
                        shipping_status = shipping.shipping_status,
                        driver_id = shipping.driver_id
                    )
                )
            return shipping_info_list
        except Exception as e:
            print(f"Error retrieving order: {e}")
            return None
    
    def update_shipping_date(self,order_id:str,delivery_date: str, new_delivery_date: str) -> ShippingInfo:
        # Code to retrieve order from the database
        try:
            # Convert the date string to a datetime object
            new_delivery_date_dt = datetime.strptime(new_delivery_date, '%Y-%m-%d')

            # Update the delivery date in the order DB
            bool = self.order_service.update_delivery_date(DeliveryTimeUpdate(order_id=order_id,delivery_date=new_delivery_date_dt))
            if bool == False:
                print("Error updating delivery date in the order DB")
                return False
            
            # Update the delivery date in the delivery DB
                
            bool2 = self.delivery_service.change_delivery_date_of_delivery(delivery_date,new_delivery_date,order_id)
            if bool2 == False:
                print("Error updating delivery date in the delivery DB")
                return False
            
            return True
        except Exception as e:
            print(f"Error retrieving order: {e}")
            return False
        
