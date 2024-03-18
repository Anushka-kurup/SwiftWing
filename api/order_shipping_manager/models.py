from datetime import datetime
from pydantic import BaseModel
from typing import List

class ShippingInfo(BaseModel):
    shipping_id: str
    pickup_location: str
    destination: str
    package_dimension: List[float]
    package_weight: float
    time_constraint: datetime
    special_handling_instruction: str
    latitude: float
    longitude: float
    status: str
    operator_id: str
