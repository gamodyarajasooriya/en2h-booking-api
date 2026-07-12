# EN2H Booking Platform API 📅

## 1. Project Overview
This repository contains a RESTful API built with **NestJS**, **TypeScript**, and **Prisma ORM** using a **PostgreSQL** database. The system handles business service catalogs and customer appointment scheduling. It features incoming payload validation, centralized error handling, JWT-based authentication (with separate access and refresh token flows), pagination, status filtering, and case-insensitive customer search.

### System Architecture Flow
```mermaid
graph TD
    Client[HTTP Client / Swagger / Postman] --> NestJS[NestJS API Gateway]
    NestJS --> Validation[Validation Pipe]
    Validation --> Modules[Core Modules: Auth, Services, Bookings]
    Modules --> Prisma[Prisma ORM]
    Prisma --> Postgres[(PostgreSQL Database)]
```

## 2. Prerequisites & Installation
* **Node.js**: v18 or higher (Required for Prisma 7 compatibility)
* **PostgreSQL**: Active local or remote instance

```bash
# Clone the repository
git clone <your-repository-url>

# Navigate into the project folder
cd en2h-booking-api

# Install dependencies
npm install
```

## 3. Environment Variables
Create a `.env` file in the root directory and add the following keys:

| Variable Name | Description | Example / Default Value |
| --- | --- | --- |
| PORT | The port your local server will run on | 3000 |
| DATABASE_URL | PostgreSQL connection string | postgresql://postgres:postgres@localhost:5432/en2h_booking_db?schema=public |
| JWT_SECRET | Secret key used to sign access tokens | your-secure-access-secret-key |
| JWT_REFRESH_SECRET | Separate secret key used to sign refresh tokens | your-secure-refresh-secret-key |
| JWT_EXPIRES_IN | Lifespan of the access token | 15m |

## 4. Database Setup & Migrations
Ensure your PostgreSQL database is running, then execute the following setup commands:
```bash
# Generate the Prisma Client
npx prisma generate

# Run database migrations to create tables
npx prisma migrate dev --name init

# Seed the database with sample service data
npx prisma db seed
```

## 5. Running the Application
### Local Development Mode
To start the application locally with hot-reloading:
```bash
npm run start:dev
```

### Docker Mode (Alternative)
If you prefer running the app inside a containerized environment (API + bundled PostgreSQL):
```bash
docker-compose up --build
```

## 6. Running Tests
Automated unit and E2E integration tests have been written using Jest to verify business rules and endpoint logic. To run the test suites:
```bash
# Run unit tests
npm run test

# Run End-to-end integration tests
npm run test:e2e
```

## 7. API Documentation
* **Live Deployed API (Swagger UI):** https://en2h-booking-api-yxwe.onrender.com/api/docs
* **Interactive Local Swagger UI:** Available at `http://localhost:3000/api/docs` while the server is running.
* **Postman Collection:** A pre-configured `en2h_booking_api_collection.json` file is available at the root of the project. You can import this directly into Postman for rapid manual testing.
* **Query Parameters & Search Filters:**
  * `GET /bookings` supports `?search=` (case-insensitive customer name/email search), `?status=` filtering, and `?page=` / `?limit=` pagination.
  * `GET /services` supports `?page=` / `?limit=` pagination.

## 8. Assumptions Made
* **Access Control Model**: The assessment specification did not request distinct user roles (such as separating admin users from standard staff). Therefore, a uniform authorization approach was taken: any authenticated user with a valid JWT has permissions to manage services and view/update booking data. Booking creation (`POST /bookings`) is left fully public so customers can book appointments without signing up.
* **Scoring Grid Point Discrepancy**: The evaluation criteria breakdown in the assessment brief sums up to 110 total marks instead of the stated 100-point maximum. To ensure complete alignment, all listed bonus requirements (Docker setup, global exception filtering, and unit tests) were implemented for total feature coverage.

## 9. Screenshots (System Preview)

### API Documentation & Swagger Overview
![Swagger Overview](./screenshots/swagger-overview.jpeg)

### Advanced Pagination & Metadata Shape
![Paginated Response](./screenshots/paginated-response.jpeg)

### Strict Business Rule Enforcement (Validation Error)
![Business Rule Error](./screenshots/business-rule-error.jpeg)

## 10. Future Improvements
* **Role-Based Access Control (RBAC)**: Introduce Admin and Staff roles to limit service catalog modifications strictly to managers.
* **Automated Notifications**: Integrate a mailer service (e.g., Nodemailer or SendGrid) to send automated email confirmations to customers when their booking status changes.
* **Caching Layer**: Add Redis caching to the public `GET /services` catalog endpoint to reduce direct query loads on the PostgreSQL database.
