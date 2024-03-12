from pydantic import BaseModel
from typing import List

class Order(BaseModel):
    order_id: str
    pickup_location: str
    destination: str
    package_dimension: List[str]
    special_handling_instruction: str
