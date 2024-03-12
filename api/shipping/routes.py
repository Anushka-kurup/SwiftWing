from fastapi import APIRouter, Depends
from .services import ShippingService
from .models import Shipping
from auth.routes import verify_operator
from order.services import OrderService


router = APIRouter()

order_service = OrderService()
shipping_service = ShippingService(order_service)

@router.post("/create_shipping/", response_model=bool)
def create_shipping(shipping: Shipping, operator_verified: bool = Depends(verify_operator)):
    return shipping_service.create_shipping(shipping, operator_verified)

@router.put("/update_shipping_status/", response_model=bool)
def update_shipping_status(shipping_id: str, status: str, operator_verified: bool = Depends(verify_operator)):
    return shipping_service.update_shipping_status(shipping_id, status, operator_verified)

@router.get("/view_shipping/", response_model=Shipping)
def view_shipping(shipping_id: str, operator_verified: bool = Depends(verify_operator)):
    return shipping_service.view_shipping(shipping_id, operator_verified)
