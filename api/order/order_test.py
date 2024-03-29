import pytest
from fastapi.testclient import TestClient
import json
from unittest.mock import patch
from freezegun import freeze_time
import os
import sys
from order.routes import router
from order.models import Order,OrderCreationResponse,DeliveryTimeUpdate,DeliveryTimeStampUpdate

@pytest.fixture
def client():
    return TestClient(router)

def test_create_order_endpoint(client):
    # Test your create_order endpoint
    order_data = {
        "sender_id":"test_id",
        "order_id":"test",
        "warehouse": "Ang Mo Kio",
        "destination": "Yishun",
        "package_dimension": {"s":"4","m":"3","l":"2","pallet":"1"},
        "special_handling_instruction": "NIL",
        "package_weight":100.0,
        "latitude":100.0,
        "longitude":100.0,
        "recipient":{
            "recipeint_name":"Tom Tan",
            "phone_no":"12345678"
        },
        "created_date": "2024-04-21T13:55:55.113Z",
        "delivery_date": "2024-04-25T00:00:00.113Z",
        "delivery_timestamp": "2024-04-25T13:55:55.113Z"
    }  # Define sample order data
    response = client.post("/create_order/", json=order_data)
    
    assert response.status_code == 200  # Example assertion, adjust as needed
    assert response.json()["status"] == True  # Example assertion, adjust as needed
    # Add more assertions as needed
