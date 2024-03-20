from datetime import datetime
from pydantic import BaseModel

class Shipping(BaseModel):
    shipping_id: str
    shipping_status: str
