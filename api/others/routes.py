from fastapi import APIRouter, Depends
from .services import RouteService, ClusterService, SnsService
from .models import Route, Cluster, SnsMessage
from auth.routes import verify_operator
from order.services import OrderService
from fastapi import HTTPException
from typing import List, Dict


router = APIRouter()
route_service = RouteService()


@router.post("/optimizeroute", response_model=List[List[str]])
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

@router.post("/sendEmail", response_model=str)
def get_message(sns_message: SnsMessage):
    # Check operator verification
    if not verify_operator:
        raise HTTPException(status_code=401, detail="Operator verification failed")
    try:
        email = str(sns_message.email)
        message = sns_message.message
        sns_service = SnsService()
        topic_arn = sns_service.create_topic('email_topic')
        sns_service.subscribe_email(topic_arn, email)
        response = sns_service.publish_to_topic(topic_arn, message)
        print(f"Message sent: {response}")
        return f"Message sent: {response}"
    except Exception as e:
        print(f"Error sending message: {e}")
        return "Error sending message"