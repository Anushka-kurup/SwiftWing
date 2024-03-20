from fastapi import APIRouter, Depends, HTTPException
from .services import OrderShippingService
from order.models import Order
from .models import ShippingInfo,OrderID
from auth.routes import verify_operator
from typing import List
from order.services import OrderService
from shipping.services import ShippingService

router = APIRouter()
order_service = OrderService()
shipping_service = ShippingService(order_service)
order_shipping_service = OrderShippingService(order_service,shipping_service)

@router.post("/create_order_shipping/", response_model=bool)
def create_order(order: Order):
    return order_shipping_service.create_order_service(order)

@router.post("/create_mass_order_shipping/", response_model=bool)
def create_mass_order_service(order_list: List[Order]):
    return order_shipping_service.create_mass_order_service(order_list)

@router.get("/get_order_shipping/", response_model=ShippingInfo)
def view_order(shipping_id: str):
    shipping_info = order_shipping_service.get_shipping_info(shipping_id)
    if shipping_info is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return shipping_info

@router.get("/get_all_shipping_info/", response_model=List[ShippingInfo])
def get_all_order_shipping():
    shipping_info_list = order_shipping_service.get_all_shipping_info()

    if shipping_info_list is None:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return shipping_info_list

@router.put("/complete_delivery/", response_model=bool)
def complete_delivery(order_id:OrderID):
    result_status = order_shipping_service.complete_delivery(order_id)
    
    return result_status
