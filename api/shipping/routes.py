from fastapi import APIRouter, Depends, HTTPException
from .services import ShippingService
from .models import Shipping
from auth.routes import verify_operator
from order.services import OrderService
from typing import List

router = APIRouter()

order_service = OrderService()
shipping_service = ShippingService(order_service)

@router.post("/create_shipping/", response_model=bool)
def create_shipping(shipping: Shipping):
    return shipping_service.create_shipping(shipping)

@router.post("/update_shipping_status/", response_model=bool)
def update_shipping_status(shipping: Shipping):
    return shipping_service.update_shipping_status(shipping)

@router.post("/update_shipping_driver/", response_model=bool)
def update_shipping_driver(shipping: Shipping):
    return shipping_service.update_shipping_driver(shipping)

@router.post("/update_shipping_status_and_driver/", response_model=bool)
def update_shipping_status_and_driver(shipping: Shipping):
    return shipping_service.update_shipping_status_and_driver(shipping)

@router.get("/view_shipping/", response_model=Shipping)
def get_shipping(shipping_id: str):
    return shipping_service.get_shipping(shipping_id)

@router.get("/get_all_shipping/", response_model=List[Shipping])
def get_all_shipping():
    shipping_list = shipping_service.get_all_shipping()
    if shipping_list is None:
        raise HTTPException(status_code=404, detail="Shipping not found")
    return shipping_list