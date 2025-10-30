# Stocks Backend - Application Flow Documentation
The documentation includes 8 major flowcharts covering:

  1. Overall Application Architecture

  - Complete system overview from client to database
  - Shows all layers: Application, Domain, and Infrastructure

  2. Authentication Flow (3 detailed flows)

  - User Registration Flow
  - User Login Flow
  - Token Refresh Flow

  3. User Management Flow

  - CRUD operations with JWT authentication
  - Complete request pipeline

  4. Stock Management Flow

  - All stock endpoints
  - Advanced queries (search, filter by market/sector)
  - Database schema

  5. Currency Management Flow

  - Currency CRUD operations
  - Exchange rate management
  - Base currency filtering

  6. Request/Response Pipeline

  - Complete middleware chain
  - Interceptors and filters
  - Success and error paths

  7. Error Handling Flow

  - Exception handling pipeline
  - Error formatting
  - Logging mechanism

  8. Database Architecture

  - Entity Relationship Diagram
  - Database connection flow
  - Table schemas

===============================================
## Table of Contents
1. [Overall Application Architecture](#overall-application-architecture)
2. [Authentication Flow](#authentication-flow)
3. [User Management Flow](#user-management-flow)
4. [Stock Management Flow](#stock-management-flow)
5. [Currency Management Flow](#currency-management-flow)
6. [Request/Response Pipeline](#requestresponse-pipeline)
7. [Error Handling Flow](#error-handling-flow)
8. [Database Architecture](#database-architecture)

---

## Overall Application Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Application                       │
│                    (Web/Mobile/API Consumer)                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP/HTTPS Requests
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         NestJS Server                            │
│                      (Port 3000 - API v1)                        │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │               Global Middleware Layer                       │ │
│  │  • CORS                                                     │ │
│  │  • Validation Pipe (whitelist, transform)                  │ │
│  │  • Logging Interceptor                                     │ │
│  │  • Response Interceptor                                    │ │
│  │  • Exception Filter                                        │ │
│  └────────────────────────────────────────────────────────────┘ │
│                             │                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    Application Layer                        │ │
│  │                                                              │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │ │
│  │  │    Auth      │  │    Users     │  │   Stocks     │     │ │
│  │  │  Controller  │  │  Controller  │  │  Controller  │     │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘     │ │
│  │                                                              │ │
│  │  ┌──────────────┐                                           │ │
│  │  │   Currency   │                                           │ │
│  │  │  Controller  │                                           │ │
│  │  └──────────────┘                                           │ │
│  └────────────────────────────────────────────────────────────┘ │
│                             │                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                      Domain Layer                           │ │
│  │                                                              │ │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐           │ │
│  │  │   Auth     │  │   Users    │  │   Stocks   │           │ │
│  │  │  Service   │  │  Service   │  │  Service   │           │ │
│  │  │  UseCases  │  │Repository  │  │Repository  │           │ │
│  │  └────────────┘  └────────────┘  └────────────┘           │ │
│  │                                                              │ │
│  │  ┌────────────┐                                             │ │
│  │  │  Currency  │                                             │ │
│  │  │  Service   │                                             │ │
│  │  │ Repository │                                             │ │
│  │  └────────────┘                                             │ │
│  └────────────────────────────────────────────────────────────┘ │
│                             │                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                  Infrastructure Layer                       │ │
│  │                                                              │ │
│  │  • Database Service (TypeORM)                              │ │
│  │  • Configuration Service (.env)                            │ │
│  │  • JWT Service (Authentication)                            │ │
│  └────────────────────────────────────────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ SQL Queries
                             ▼
                  ┌──────────────────────┐
                  │  PostgreSQL Database │
                  │                      │
                  │  • users             │
                  │  • refresh_tokens    │
                  │  • stocks            │
                  │  • currencies        │
                  └──────────────────────┘
```

---

## Authentication Flow

### 1. User Registration Flow

```
┌─────────┐
│ Client  │
└────┬────┘
     │
     │ POST /api/v1/auth/register
     │ Body: { email, password, firstName, lastName }
     ▼
┌─────────────────────┐
│  Auth Controller    │
└─────────┬───────────┘
          │
          │ 1. Validate DTO
          ▼
┌─────────────────────┐
│  Auth Use Cases     │
└─────────┬───────────┘
          │
          │ 2. Check if user exists
          ▼
┌─────────────────────┐
│  User Repository    │──────► Check email in DB
└─────────┬───────────┘
          │
          │ 3. User doesn't exist?
          ▼
┌─────────────────────┐
│  Bcrypt Service     │──────► Hash password
└─────────┬───────────┘
          │
          │ 4. Hashed password
          ▼
┌─────────────────────┐
│  User Repository    │──────► Save new user
└─────────┬───────────┘
          │
          │ 5. User created
          ▼
┌─────────────────────┐
│  Auth Use Cases     │──────► Generate JWT tokens
└─────────┬───────────┘       (Access + Refresh)
          │
          │ 6. Save refresh token
          ▼
┌─────────────────────┐
│ RefreshToken Repo   │──────► Store in DB
└─────────┬───────────┘
          │
          │ 7. Return tokens
          ▼
┌─────────────────────┐
│     Client          │◄────── { accessToken, refreshToken, expiresIn }
└─────────────────────┘
```

### 2. User Login Flow

```
┌─────────┐
│ Client  │
└────┬────┘
     │
     │ POST /api/v1/auth/login
     │ Body: { email, password }
     ▼
┌─────────────────────┐
│  Auth Controller    │
└─────────┬───────────┘
          │
          │ 1. Validate DTO
          ▼
┌─────────────────────┐
│  Auth Use Cases     │
└─────────┬───────────┘
          │
          │ 2. Find user by email
          ▼
┌─────────────────────┐
│  User Repository    │──────► Query DB
└─────────┬───────────┘
          │
          │ 3. User found?
          ▼
     ┌────────┐
     │ Exists?│
     └───┬─┬──┘
         │ │
     Yes │ │ No
         │ └──────────────────────────────┐
         │                                 │
         ▼                                 ▼
┌─────────────────────┐          ┌─────────────────┐
│  Bcrypt Service     │          │ Throw Unauth    │
│  Compare passwords  │          │   Exception     │
└─────────┬───────────┘          └─────────────────┘
          │
          │ 4. Passwords match?
          ▼
     ┌────────┐
     │ Match? │
     └───┬─┬──┘
         │ │
     Yes │ │ No
         │ └──────────────────────────────┐
         │                                 │
         ▼                                 ▼
┌─────────────────────┐          ┌─────────────────┐
│  JWT Service        │          │ Throw Unauth    │
│  Generate Tokens    │          │   Exception     │
└─────────┬───────────┘          └─────────────────┘
          │
          │ 5. Save refresh token
          ▼
┌─────────────────────┐
│ RefreshToken Repo   │──────► Store in DB
└─────────┬───────────┘
          │
          │ 6. Return tokens
          ▼
┌─────────────────────┐
│     Client          │◄────── { accessToken, refreshToken, expiresIn }
└─────────────────────┘
```

### 3. Token Refresh Flow

```
┌─────────┐
│ Client  │
└────┬────┘
     │
     │ POST /api/v1/auth/refresh
     │ Body: { refreshToken }
     ▼
┌─────────────────────┐
│  Auth Controller    │
└─────────┬───────────┘
          │
          │ 1. Validate refresh token
          ▼
┌─────────────────────┐
│  JWT Service        │──────► Verify token signature
└─────────┬───────────┘
          │
          │ 2. Token valid?
          ▼
┌─────────────────────┐
│ RefreshToken Repo   │──────► Check token exists in DB
└─────────┬───────────┘
          │
          │ 3. Token exists and not expired?
          ▼
┌─────────────────────┐
│  Auth Use Cases     │──────► Generate new access token
└─────────┬───────────┘
          │
          │ 4. Return new token
          ▼
┌─────────────────────┐
│     Client          │◄────── { accessToken, expiresIn }
└─────────────────────┘
```

---

## User Management Flow

### CRUD Operations Flow

```
┌─────────┐
│ Client  │
└────┬────┘
     │
     │ Any User Request (GET, PUT, DELETE)
     │ Header: Authorization: Bearer <accessToken>
     ▼
┌─────────────────────┐
│  JWT Auth Guard     │──────► Validate JWT token
└─────────┬───────────┘
          │
          │ Token valid?
          ▼
     ┌────────┐
     │ Valid? │
     └───┬─┬──┘
         │ │
     Yes │ │ No
         │ └──────────────────────────────┐
         │                                 │
         ▼                                 ▼
┌─────────────────────┐          ┌─────────────────┐
│  Users Controller   │          │ Return 401      │
│  (Authorized)       │          │  Unauthorized   │
└─────────┬───────────┘          └─────────────────┘
          │
          ├──► GET /users ──────────────────┐
          │                                  │
          ├──► GET /users/:id ──────────────┤
          │                                  │
          ├──► PUT /users/:id ──────────────┤
          │                                  │
          └──► DELETE /users/:id ────────────┤
                                             │
                                             ▼
                                  ┌─────────────────────┐
                                  │   Users Service     │
                                  └─────────┬───────────┘
                                            │
                                            ▼
                                  ┌─────────────────────┐
                                  │  Users Repository   │
                                  └─────────┬───────────┘
                                            │
                                            │ TypeORM Query
                                            ▼
                                  ┌─────────────────────┐
                                  │   PostgreSQL DB     │
                                  │   (users table)     │
                                  └─────────┬───────────┘
                                            │
                                            │ Result
                                            ▼
                                  ┌─────────────────────┐
                                  │  Response DTO       │
                                  │  (Transform data)   │
                                  └─────────┬───────────┘
                                            │
                                            ▼
                                  ┌─────────────────────┐
                                  │     Client          │
                                  └─────────────────────┘
```

---

## Stock Management Flow

### Stock CRUD with Advanced Queries

```
┌─────────┐
│ Client  │
└────┬────┘
     │
     │ Stock Operations
     │ Header: Authorization: Bearer <accessToken>
     │
     ├──► POST /stocks
     │    Body: { symbol, name, price, market, sector, ... }
     │
     ├──► GET /stocks
     │    Query: ?search=AAPL
     │
     ├──► GET /stocks/symbol/:symbol
     │
     ├──► GET /stocks/market/:market
     │
     ├──► GET /stocks/sector/:sector
     │
     ├──► GET /stocks/:id
     │
     ├──► PUT /stocks/:id
     │    Body: { price, dayHigh, dayLow, ... }
     │
     └──► DELETE /stocks/:id
          │
          ▼
┌─────────────────────────────────────────────────┐
│             JWT Auth Guard                      │
│             (Validate Token)                    │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│            Stocks Controller                    │
│            (Route Handler)                      │
└─────────────────┬───────────────────────────────┘
                  │
                  │ Validate DTO
                  ▼
┌─────────────────────────────────────────────────┐
│             Stock Service                       │
│                                                  │
│  • create()        • findBySymbol()             │
│  • findAll()       • findByMarket()             │
│  • findById()      • findBySector()             │
│  • update()        • search()                   │
│  • delete()                                     │
│                                                  │
└─────────────────┬───────────────────────────────┘
                  │
                  │ Business Logic
                  ▼
┌─────────────────────────────────────────────────┐
│          Stock Repository                       │
│                                                  │
│  • Normalize symbol to uppercase                │
│  • Check for duplicates                         │
│  • CRUD operations with TypeORM                 │
│  • Advanced queries (ILIKE search)              │
│  • Update lastUpdated timestamp                 │
│                                                  │
└─────────────────┬───────────────────────────────┘
                  │
                  │ SQL Queries
                  ▼
┌─────────────────────────────────────────────────┐
│            PostgreSQL Database                  │
│                                                  │
│  stocks table:                                  │
│  ├─ id (UUID)                                   │
│  ├─ symbol (VARCHAR, UNIQUE)                    │
│  ├─ name (VARCHAR)                              │
│  ├─ price (DECIMAL)                             │
│  ├─ market (VARCHAR)                            │
│  ├─ sector (VARCHAR)                            │
│  ├─ industry (VARCHAR)                          │
│  ├─ marketCap (BIGINT)                          │
│  ├─ dayHigh, dayLow, openPrice (DECIMAL)        │
│  ├─ previousClose (DECIMAL)                     │
│  ├─ volume (BIGINT)                             │
│  ├─ lastUpdated (TIMESTAMP)                     │
│  ├─ createdAt (TIMESTAMP)                       │
│  └─ updatedAt (TIMESTAMP)                       │
│                                                  │
└─────────────────┬───────────────────────────────┘
                  │
                  │ Transform to DTO
                  ▼
┌─────────────────────────────────────────────────┐
│         StockResponseDto                        │
│         (class-transformer)                     │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│              Client Response                    │
└─────────────────────────────────────────────────┘
```

---

## Currency Management Flow

### Currency CRUD with Exchange Rates

```
┌─────────┐
│ Client  │
└────┬────┘
     │
     │ Currency Operations
     │ Header: Authorization: Bearer <accessToken>
     │
     ├──► POST /currency
     │    Body: { code, name, exchangeRate, baseCurrency, lastUpdated }
     │
     ├──► GET /currency
     │    Query: ?search=USD
     │
     ├──► GET /currency/code/:code
     │
     ├──► GET /currency/base/:baseCurrency
     │
     ├──► GET /currency/:id
     │
     ├──► PUT /currency/:id
     │    Body: { exchangeRate, lastUpdated }
     │
     └──► DELETE /currency/:id
          │
          ▼
┌─────────────────────────────────────────────────┐
│             JWT Auth Guard                      │
│             (Validate Token)                    │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│          Currency Controller                    │
│          (Route Handler)                        │
└─────────────────┬───────────────────────────────┘
                  │
                  │ Validate DTO
                  ▼
┌─────────────────────────────────────────────────┐
│           Currency Service                      │
│                                                  │
│  • create()           • findByCode()            │
│  • findAll()          • findByBaseCurrency()    │
│  • findById()         • search()                │
│  • update()                                     │
│  • delete()                                     │
│                                                  │
└─────────────────┬───────────────────────────────┘
                  │
                  │ Business Logic
                  │ • Normalize codes to uppercase
                  │ • Check for duplicates
                  │ • Validate exchange rates
                  ▼
┌─────────────────────────────────────────────────┐
│         Currency Repository                     │
│                                                  │
│  • CRUD operations with TypeORM                 │
│  • Advanced queries (ILIKE search)              │
│  • Filter by base currency                      │
│  • Update lastUpdated timestamp                 │
│                                                  │
└─────────────────┬───────────────────────────────┘
                  │
                  │ SQL Queries
                  ▼
┌─────────────────────────────────────────────────┐
│            PostgreSQL Database                  │
│                                                  │
│  currencies table:                              │
│  ├─ id (UUID)                                   │
│  ├─ code (VARCHAR(3), UNIQUE)                   │
│  ├─ name (VARCHAR)                              │
│  ├─ exchangeRate (DECIMAL(18,6))                │
│  ├─ baseCurrency (VARCHAR(3))                   │
│  ├─ lastUpdated (TIMESTAMP)                     │
│  ├─ createdAt (TIMESTAMP)                       │
│  └─ updatedAt (TIMESTAMP)                       │
│                                                  │
└─────────────────┬───────────────────────────────┘
                  │
                  │ Transform to DTO
                  ▼
┌─────────────────────────────────────────────────┐
│       CurrencyResponseDto                       │
│       (class-transformer)                       │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│            Client Response                      │
└─────────────────────────────────────────────────┘
```

---

## Request/Response Pipeline

### Complete Request Processing Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      Incoming HTTP Request                       │
│                 (GET, POST, PUT, DELETE, etc.)                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                   ┌──────────────────┐
                   │   CORS Enabled   │
                   │   (All Origins)  │
                   └────────┬─────────┘
                            │
                            ▼
            ┌───────────────────────────────┐
            │    Logging Interceptor        │
            │                               │
            │  • Log request method & URL   │
            │  • Log params & query         │
            │  • Log request body           │
            │  • Start timer                │
            └───────────────┬───────────────┘
                            │
                            ▼
            ┌───────────────────────────────┐
            │   Global Validation Pipe      │
            │                               │
            │  • Validate DTOs              │
            │  • Transform types            │
            │  • Strip unknown properties   │
            │  • Reject extra fields        │
            └───────────────┬───────────────┘
                            │
                            │ Validation Success
                            ▼
            ┌───────────────────────────────┐
            │      JWT Auth Guard           │
            │    (If route protected)       │
            │                               │
            │  • Extract token from header  │
            │  • Verify JWT signature       │
            │  • Check expiration           │
            │  • Attach user to request     │
            └───────────────┬───────────────┘
                            │
                            │ Authorization Success
                            ▼
            ┌───────────────────────────────┐
            │       Route Handler           │
            │       (Controller)            │
            │                               │
            │  • Execute business logic     │
            │  • Call service methods       │
            │  • Return data/response       │
            └───────────────┬───────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
            Success                   Error
                │                       │
                ▼                       ▼
    ┌──────────────────────┐   ┌──────────────────────┐
    │ Response Interceptor │   │  Exception Filter    │
    │                      │   │                      │
    │ Wrap response:       │   │ Format error:        │
    │ {                    │   │ {                    │
    │   statusCode: 200,   │   │   statusCode: 4xx,   │
    │   message: "Success",│   │   message: [errors], │
    │   data: {...},       │   │   errors: {...},     │
    │   timestamp: "..."   │   │   timestamp: "...",  │
    │ }                    │   │   path: "/api/v1/x", │
    │                      │   │   method: "POST"     │
    │                      │   │ }                    │
    └──────────┬───────────┘   └──────────┬───────────┘
               │                          │
               │                          │
               └──────────┬───────────────┘
                          │
                          ▼
              ┌──────────────────────┐
              │  Logging Interceptor │
              │                      │
              │  • Calculate time    │
              │  • Log response      │
              │  • Log status code   │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │   HTTP Response      │
              │   (JSON Format)      │
              └──────────────────────┘
                         │
                         ▼
                   ┌──────────┐
                   │  Client  │
                   └──────────┘
```

---

## Error Handling Flow

### Exception Handling Pipeline

```
                    ┌──────────────────┐
                    │  Error Occurs    │
                    │  (Any Layer)     │
                    └────────┬─────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
          Known Exception          Unknown Exception
                │                         │
                ▼                         ▼
    ┌──────────────────────┐   ┌──────────────────────┐
    │  HTTP Exception      │   │  Generic Error       │
    │  • NotFoundException │   │  • TypeError         │
    │  • ConflictException │   │  • ReferenceError    │
    │  • UnauthorizedException│  • Database Error   │
    │  • BadRequestException│   │  • Unhandled Error   │
    └──────────┬───────────┘   └──────────┬───────────┘
               │                          │
               └──────────┬───────────────┘
                          │
                          ▼
              ┌──────────────────────────┐
              │  HttpExceptionFilter     │
              │  (Global Error Handler)  │
              └──────────┬───────────────┘
                         │
                         │ 1. Extract error details
                         │ 2. Determine status code
                         │ 3. Format error message
                         │
                         ▼
              ┌──────────────────────────┐
              │   Logger Service         │
              │                          │
              │  • Log error message     │
              │  • Log stack trace       │
              │  • Log request details   │
              └──────────┬───────────────┘
                         │
                         ▼
              ┌──────────────────────────┐
              │  Format Error Response   │
              │                          │
              │  {                       │
              │    statusCode: 4xx/5xx,  │
              │    message: ["error"],   │
              │    errors: {...},        │
              │    timestamp: "...",     │
              │    path: "/api/...",     │
              │    method: "POST"        │
              │  }                       │
              └──────────┬───────────────┘
                         │
                         ▼
              ┌──────────────────────────┐
              │   Return to Client       │
              │   (JSON Response)        │
              └──────────────────────────┘
```

### Common Exception Types

```
┌─────────────────────────────────────────────────────┐
│              AppException Class                     │
│              (Custom Exception)                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  badRequest(message, errors)                       │
│  └─► 400 Bad Request                               │
│                                                     │
│  unauthorized(message)                             │
│  └─► 401 Unauthorized                              │
│                                                     │
│  forbidden(message)                                │
│  └─► 403 Forbidden                                 │
│                                                     │
│  notFound(message)                                 │
│  └─► 404 Not Found                                 │
│                                                     │
│  conflict(message)                                 │
│  └─► 409 Conflict                                  │
│                                                     │
│  internalServerError(message)                      │
│  └─► 500 Internal Server Error                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Database Architecture

### Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      users                                   │
├─────────────────────────────────────────────────────────────┤
│  id              UUID (PK)                                   │
│  email           VARCHAR (UNIQUE)                            │
│  password        VARCHAR (hashed)                            │
│  firstName       VARCHAR                                     │
│  lastName        VARCHAR                                     │
│  isActive        BOOLEAN                                     │
│  createdAt       TIMESTAMP                                   │
│  updatedAt       TIMESTAMP                                   │
│  deletedAt       TIMESTAMP (nullable)                        │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ 1:N relationship
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  refresh_tokens                              │
├─────────────────────────────────────────────────────────────┤
│  id              UUID (PK)                                   │
│  token           TEXT (UNIQUE)                               │
│  userId          UUID (FK) → users.id                        │
│  expiresAt       TIMESTAMP                                   │
│  createdAt       TIMESTAMP                                   │
└─────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────┐
│                      stocks                                  │
├─────────────────────────────────────────────────────────────┤
│  id              UUID (PK)                                   │
│  symbol          VARCHAR(10) (UNIQUE)                        │
│  name            VARCHAR                                     │
│  market          VARCHAR (nullable)                          │
│  price           DECIMAL(10,2) (nullable)                    │
│  lastUpdated     TIMESTAMP (nullable)                        │
│  sector          VARCHAR (nullable)                          │
│  industry        VARCHAR (nullable)                          │
│  marketCap       BIGINT (nullable)                           │
│  dayHigh         DECIMAL(10,2) (nullable)                    │
│  dayLow          DECIMAL(10,2) (nullable)                    │
│  openPrice       DECIMAL(10,2) (nullable)                    │
│  previousClose   DECIMAL(10,2) (nullable)                    │
│  volume          BIGINT (nullable)                           │
│  createdAt       TIMESTAMP                                   │
│  updatedAt       TIMESTAMP                                   │
└─────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────┐
│                    currencies                                │
├─────────────────────────────────────────────────────────────┤
│  id              UUID (PK)                                   │
│  code            VARCHAR(3) (UNIQUE)                         │
│  name            VARCHAR                                     │
│  exchangeRate    DECIMAL(18,6)                               │
│  baseCurrency    VARCHAR(3)                                  │
│  lastUpdated     TIMESTAMP                                   │
│  createdAt       TIMESTAMP                                   │
│  updatedAt       TIMESTAMP                                   │
└─────────────────────────────────────────────────────────────┘
```

### Database Connection Flow

```
┌─────────────────┐
│  Application    │
│  Bootstrap      │
└────────┬────────┘
         │
         │ Load .env configuration
         ▼
┌─────────────────────────────┐
│   ConfigModule              │
│   (Global Configuration)    │
└────────┬────────────────────┘
         │
         │ Database config
         ▼
┌─────────────────────────────┐
│   DatabaseModule            │
│   (TypeORM Configuration)   │
│                             │
│  • Host: localhost          │
│  • Port: 5432               │
│  • Database: stocks_db      │
│  • Entities: [...]          │
│  • Synchronize: true (dev)  │
│  • Logging: true            │
└────────┬────────────────────┘
         │
         │ Establish connection
         ▼
┌─────────────────────────────┐
│   PostgreSQL Server         │
│                             │
│  Connection Pool:           │
│  • Max connections: 10      │
│  • Idle timeout: 30s        │
│  • Query timeout: 60s       │
└────────┬────────────────────┘
         │
         │ Connection ready
         ▼
┌─────────────────────────────┐
│   TypeORM Repository        │
│   Pattern                   │
│                             │
│  • Entity Manager           │
│  • Query Builder            │
│  • Transaction Support      │
└─────────────────────────────┘
```

---

## Module Structure

### Project Directory Architecture

```
stocks-backend/
│
├── src/
│   │
│   ├── main.ts                        # Application entry point
│   ├── app.module.ts                  # Root module
│   │
│   ├── core/                          # Core/Shared functionality
│   │   ├── config/                    # Configuration files
│   │   │   ├── app.config.ts
│   │   │   ├── database.config.ts
│   │   │   └── jwt.config.ts
│   │   │
│   │   ├── exceptions/                # Custom exceptions
│   │   │   ├── app.exception.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── filters/                   # Global exception filters
│   │   │   ├── http-exception.filter.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── interceptors/              # Global interceptors
│   │   │   ├── logging.interceptor.ts
│   │   │   ├── response.interceptor.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── guards/                    # Global guards
│   │   │
│   │   └── logger/                    # Logger service
│   │       ├── app-logger.service.ts
│   │       └── index.ts
│   │
│   ├── domain/                        # Business logic layer
│   │   │
│   │   ├── auth/                      # Authentication domain
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.use-cases.ts
│   │   │   ├── refresh-token.entity.ts
│   │   │   ├── refresh-token.repository.ts
│   │   │   ├── guards/
│   │   │   │   ├── jwt-auth.guard.ts
│   │   │   │   └── jwt.strategy.ts
│   │   │   └── dto/
│   │   │       ├── login.dto.ts
│   │   │       ├── register.dto.ts
│   │   │       ├── refresh-token.dto.ts
│   │   │       └── token-response.dto.ts
│   │   │
│   │   ├── users/                     # Users domain
│   │   │   ├── users.module.ts
│   │   │   ├── user.entity.ts
│   │   │   ├── user.repository.ts
│   │   │   ├── user.service.ts
│   │   │   └── dto/
│   │   │       ├── create-user.dto.ts
│   │   │       ├── update-user.dto.ts
│   │   │       └── response-user.dto.ts
│   │   │
│   │   ├── stocks/                    # Stocks domain
│   │   │   ├── stocks.module.ts
│   │   │   ├── stock.entity.ts
│   │   │   ├── stock.repository.ts
│   │   │   ├── stock.service.ts
│   │   │   └── dto/
│   │   │       ├── create-stock.dto.ts
│   │   │       ├── update-stock.dto.ts
│   │   │       └── stock-response.dto.ts
│   │   │
│   │   └── currency/                  # Currency domain
│   │       ├── currency.module.ts
│   │       ├── currency.entity.ts
│   │       ├── currency.repository.ts
│   │       ├── currency.service.ts
│   │       ├── index.ts
│   │       └── dto/
│   │           ├── create-currency.dto.ts
│   │           ├── update-currency.dto.ts
│   │           └── response-currency.dto.ts
│   │
│   ├── application/                   # Application layer
│   │   └── controllers/               # HTTP controllers
│   │       ├── auth.controller.ts
│   │       ├── users.controller.ts
│   │       ├── stocks.controller.ts
│   │       └── currency.controller.ts
│   │
│   └── infrastructure/                # Infrastructure layer
│       └── database/                  # Database configuration
│           ├── database.module.ts
│           └── database.service.ts
│
├── standardNotes/                     # Documentation
│   └── README.md                      # This file
│
├── .env                               # Environment variables
├── package.json                       # Dependencies
└── tsconfig.json                      # TypeScript config
```

---

## API Endpoints Summary

### Authentication Endpoints
```
POST   /api/v1/auth/register          # Register new user
POST   /api/v1/auth/login             # Login user
POST   /api/v1/auth/refresh           # Refresh access token
```

### User Management Endpoints (Protected)
```
GET    /api/v1/users                  # Get all users
GET    /api/v1/users/:id              # Get user by ID
PUT    /api/v1/users/:id              # Update user
DELETE /api/v1/users/:id              # Delete user
```

### Stock Management Endpoints (Protected)
```
POST   /api/v1/stocks                 # Create stock
GET    /api/v1/stocks                 # Get all stocks (with search)
GET    /api/v1/stocks/:id             # Get stock by ID
GET    /api/v1/stocks/symbol/:symbol  # Get stock by symbol
GET    /api/v1/stocks/market/:market  # Get stocks by market
GET    /api/v1/stocks/sector/:sector  # Get stocks by sector
PUT    /api/v1/stocks/:id             # Update stock
DELETE /api/v1/stocks/:id             # Delete stock
```

### Currency Management Endpoints (Protected)
```
POST   /api/v1/currency               # Create currency
GET    /api/v1/currency               # Get all currencies (with search)
GET    /api/v1/currency/:id           # Get currency by ID
GET    /api/v1/currency/code/:code    # Get currency by code
GET    /api/v1/currency/base/:base    # Get currencies by base currency
PUT    /api/v1/currency/:id           # Update currency
DELETE /api/v1/currency/:id           # Delete currency
```

---

## Technology Stack

```
┌─────────────────────────────────────────────────────┐
│                 Technology Stack                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Backend Framework:                                │
│  └─► NestJS 10.x (Node.js)                         │
│                                                     │
│  Language:                                         │
│  └─► TypeScript 5.x                                │
│                                                     │
│  Database:                                         │
│  └─► PostgreSQL 12+                                │
│                                                     │
│  ORM:                                              │
│  └─► TypeORM 0.3.x                                 │
│                                                     │
│  Authentication:                                    │
│  ├─► JWT (JSON Web Tokens)                         │
│  ├─► Passport.js                                   │
│  └─► Bcrypt (password hashing)                     │
│                                                     │
│  Validation:                                       │
│  ├─► class-validator                               │
│  └─► class-transformer                             │
│                                                     │
│  Configuration:                                    │
│  ├─► @nestjs/config                                │
│  └─► dotenv                                        │
│                                                     │
│  HTTP:                                             │
│  └─► Express (underlying)                          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Environment Configuration

```
# Application
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=stocks_db

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_REFRESH_EXPIRES_IN=7d
```

---

## Getting Started

### Installation
```bash
npm install
```

### Database Setup
```bash
# Create PostgreSQL database
createdb stocks_db

# Run migrations (if any)
npm run migration:run
```

### Running the Application
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

### Testing
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

---

## Security Features

```
┌─────────────────────────────────────────────────────┐
│              Security Implementations               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ✓ JWT-based authentication                        │
│  ✓ Bcrypt password hashing                         │
│  ✓ Refresh token rotation                          │
│  ✓ Input validation and sanitization               │
│  ✓ SQL injection prevention (TypeORM)              │
│  ✓ CORS enabled                                    │
│  ✓ Global exception handling                       │
│  ✓ Request logging                                 │
│  ✓ Environment variable management                 │
│  ✓ TypeScript type safety                          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Future Enhancements

1. **Rate Limiting** - Implement request rate limiting
2. **API Versioning** - Add support for multiple API versions
3. **Caching** - Redis integration for performance
4. **WebSockets** - Real-time stock price updates
5. **Swagger Documentation** - API documentation with OpenAPI
6. **Unit Tests** - Comprehensive test coverage
7. **Docker** - Containerization support
8. **CI/CD** - Automated deployment pipeline
9. **Monitoring** - Application performance monitoring
10. **Winston Logger** - Advanced logging with Winston

---

**Last Updated:** 2024
**Version:** 1.0.0
**Author:** Development Team
