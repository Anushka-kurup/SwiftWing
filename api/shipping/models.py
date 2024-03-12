from datetime import datetime
from pydantic import BaseModel

class Shipping(BaseModel):
    shipping_id: str
    status: str
    estimated_delivery_time: datetime
