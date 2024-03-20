from fastapi import APIRouter, Depends
from .services import RouteService, ClusterService
from .models import Route, RouteOutput, Cluster, ClusterOutput
from auth.routes import verify_operator
from order.services import OrderService
from fastapi import HTTPException
from typing import List, Dict


router = APIRouter()
route_service = RouteService()


@router.post("/optimizeroute", response_model=List[RouteOutput])
def get_optimized_route(route: Route):
    # Check operator verification
    if not verify_operator:
        raise HTTPException(status_code=401, detail="Operator verification failed")
    try:
        optimizer = RouteService()
        print('route.to_dict(): ', route.to_dict())
        return optimizer.optimize(route.to_dict())
    except Exception as e:
        print(f"Error getting optimized route: {e}")
        return "Error getting optimized route"

@router.post("/cluster", response_model=List[List[str]])
def get_cluster(cluster: Cluster):
    # Check operator verification
    if not verify_operator:
        raise HTTPException(status_code=401, detail="Operator verification failed")
    try:
        clustering = ClusterService()
        return clustering.create_clusters(cluster.to_dict())
    except Exception as e:
        print(f"Error getting cluster: {e}")
        return "Error getting cluster"