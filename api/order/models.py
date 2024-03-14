from pydantic import BaseModel
from typing import List
from datetime import datetime

class Order(BaseModel):
    order_id: str
    pickup_location: str
    destination: str
    package_dimension: List[str]
    package_weight: str
    time_constraint: datetime
    special_handling_instruction: str
