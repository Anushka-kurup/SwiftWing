from fastapi import APIRouter, Depends, HTTPException, File
from .models import Order, OrderCreationResponse, DeliveryTimeUpdate, DeliveryTimeStampUpdate, S3DeliveryImageUpload
from .services import OrderService
from typing import List
from datetime import datetime
from fastapi import UploadFile, Form
import base64
import io

router = APIRouter()
order_service = OrderService()

@router.post("/create_order/", response_model=OrderCreationResponse)
def create_order(order: Order):
    return order_service.create_order(order)

@router.put("/update_order/", response_model=bool)
def update_order(order: Order):
    return order_service.update_order(order)

@router.put("/update_delivery_date/", response_model=bool)
def update_order(delivery_date_update: DeliveryTimeUpdate):
    return order_service.update_delivery_date(delivery_date_update)

@router.put("/update_delivery_timestamp/", response_model=bool)
def update_delivery_timestamp(delivery_timestamp_update: DeliveryTimeStampUpdate):
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
def get_order_by_user_id(sender_id: str, start_date: str = None, end_date: str = None):
    order_list = order_service.get_order_by_user_id(sender_id, start_date, end_date)
    if order_list is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return order_list

@router.get("/get_order_by_delivery_date/", response_model=List[Order])
def get_order_by_delivery_date(start_date: str = None, end_date: str = None):
    order_list = order_service.get_order_by_delivery_date(start_date, end_date)
    if order_list is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return order_list

@router.delete("/delete_order/", response_model=bool)
def delete_order(order_id: str):
    status = order_service.delete_order(order_id)
    if not status:
        raise HTTPException(status_code=404, detail="Order not found")
    return status

@router.post("/upload_to_s3/")
async def upload_to_s3(file: UploadFile = File(...), user_id: str = Form(None), shipping_id: str = Form(None),date: str = Form(None)):
    # base64_image = s3_delivery_image_upload.base64_image
    # user_id = s3_delivery_image_upload.user_id
    # shipping_id = s3_delivery_image_upload.shipping_id
    # date = s3_delivery_image_upload.date
    # print(user_id)

    file_name = str(user_id + "$" + shipping_id + "$" + date)
    # file = io.BytesIO(base64.b64decode(base64_image + "=="))
    # with open(file_name, "wb") as f:
    #     f.write(file.getvalue())
    # print(file_name)
    status = await order_service.upload_to_s3(file, file_name=file_name)
    if not status:
        raise HTTPException(status_code=404, detail="File Upload failed")
    return {"message": "File Upload successful", "file_name": file_name}

@router.get("/retrieve_S3_url/")
async def retrieve_S3_url(file_name: str):
    url = await order_service.retrieve_S3_url(file_name)
    if url is None:
        raise HTTPException(status_code=404, detail="File not found")
    return {"url": url}
