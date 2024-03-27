from fastapi import APIRouter, Depends, HTTPException
from .models import Delivery
from .services import DeliveryService
from typing import List
from datetime import datetime

router = APIRouter()
delivery_service = DeliveryService()

@router.post("/create_delivery/", response_model=bool)
def create_delivery(delivery: Delivery):
    return delivery_service.create_delivery(delivery)

@router.get("/get_delivery/", response_model=Delivery)
def get_delivery(delivery_date: str):
    return delivery_service.get_delivery(delivery_date)

@router.get("/get_all_delivery/", response_model=List[Delivery])
def get_all_delivery():
    return delivery_service.get_all_delivery()

@router.put("/update_delivery/", response_model=bool)
def update_delivery( delivery: Delivery):
    return delivery_service.update_delivery(delivery)

@router.put("/add_delivery/", response_model=bool)
def add_delivery( delivery: Delivery):
    return delivery_service.add_delivery(delivery)

@router.put("/update_delivery_list/", response_model=bool)
def update_delivery_list( delivery: Delivery):
    return delivery_service.update_delivery_list(delivery)