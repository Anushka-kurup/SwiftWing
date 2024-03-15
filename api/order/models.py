from pydantic import BaseModel
from typing import List
from datetime import datetime

class Order(BaseModel):
    order_id: str
    pickup_location: str
    destination: str
    package_dimension: List[float]
    package_weight: float
    time_constraint: datetime
    special_handling_instruction: str
    latitude: float
    longitude: float
