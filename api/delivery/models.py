from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import date

class Delivery(BaseModel):
    delivery_date: date
    delivery_map: Dict[str, List[str]]
