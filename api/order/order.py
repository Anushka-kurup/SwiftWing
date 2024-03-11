import boto3
from fastapi import APIRouter, Depends, HTTPException
from dotenv import load_dotenv
from user import verify_client
from pydantic import BaseModel
from typing import List

router = APIRouter()

load_dotenv()

class Order(BaseModel):
    order_id: str
    pickup_location: str
    destination: str
    package_dimension: List[str]
    special_handling_instruction: str

dynamodb = boto3.client('dynamodb')

TABLE_NAME = 'Orders'

@router.post("/create_order/", response_model=bool)
def create_order(order: Order, client_verified: bool = Depends(verify_client)):
 
    dynamodb.put_item(
        TableName=TABLE_NAME,
        Item={
            'order_id': {'S': order.order_id},
            'pickup_location': {'S': order.pickup_location},
            'destination': {'S': order.destination},
            'package_dimension': {'SS': order.package_dimension},
            'special_handling_instruction': {'S': order.special_handling_instruction}
        }
    )
    return True

@router.put("/update_order/", response_model=bool)
def update_order(order_id: str, order: Order):
    
    response = dynamodb.get_item(
        TableName=TABLE_NAME,
        Key={'order_id': {'S': order_id}}
    )
    if 'Item' not in response:
        raise HTTPException(status_code=404, detail="Order not found")

    dynamodb.put_item(
        TableName=TABLE_NAME,
        Item={
            'order_id': {'S': order_id},
            'pickup_location': {'S': order.pickup_location},
            'destination': {'S': order.destination},
            'package_dimension': {'SS': order.package_dimension},
            'special_handling_instruction': {'S': order.special_handling_instruction}
        }
    )
    return True

@router.get("/view_order/", response_model=Order)
def view_order(order_id: str, client_verified: bool = Depends(verify_client)):

    if not client_verified:
        raise HTTPException(status_code=401, detail="Client verification failed")

    response = dynamodb.get_item(
        TableName=TABLE_NAME,
        Key={'order_id': {'S': order_id}}
    )
    if 'Item' not in response:
        raise HTTPException(status_code=404, detail="Order not found")
    
    item = response['Item']
    return Order(
        order_id=item['order_id']['S'],
        pickup_location=item['pickup_location']['S'],
        destination=item['destination']['S'],
        package_dimension=item['package_dimension']['SS'],
        special_handling_instruction=item['special_handling_instruction']['S']
    )
