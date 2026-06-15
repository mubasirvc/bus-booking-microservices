# 🚌 BusBooking

A production-inspired microservices-based bus booking backend built with Node.js, TypeScript, RabbitMQ, Redis, gRPC, and Docker.

> Built as a learning project, portfolio project, and interview showcase to demonstrate modern backend architecture and distributed systems concepts.

---

# 🚀 Features

## Authentication

* User Registration
* Email Verification
* JWT Authentication
* Refresh Tokens
* Role-Based Access Control (RBAC)
* Internal Service Authentication

## Booking

* Create Booking
* Cancel Booking
* Booking Confirmation
* Seat Reservation
* Seat Release
* Booking Expiration Handling

## Payments

* Razorpay Integration
* Order Creation
* Payment Verification
* Webhook Processing

## Notifications

* Email Verification
* Booking Confirmation Emails
* Booking Cancellation Emails
* Event-Driven Notification Processing

## Platform

* API Gateway
* Microservices Architecture
* RabbitMQ Event Bus
* gRPC Communication
* Redis Caching
* Swagger Documentation
* Dockerized Development Environment
* Rate Limiting

---

# 🏗 Architecture

## Services

| Service              | Responsibility                                      |
| -------------------- | --------------------------------------------------- |
| Gateway Service      | API Gateway, Routing, Authentication, Rate Limiting |
| Auth Service         | Registration, Login, JWT, Email Verification        |
| User Service         | User Profiles, User Booking Projections             |
| Inventory Service    | Trips, Seats, Availability                          |
| Booking Service      | Booking Lifecycle Management                        |
| Payment Service      | Razorpay Integration                                |
| Notification Service | Email Notifications                                 |

---

# 📦 Monorepo Structure

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
├── docker-compose.yml
│
└── README.md
```

---

# 🔄 Communication

## Synchronous Communication

Services communicate using gRPC.

Example:

```text
Booking Service
      │
      ▼
Inventory Service
```

Used for:

* Reserve Seats
* Release Seats
* Trip Details Lookup

---

## Asynchronous Communication

Services communicate using RabbitMQ.

```text
Publisher
    │
    ▼
Exchange
    │
    ▼
Queue
    │
    ▼
Consumer
```

Benefits:

* Loose Coupling
* Scalability
* Reliability
* Event-Driven Design

---

# 📨 RabbitMQ Events

## Authentication Events

### auth.user.registered

Published by:

* Auth Service

Consumed by:

* User Service
* Notification Service

---

## Booking Events

### booking.created

Published by:

* Booking Service

Consumed by:

* User Service

---

### booking.confirmed

Published by:

* Booking Service

Consumed by:

* User Service
* Notification Service

---

### booking.cancelled

Published by:

* Booking Service

Consumed by:

* User Service
* Notification Service

---

# 🎫 Booking Flow

```text
User Selects Trip
        │
        ▼
Create Booking
(Status = PENDING)
        │
        ▼
Reserve Seats
        │
        ▼
Create Razorpay Order
        │
        ▼
Payment Success
        │
        ▼
Booking Confirmed
        │
        ▼
Confirmation Email Sent
```

---

# ⏰ Booking Expiration Flow

```text
Booking Created
       │
       ▼
Redis Expiry Key Created
       │
       ▼
Timer Expires
       │
       ▼
Booking Cancelled
       │
       ▼
Seats Released
       │
       ▼
Cancellation Email Sent
```

---

# ⚡ Redis Usage

Used for:

* Rate Limiting
* Booking Expiration
* Temporary Seat Reservation
* Caching

Example:

```text
booking:{bookingId}
```

When the key expires:

```text
Redis
   ▼
Booking Service Listener
   ▼
Cancel Booking
   ▼
Release Seats
```

---

# 🔐 Security

## JWT

* Access Token
* Refresh Token

## Roles

```text
ADMIN
OPERATOR
USER
```

## Rate Limiting

Implemented using:

* express-rate-limit
* Redis Store

Protection against:

* Login Abuse
* Brute Force Attacks
* API Abuse

---

# 💳 Payment Integration

Razorpay

Features:

* Order Creation
* Payment Verification
* Webhooks
* Booking Synchronization

---

# 📧 Email Provider

Resend

Used for:

* Verification Emails
* Booking Confirmation Emails
* Booking Cancellation Emails

---

# 📚 API Documentation

Swagger UI:

```text
http://localhost:4000/docs
```

---

# 🛠 Tech Stack

## Backend

* Node.js
* TypeScript
* Express

## Databases

* PostgreSQL
* MySQL
* MongoDB

## Messaging

* RabbitMQ

## Cache

* Redis

## Service Communication

* gRPC

## Authentication

* JWT

## Email

* Resend

## Payments

* Razorpay

## Documentation

* Swagger / OpenAPI

## Containerization

* Docker

## Package Manager

* pnpm

---

# 🐳 Running Locally

Install dependencies:

```bash
pnpm install
```

Start infrastructure:

```bash
docker-compose up -d
```

Start all services:

```bash
pnpm dev
```

---

# 🚧 Future Improvements

* Password Reset
* SMS Notifications
* CI/CD Pipeline
* Distributed Tracing
* Centralized Logging
* Kubernetes Deployment
* Monitoring & Metrics
* Saga Pattern

---

# 👨‍💻 Author

Built to explore modern backend engineering concepts including:

* Microservices
* Event-Driven Architecture
* Distributed Systems
* gRPC
* RabbitMQ
* Redis
* Docker
* Payment Integrations
* Production-Oriented Backend Design


## Architecture Diagram

![Architecture](docs/architecture.png)

## Booking Flow

![Booking Flow](docs/booking-flow.png)

## RabbitMQ Event Flow

![Event Flow](docs/event-flow.png)