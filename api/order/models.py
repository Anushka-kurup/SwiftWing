from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

class Order(BaseModel):
    sender_id: str
    order_id: str
    warehouse: str
    destination: str
    package_dimension: Dict[str, Any]
    package_weight: float
    special_handling_instruction: str
    latitude: float
    longitude: float
    recipient: Dict[str, Any]
    created_date: datetime
    delivery_date: Optional[datetime]
    delivery_timestamp: Optional[datetime]

class OrderCreationResponse(BaseModel):
    status: bool
    order_id: Optional[str]

class DeliveryTimeUpdate(BaseModel):
    order_id:str
    delivery_date:datetime

class DeliveryTimeStampUpdate(BaseModel):
    order_id:str
    delivery_timestamp:datetime

class S3DeliveryImageUpload(BaseModel):
    base64_image: str
    user_id: str
    shipping_id: str
    date: str