from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from user import verify_operator
from pydantic import BaseModel

router = APIRouter()

class Shipping(BaseModel):
    shipping_id: str
    status: str
    estimated_delivery_time: datetime

shipping_db = {}

@router.post("/create_shipping/", response_model=bool)
def create_shipping(
    shipping: Shipping,
    operator_verified: bool = Depends(verify_operator)
):
    if not operator_verified:
        raise HTTPException(status_code=401, detail="Operator verification failed")

    shipping_db[shipping.shipping_id] = shipping
    return True

@router.put("/update_shipping_status/", response_model=bool)
def update_shipping_status(
    shipping_id: str,
    status: str,
    operator_verified: bool = Depends(verify_operator)
):
    if not operator_verified:
        raise HTTPException(status_code=401, detail="Operator verification failed")

    if shipping_id not in shipping_db:
        raise HTTPException(status_code=404, detail="Shipping ID not found")

    shipping_db[shipping_id].status = status
    return True

@router.get("/view_shipping/", response_model=Shipping)
def view_shipping(
    shipping_id: str,
    operator_verified: bool = Depends(verify_operator)
):
    if not operator_verified:
        raise HTTPException(status_code=401, detail="Operator verification failed")

    if shipping_id not in shipping_db:
        raise HTTPException(status_code=404, detail="Shipping ID not found")

    return shipping_db[shipping_id]
