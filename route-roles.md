# Bus Booking System - Route Access Matrix

## Public Routes

### Authentication

| Method | Endpoint       | Access |
| ------ | -------------- | ------ |
| POST   | /auth/register | Public |
| POST   | /auth/login    | Public |
| POST   | /auth/refresh  | Public |

### Routes

| Method | Endpoint             | Access |
| ------ | -------------------- | ------ |
| GET    | /routes              | Public |
| GET    | /routes/search       | Public |
| GET    | /routes/sources      | Public |
| GET    | /routes/destinations | Public |
| GET    | /routes/source       | Public |
| GET    | /routes/destination  | Public |
| GET    | /routes/:id          | Public |

### Trips

| Method | Endpoint      | Access |
| ------ | ------------- | ------ |
| GET    | /trips        | Public |
| GET    | /trips/search | Public |
| GET    | /trips/:id    | Public |

### Buses

| Method | Endpoint   | Access |
| ------ | ---------- | ------ |
| GET    | /buses/:id | Public |

---

# USER Routes

## Bookings

| Method | Endpoint                      |
| ------ | ----------------------------- |
| POST   | /bookings                     |
| PATCH  | /bookings/:id/cancel          |
| GET    | /users/my-bookings            |
| GET    | /users/my-bookings/:bookingId |

## Payments

| Method | Endpoint               |
| ------ | ---------------------- |
| POST   | /payments/create-order |

---

# OPERATOR Routes

## Bus Management

| Method | Endpoint        |
| ------ | --------------- |
| GET    | /buses/my-buses |
| POST   | /buses          |
| PATCH  | /buses/:id      |

## Trip Management

| Method | Endpoint          |
| ------ | ----------------- |
| POST   | /trips            |
| PATCH  | /trips/:id        |
| PATCH  | /trips/:id/cancel |

---

# ADMIN Routes

## User Management

| Method | Endpoint      |
| ------ | ------------- |
| GET    | /users        |
| GET    | /users/search |
| GET    | /users/:id    |
| POST   | /users        |

## Route Management

| Method | Endpoint    |
| ------ | ----------- |
| POST   | /routes     |
| PATCH  | /routes/:id |
| DELETE | /routes/:id |

## Bus Management

| Method | Endpoint   |
| ------ | ---------- |
| DELETE | /buses/:id |

## Trip Management

| Method | Endpoint   |
| ------ | ---------- |
| DELETE | /trips/:id |

## Booking Administration

| Method | Endpoint         |
| ------ | ---------------- |
| GET    | /bookings        |
| GET    | /bookings/search |
| GET    | /bookings/:id    |
| GET    | /bookings/user   |

---

# Internal / Service-to-Service Routes

## Payment Webhook

| Method | Endpoint          | Protection             |
| ------ | ----------------- | ---------------------- |
| POST   | /payments/webhook | Signature Verification |

## Internal APIs

Protected using:

* X-Internal-Token
* Service Authentication
* Not accessible by clients

---

# Role Summary

## USER

* Search routes
* Search trips
* View bus details
* Create bookings
* Cancel own bookings
* Make payments
* View own bookings

## OPERATOR

* Everything USER can do
* Create buses
* Manage own buses
* Create trips
* Manage own trips

## ADMIN

* Full system access
* Manage users
* Manage routes
* Manage buses
* Manage trips
* View all bookings
* System administration



# Bus Booking API - Route Access Matrix

| Endpoint            | Public | User | Operator | Admin |
| ------------------- | :----: | :--: | :------: | :---: |
| POST /auth/register |    ✅   |   ✅  |     ✅    |   ✅   |
| POST /auth/login    |    ✅   |   ✅  |     ✅    |   ✅   |
| POST /auth/refresh  |    ✅   |   ✅  |     ✅    |   ✅   |
| POST /auth/revoke   |    ❌   |   ✅  |     ✅    |   ✅   |

## Routes

