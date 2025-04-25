## SwiftWing- Logistics Tracking System

---

## 🚚 Overview

SwiftWing is a logistics startup in Singapore facing issues with scalability, delivery delays, and Proof-of-Delivery (POD) upload failures on its existing on-premise infrastructure. This project modernizes SwiftWing's architecture using AWS to improve availability, scalability, and fault tolerance.

---

## ✨ Key Features

- 📦 **Order Management**: End-to-end delivery order tracking  
- 📍 **Route Optimization**: KMeans clustering + OR-Tools optimization  
- 🧾 **POD Upload**: Drivers can upload delivery images (stored in S3)  
- 📧 **Notifications**: Automatic email updates via AWS SNS  
- 🛡️ **Security**: IAM, API Gateway, Security Groups, HTTPS  
- 📊 **Monitoring**: AWS CloudWatch integration  
- ☁️ **Cloud-Native Stack**: ECS Fargate, DynamoDB, S3, SNS, Route 53, etc.

---

## 🐳 Local Setup (Docker)

Make sure Docker is installed and running on your machine.

### 1. Clone the repository

```bash
git clone https://github.com/Anushka-kurup/SwiftWing.git
cd SwiftWing
```

### 2. Build and run containers

```bash
docker-compose up --build
```

This will start both the frontend and backend services:

- Frontend (React): `http://localhost:3000`
- Backend (FastAPI): `http://localhost:8000`

### 3. Access API Documentation

- Swagger UI: `http://localhost:8000/docs`

### 4. Stopping the app

To stop the containers:

```bash
docker-compose down
```

---

## ☁️ AWS Cloud Architecture (Currently Offline)

SwiftWing was deployed on AWS using the following architecture:

- **Compute**: ECS Fargate (Auto-scaling, containerized app)
- **Storage**: S3 for POD uploads, DynamoDB for orders
- **Networking**: VPC, Internet Gateway, NAT, Route 53 (DNS)
- **API Access**: API Gateway, Load Balancer (ALB)
- **Security**: IAM roles, Security Groups, HTTPS via ACM
- **Monitoring & Notifications**: CloudWatch + SNS (Email alerts)

> ❌ Deployment has been temporarily disabled to manage cloud costs.  

### Architecture Diagram

<h3>Architecture Diagram</h3>
<img src="UI-devias/public/assets/cme_cloud_soln-cloud%20solution.jpg" alt="Cloud Architecture Diagram" width="942" />


