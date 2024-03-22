from fastapi import APIRouter, Depends, HTTPException
from .models import Order,OrderCreationResponse,DeliveryTimeUpdate,DeliveryTimeStampUpdate
from .services import OrderService
from typing import List
from datetime import datetime

router = APIRouter()
order_service = OrderService()

@router.post("/create_order/", response_model=OrderCreationResponse)
def create_order(order: Order):
    return order_service.create_order(order)

@router.put("/update_order/", response_model=bool)
def update_order( order: Order):
    return order_service.update_order(order)

@router.put("/update_delivery_date/", response_model=bool)
def update_order( delivery_date_update:DeliveryTimeUpdate):
    return order_service.update_delivery_date(delivery_date_update)

@router.put("/update_delivery_timestamp/", response_model=bool)
def update_delivery_timestamp( delivery_timestamp_update:DeliveryTimeStampUpdate):
    return order_service.update_delivery_timestamp(delivery_timestamp_update)

@router.get("/view_order/", response_model=Order)
def view_order(order_id: str):
    order = order_service.get_order(order_id)
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.get("/get_all_order/", response_model=List[Order])
def get_all_order():
    order_list = order_service.get_all_order()
    if order_list is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return order_list

@router.get("/get_order_by_user_id/", response_model=List[Order])
def get_order_by_user_id(sender_id:str,start_date:str=None,end_date:str=None):
    order_list = order_service.get_order_by_user_id(sender_id,start_date,end_date)
    if order_list is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return order_list

@router.get("/get_order_by_delivery_date/", response_model=List[Order])
def get_order_by_delivery_date(start_date:str=None,end_date:str=None):
    order_list = order_service.get_order_by_delivery_date(start_date,end_date)
    if order_list is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return order_list

@router.delete("/delete_order/", response_model=bool)
def delete_order(order_id: str):
    status = order_service.delete_order(order_id)
    if not status:
        raise HTTPException(status_code=404, detail="Order not found")
    return status