| Endpoint                 | Public | User | Operator | Admin |
| ------------------------ | :----: | :--: | :------: | :---: |
| GET /routes              |    ✅   |   ✅  |     ✅    |   ✅   |
| GET /routes/search       |    ✅   |   ✅  |     ✅    |   ✅   |
| GET /routes/sources      |    ✅   |   ✅  |     ✅    |   ✅   |
| GET /routes/destinations |    ✅   |   ✅  |     ✅    |   ✅   |
| GET /routes/source       |    ✅   |   ✅  |     ✅    |   ✅   |
| GET /routes/destination  |    ✅   |   ✅  |     ✅    |   ✅   |
| GET /routes/:id          |    ✅   |   ✅  |     ✅    |   ✅   |
| POST /routes             |    ❌   |   ❌  |     ❌    |   ✅   |
| PATCH /routes/:id        |    ❌   |   ❌  |     ❌    |   ✅   |
| DELETE /routes/:id       |    ❌   |   ❌  |     ❌    |   ✅   |

## Trips

| Endpoint                | Public | User | Operator | Admin |
| ----------------------- | :----: | :--: | :------: | :---: |
| GET /trips              |    ✅   |   ✅  |     ✅    |   ✅   |
| GET /trips/search       |    ✅   |   ✅  |     ✅    |   ✅   |
| GET /trips/:id          |    ✅   |   ✅  |     ✅    |   ✅   |
| POST /trips             |    ❌   |   ❌  |     ✅    |   ✅   |
| PATCH /trips/:id        |    ❌   |   ❌  |    ✅*    |   ✅   |
| PATCH /trips/:id/cancel |    ❌   |   ❌  |    ✅*    |   ✅   |
| DELETE /trips/:id       |    ❌   |   ❌  |     ❌    |   ✅   |

## Buses

| Endpoint            | Public | User | Operator | Admin |
| ------------------- | :----: | :--: | :------: | :---: |
| GET /buses          |    ❌   |   ✅  |     ✅    |   ✅   |
| GET /buses/search   |    ❌   |   ✅  |     ✅    |   ✅   |
| GET /buses/my-buses |    ❌   |   ❌  |     ✅    |   ✅   |
| GET /buses/:id      |    ✅   |   ✅  |     ✅    |   ✅   |
| POST /buses         |    ❌   |   ❌  |     ✅    |   ✅   |
| PATCH /buses/:id    |    ❌   |   ❌  |    ✅*    |   ✅   |
| DELETE /buses/:id   |    ❌   |   ❌  |     ❌    |   ✅   |

## Bookings

| Endpoint                   | Public | User | Operator | Admin |
| -------------------------- | :----: | :--: | :------: | :---: |
| GET /bookings              |    ❌   |   ❌  |     ❌    |   ✅   |
| GET /bookings/search       |    ❌   |   ❌  |     ✅    |   ✅   |
| GET /bookings/user         |    ❌   |   ❌  |     ❌    |   ✅   |
| GET /bookings/:id          |    ❌   |  ✅** |    ✅**   |   ✅   |
| POST /bookings             |    ❌   |   ✅  |     ❌    |   ✅   |
| PATCH /bookings/:id/cancel |    ❌   |  ✅** |     ❌    |   ✅   |

## Payments

| Endpoint                    | Public | User | Operator | Admin |
| --------------------------- | :----: | :--: | :------: | :---: |
| POST /payments/create-order |    ❌   |   ✅  |     ❌    |   ✅   |
| POST /payments/webhook      |  ✅***  |   ❌  |     ❌    |   ❌   |

## Users

| Endpoint                          | Public | User | Operator | Admin |
| --------------------------------- | :----: | :--: | :------: | :---: |
| GET /users                        |    ❌   |   ❌  |     ❌    |   ✅   |
| GET /users/search                 |    ❌   |   ❌  |     ❌    |   ✅   |
| GET /users/:id                    |    ❌   |   ❌  |     ❌    |   ✅   |
| POST /users                       |    ❌   |   ❌  |     ❌    |   ✅   |
| GET /users/my-bookings            |    ❌   |   ✅  |     ❌    |   ✅   |
| GET /users/my-bookings/:bookingId |    ❌   |   ✅  |     ❌    |   ✅   |

---

## Notes

### ✅*

Operator can access only resources they own.

Examples:

* Own buses
* Own trips

### ✅**

Requires ownership verification.

Examples:

* User can only view/cancel their own booking.
* Operator can only view bookings belonging to trips operated by them.

### ✅***

Public endpoint but protected using:

* Razorpay signature verification
* Internal token validation (optional)
* Never protected using user roles
