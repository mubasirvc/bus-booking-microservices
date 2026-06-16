# Bus Booking API Access Matrix

## Role Definitions

### Public

Accessible without authentication.

### User

Authenticated passenger who can search trips, book seats, make payments, and manage their own bookings.

### Operator

Bus operator who manages buses and trips they own.

### Admin

System administrator with full platform access.

---

# Authentication

| Endpoint            | Public | User | Operator | Admin |
| ------------------- | ------ | ---- | -------- | ----- |
| POST /auth/register | ✅      | ✅    | ✅        | ✅     |
| POST /auth/login    | ✅      | ✅    | ✅        | ✅     |
| POST /auth/refresh  | ✅      | ✅    | ✅        | ✅     |
| POST /auth/revoke   | ❌      | ✅    | ✅        | ✅     |

---

# Routes

| Endpoint                 | Public | User | Operator | Admin |
| ------------------------ | ------ | ---- | -------- | ----- |
| GET /routes              | ✅      | ✅    | ✅        | ✅     |
| GET /routes/search       | ✅      | ✅    | ✅        | ✅     |
| GET /routes/sources      | ✅      | ✅    | ✅        | ✅     |
| GET /routes/destinations | ✅      | ✅    | ✅        | ✅     |
| GET /routes/source       | ✅      | ✅    | ✅        | ✅     |
| GET /routes/destination  | ✅      | ✅    | ✅        | ✅     |
| GET /routes/:id          | ✅      | ✅    | ✅        | ✅     |
| POST /routes             | ❌      | ❌    | ❌        | ✅     |
| PATCH /routes/:id        | ❌      | ❌    | ❌        | ✅     |
| DELETE /routes/:id       | ❌      | ❌    | ❌        | ✅     |

---

# Trips

| Endpoint                | Public | User | Operator | Admin |
| ----------------------- | ------ | ---- | -------- | ----- |
| GET /trips              | ✅      | ✅    | ✅        | ✅     |
| GET /trips/search       | ✅      | ✅    | ✅        | ✅     |
| GET /trips/:id          | ✅      | ✅    | ✅        | ✅     |
| POST /trips             | ❌      | ❌    | ✅*       | ✅     |
| PATCH /trips/:id        | ❌      | ❌    | ✅*       | ✅     |
| PATCH /trips/:id/cancel | ❌      | ❌    | ✅*       | ✅     |
| DELETE /trips/:id       | ❌      | ❌    | ❌        | ✅     |

---

# Buses

| Endpoint            | Public | User | Operator | Admin |
| ------------------- | ------ | ---- | -------- | ----- |
| GET /buses/:id      | ✅      | ✅    | ✅        | ✅     |
| GET /buses          | ❌      | ❌    | ✅        | ✅     |
| GET /buses/search   | ❌      | ❌    | ✅        | ✅     |
| GET /buses/my-buses | ❌      | ❌    | ✅        | ✅     |
| POST /buses         | ❌      | ❌    | ✅        | ✅     |
| PATCH /buses/:id    | ❌      | ❌    | ✅*       | ✅     |
| DELETE /buses/:id   | ❌      | ❌    | ❌        | ✅     |

---

# Bookings

| Endpoint                   | Public | User | Operator | Admin |
| -------------------------- | ------ | ---- | -------- | ----- |
| POST /bookings             | ❌      | ✅    | ❌        | ✅     |
| GET /bookings/:id          | ❌      | ✅**  | ✅***     | ✅     |
| PATCH /bookings/:id/cancel | ❌      | ✅**  | ❌        | ✅     |
| GET /bookings              | ❌      | ❌    | ❌        | ✅     |
| GET /bookings/search       | ❌      | ❌    | ❌        | ✅     |
| GET /bookings/user         | ❌      | ❌    | ❌        | ✅     |

---

# User Booking History

| Endpoint                          | Public | User | Operator | Admin |
| --------------------------------- | ------ | ---- | -------- | ----- |
| GET /users/my-bookings            | ❌      | ✅    | ❌        | ✅     |
| GET /users/my-bookings/:bookingId | ❌      | ✅    | ❌        | ✅     |

---

# Payments

| Endpoint                    | Public | User | Operator | Admin |
| --------------------------- | ------ | ---- | -------- | ----- |
| POST /payments/create-order | ❌      | ✅    | ❌        | ✅     |
| POST /payments/webhook      | ✅****  | ❌    | ❌        | ❌     |

---

# Users

| Endpoint          | Public | User | Operator | Admin |
| ----------------- | ------ | ---- | -------- | ----- |
| GET /users        | ❌      | ❌    | ❌        | ✅     |
| GET /users/search | ❌      | ❌    | ❌        | ✅     |
| GET /users/:id    | ❌      | ❌    | ❌        | ✅     |
| POST /users       | ❌      | ❌    | ❌        | ✅     |

---

# Internal Service APIs

These endpoints are not accessible by external clients.

Protected using:

* Internal Service Token
* Service Authentication
* gRPC Communication
* RabbitMQ Event Contracts

Examples:

* Inventory Service gRPC APIs
* Payment Service gRPC APIs
* User Service Internal APIs

---

# Resource Ownership Rules

## User

Users can:

* View only their own bookings.
* Cancel only their own bookings.
* View their own booking history.

## Operator

Operators can:

* Manage only buses they own.
* Manage only trips they created.
* View bookings belonging to their trips.

## Admin

Admins have unrestricted access to all resources.

---

# Security Notes

## Payment Webhook

The Razorpay webhook endpoint is publicly reachable but protected using:

* Razorpay Signature Verification
* Webhook Secret Validation

User authentication is not used for webhook requests.

## Internal APIs

Internal APIs are protected using service-to-service authentication and are never exposed through public client applications.

* Operator can access only resources they own.

** User must own the booking.

*** Operator can access bookings belonging to trips they operate.

**** Public endpoint protected through Razorpay webhook signature verification.
