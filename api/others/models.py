from datetime import datetime
from pydantic import BaseModel

class Route(BaseModel):
    coordinates: list[list]
    round_trip: bool
    coords_name: list[str]
    num_drivers: int
    pickups_deliveries: list[list]

    def to_dict(self):
        return {
            "coordinates": self.coordinates,
            "round_trip": self.round_trip,
            "coords_name": self.coords_name,
            "num_drivers": self.num_drivers,
            "pickups_deliveries": self.pickups_deliveries
        }

class RouteOutput(BaseModel):
    name: str
    route: list[str]

class Cluster(BaseModel):
    coordinates: list[list]
    num_drivers: int
    coords_names: list[str]

    def to_dict(self):      
        return {
            "coordinates": self.coordinates,
            "num_drivers": self.num_drivers,
            "coords_names": self.coords_names
        }

class ClusterOutput(BaseModel):
    cluster_name: str
    cluster: list[str]


    