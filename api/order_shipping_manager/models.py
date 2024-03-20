from datetime import datetime
from pydantic import BaseModel
from typing import List, Any, Optional, Dict

class ShippingInfo(BaseModel):
    shipping_id: str
    sender_id: str
    warehouse: str
    destination: str
    package_dimension: List[float]
    package_weight: float
    special_handling_instruction: str
    latitude: float
    longitude: float
    recipient: Dict[str, Any]
    created_date: datetime
    delivery_date: Optional[datetime]
    delivery_timestamp: Optional[datetime]
    shipping_status: str
    driver_id:Optional[str]

class OrderID(BaseModel):
    order_id:str