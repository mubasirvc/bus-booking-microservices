# 🚌 Bus Booking System

A production-inspired microservices-based Bus Booking Platform built with Node.js, TypeScript, Docker, RabbitMQ, Redis, gRPC, and multiple databases.

This project was built as a learning project, portfolio project, and interview showcase to explore real-world backend architecture patterns including microservices, event-driven communication, distributed transactions, role-based access control, caching, asynchronous messaging, and containerized deployments.

---

# 🚀 Features

## Authentication & Authorization

* JWT Access Tokens
* JWT Refresh Tokens
* Email Verification
* Role-Based Access Control (RBAC)
* USER role
* OPERATOR role
* ADMIN role

---

## Booking Management

* Seat reservation
* Temporary seat locking
* Booking creation
* Booking confirmation
* Booking cancellation
* Automatic booking expiration
* Seat release on expiration

---

## Payment Integration

* Razorpay payment gateway
* Payment order creation
* Webhook verification
* Payment status tracking
* Automatic booking confirmation after successful payment

---

## Event-Driven Architecture

RabbitMQ is used for asynchronous communication between services.

Current events:

### Auth Events

* auth.user.registered

### Booking Events

* booking.created
* booking.confirmed
* booking.cancelled

---

## Notification System

* Email notifications
* Booking confirmation emails
* Booking cancellation emails
* Event-driven processing

---

## Inventory Management

* Seat reservation
* Seat release
* Redis-based temporary locks
* Automatic expiration handling

---

## API Documentation

Swagger/OpenAPI documentation available.

```text
http://localhost:4000/api-docs
```

---

# 🏗️ Architecture

## Services

### API Gateway

Responsibilities:

* Request routing
* Authentication middleware
* Rate limiting
* API aggregation
* Swagger documentation

---

### Auth Service

Responsibilities:

* Registration
* Login
* Refresh tokens
* Email verification
* JWT management

Database:

* MySQL

---

### User Service

Responsibilities:

* User profiles
* User management
* User search

Database:

* MongoDB

---

### Inventory Service

Responsibilities:

* Routes
* Buses
* Trips
* Seat inventory
* Seat reservation

Database:

* PostgreSQL

---

### Booking Service

Responsibilities:

* Booking lifecycle
* Booking validation
* Booking expiration
* Booking status management

Database:

* PostgreSQL

---

### Payment Service

Responsibilities:

* Razorpay integration
* Payment orders
* Payment verification
* Webhook handling

Database:

* PostgreSQL

---

### Notification Service

Responsibilities:

* Email delivery
* Event consumption
* Notification processing

External Provider:

* Resend

---

# 🧩 Technology Stack

## Backend

* Node.js
* TypeScript
* Express

## Databases

* MySQL
* PostgreSQL
* MongoDB

## Caching

* Redis

## Messaging

* RabbitMQ

## RPC Communication

* gRPC

## Authentication

* JWT

## Documentation

* Swagger / OpenAPI

## Email

* Resend

## Payments

* Razorpay

## Containerization

* Docker
* Docker Compose

## Package Management

* pnpm

---

# 📂 Monorepo Structure

```text
bus-booking/
│
├── services/
│   ├── gateway-service/
│   ├── auth-service/
│   ├── user-service/
│   ├── inventory-service/
│   ├── booking-service/
│   ├── payment-service/
│   └── notification-service/
│
├── packages/
│   └── common/
│
├── docs/
│
├── docker-compose.yml
│
└── pnpm-workspace.yaml
```

---

# 🔄 Booking Flow

```text
User
 │
 ▼
Search Trip
 │
 ▼
Create Booking
 │
 ▼
Reserve Seats
 │
 ▼
Booking Status = PENDING
 │
 ▼
Create Payment Order
 │
 ▼
Pay via Razorpay
 │
 ▼
Webhook Received
 │
 ▼
Booking Confirmed
 │
 ▼
Notification Sent
```

---

# ⏳ Booking Expiration Flow

```text
Booking Created
      │
      ▼
Seat Reserved
      │
      ▼
Redis Expiration Timer
      │
      ▼
Payment Not Completed
      │
      ▼
Booking Cancelled
      │
      ▼
Seats Released
```

---

# 📨 Event Flow

```text
Auth Service
      │
      ▼
auth.user.registered
      │
      ▼
RabbitMQ
      │
      ▼
Notification Service
```

```text
Booking Service
      │
      ▼
booking.confirmed
      │
      ▼
RabbitMQ
      │
      ▼
Notification Service
```

---

# 🔐 Roles

## USER

Can:

* Search routes
* Search trips
* View bus details
* Create bookings
* Cancel own bookings
* View own bookings
* Make payments

---

## OPERATOR

Can:

* Create buses
* Manage own buses
* Create trips
* Manage own trips

---

## ADMIN

Can:

* Manage users
* Manage routes
* Manage buses
* Manage trips
* View all bookings
* System administration

---

# 🛠️ Local Development Setup

## Prerequisites

Install:

* Node.js 22+
* pnpm
* Docker Desktop

---

## Clone Repository

```bash
git clone <repository-url>

cd bus-booking
```

---

## Install Dependencies

```bash
pnpm install
```

---

## Configure Environment Variables

Create service-specific environment files:

```text
services/auth-service/.env
services/user-service/.env
services/inventory-service/.env
services/booking-service/.env
services/payment-service/.env
services/notification-service/.env
services/gateway-service/.env
```

Use the provided `.env.example` files as reference.

---

## Start Infrastructure

```bash
docker compose up -d
```

This starts:

* RabbitMQ
* Redis
* MySQL
* MongoDB
* PostgreSQL instances

---

## Run Services

```bash
pnpm dev
```

---

# 🐳 Docker Deployment

## Build Containers

```bash
docker compose build
```

---

## Start Containers

```bash
docker compose up -d
```

---

## View Running Containers

```bash
docker ps
```

---

## View Logs

```bash
docker compose logs -f
```

---

## Stop Containers

```bash
docker compose down
```

---

## Remove Containers and Volumes

```bash
docker compose down -v
```

---

# 🌐 Service Ports

| Service              | Port |
| -------------------- | ---- |
| Gateway Service      | 4000 |
| Auth Service         | 4001 |
| User Service         | 4002 |
| Inventory Service    | 4003 |
| Booking Service      | 4004 |
| Payment Service      | 4005 |
| Notification Service | 4006 |

---

# 🐇 RabbitMQ

Management Dashboard:

```text
http://localhost:15672
```

Default credentials:

```text
Username: guest
Password: guest
```

---

# 📖 API Documentation

Swagger:

```text
http://localhost:4000/docs
```

---

# 🧪 Development Scripts

Install dependencies:

```bash
pnpm install
```

Build:

```bash
pnpm build
```

Run development environment:

```bash
pnpm dev
```

Lint:

```bash
pnpm lint
```

Type check:

```bash
pnpm typecheck
```

Run tests:

```bash
pnpm test
```

---

# 🔒 Security Features

* JWT Authentication
* Refresh Token Rotation
* Role-Based Access Control
* Internal Service Authentication
* Razorpay Signature Verification
* Input Validation
* Rate Limiting
* Helmet Security Headers

---

# 🚧 Future Improvements

* Password Reset Flow
* Kubernetes Deployment
* Distributed Tracing
* Metrics & Monitoring
* Prometheus Integration
* Grafana Dashboards
* Centralized Logging
* CI/CD Deployment Pipeline
* Frontend Application

---

# 👨‍💻 Author

Built as a backend engineering learning project focused on microservices architecture, event-driven systems, distributed communication, and scalable application design.
