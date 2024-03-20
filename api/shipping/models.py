from datetime import datetime
from pydantic import BaseModel
from typing import Optional
class Shipping(BaseModel):
    shipping_id: str
    shipping_status: str
    driver_id:Optional[str]
