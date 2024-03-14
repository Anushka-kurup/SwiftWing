from fastapi import APIRouter, Depends, HTTPException
from .models import Order
from .services import OrderService
from typing import List

router = APIRouter()
order_service = OrderService()

@router.post("/create_order/", response_model=bool)
def create_order(order: Order):
    return order_service.create_order(order)

@router.post("/update_order/", response_model=bool)
def update_order(order_id: str, order: Order):
    return order_service.update_order(order_id, order)

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

@router.delete("/delete_order/", response_model=bool)
def delete_order(order_id: str):
    status = order_service.delete_order(order_id)
    if not status:
        raise HTTPException(status_code=404, detail="Order not found")
    return status