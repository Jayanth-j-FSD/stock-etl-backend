# Available API Routes

**Base URL:** `http://localhost:3000/api/v1`

**Swagger Documentation:** `http://localhost:3000/api/docs`

**Last Updated:** 2024

---

## Swagger/OpenAPI Documentation

This API is fully documented with Swagger/OpenAPI. You can access the interactive API documentation at:

**URL:** http://localhost:3000/api/docs

### Features:
- **Interactive Testing:** Test all endpoints directly from the browser
- **JWT Authentication:** Add your access token once and test protected routes
- **Request/Response Examples:** See all DTOs and response schemas
- **Auto-generated Documentation:** Always up-to-date with the codebase

### How to Use Swagger:

1. **Start the application:**
   ```bash
   npm run start:dev
   ```

2. **Open Swagger UI:**
   Navigate to http://localhost:3000/api/docs in your browser

3. **Authenticate (for protected routes):**
   - First, register or login using the Authentication endpoints
   - Copy the `accessToken` from the response
   - Click the **"Authorize"** button (lock icon) at the top right
   - Enter your token in the format: `Bearer <your-access-token>` or just `<your-access-token>`
   - Click "Authorize" and then "Close"
   - Your token is now saved for all protected endpoint requests!

4. **Test Endpoints:**
   - Click on any endpoint to expand it
   - Click "Try it out"
   - Fill in the required parameters/body
   - Click "Execute"
   - View the response!

---

## Table of Contents
1. [Authentication Routes](#authentication-routes) (Public)
2. [User Management Routes](#user-management-routes) (Protected)
3. [Stock Management Routes](#stock-management-routes) (Protected)
4. [Currency Management Routes](#currency-management-routes) (Protected)

---

## Authentication Routes

**Base Path:** `/api/v1/auth`

**Protection:** Public (No JWT required)

### 1. Register New User
- **Endpoint:** `POST /api/v1/auth/register`
- **Status Code:** `201 Created`
- **Description:** Register a new user account
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "StrongPassword123!",
    "firstName": "John",
    "lastName": "Doe"
  }
  ```
- **Response:**
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900
  }
  ```
- **Controller:** `auth.controller.ts:12`

### 2. Login User
- **Endpoint:** `POST /api/v1/auth/login`
- **Status Code:** `200 OK`
- **Description:** Authenticate user and receive tokens
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "StrongPassword123!"
  }
  ```
- **Response:**
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900
  }
  ```
- **Controller:** `auth.controller.ts:18`

### 3. Refresh Access Token
- **Endpoint:** `POST /api/v1/auth/refresh`
- **Status Code:** `200 OK`
- **Description:** Get a new access token using refresh token
- **Request Body:**
  ```json
  {
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Response:**
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900
  }
  ```
- **Controller:** `auth.controller.ts:24`

### 4. Logout User
- **Endpoint:** `POST /api/v1/auth/logout`
- **Status Code:** `204 No Content`
- **Description:** Invalidate refresh token and logout user
- **Request Body:**
  ```json
  {
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Response:** No content
- **Controller:** `auth.controller.ts:30`

---

## User Management Routes

**Base Path:** `/api/v1/users`

**Protection:** Protected (JWT required)

**Authentication:** All routes require `Authorization: Bearer <accessToken>` header

### 1. Get All Users
- **Endpoint:** `GET /api/v1/users`
- **Status Code:** `200 OK`
- **Description:** Retrieve all users
- **Request Headers:**
  ```
  Authorization: Bearer <accessToken>
  ```
- **Response:**
  ```json
  [
    {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
  ```
- **Controller:** `users.controller.ts:22`

### 2. Get User by ID
- **Endpoint:** `GET /api/v1/users/:id`
- **Status Code:** `200 OK`
- **Description:** Retrieve a specific user by ID
- **URL Parameters:**
  - `id` (string, required): User UUID
- **Request Headers:**
  ```
  Authorization: Bearer <accessToken>
  ```
- **Response:**
  ```json
  {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
  ```
- **Controller:** `users.controller.ts:28`

### 3. Update User
- **Endpoint:** `PUT /api/v1/users/:id`
- **Status Code:** `200 OK`
- **Description:** Update user information
- **URL Parameters:**
  - `id` (string, required): User UUID
- **Request Headers:**
  ```
  Authorization: Bearer <accessToken>
  ```
- **Request Body:**
  ```json
  {
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "newEmail@example.com"
  }
  ```
- **Response:**
  ```json
  {
    "id": "uuid",
    "email": "newEmail@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
  ```
- **Controller:** `users.controller.ts:34`

### 4. Delete User
- **Endpoint:** `DELETE /api/v1/users/:id`
- **Status Code:** `204 No Content`
- **Description:** Soft delete a user (sets deletedAt timestamp)
- **URL Parameters:**
  - `id` (string, required): User UUID
- **Request Headers:**
  ```
  Authorization: Bearer <accessToken>
  ```
- **Response:** No content
- **Controller:** `users.controller.ts:43`

---

## Stock Management Routes

**Base Path:** `/api/v1/stocks`

**Protection:** Protected (JWT required)

**Authentication:** All routes require `Authorization: Bearer <accessToken>` header

### 1. Create Stock
- **Endpoint:** `POST /api/v1/stocks`
- **Status Code:** `201 Created`
- **Description:** Create a new stock entry
- **Request Headers:**
  ```
  Authorization: Bearer <accessToken>
  ```
- **Request Body:**
  ```json
  {
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "price": 175.50,
    "market": "NASDAQ",
    "sector": "Technology",
    "industry": "Consumer Electronics",
    "marketCap": 2750000000000,
    "dayHigh": 176.00,
    "dayLow": 174.50,
    "openPrice": 175.00,
    "previousClose": 174.80,
    "volume": 55000000,
    "lastUpdated": "2024-01-01T00:00:00.000Z"
  }
  ```
- **Response:**
  ```json
  {
    "id": "uuid",
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "price": 175.50,
    "market": "NASDAQ",
    "sector": "Technology",
    "industry": "Consumer Electronics",
    "marketCap": 2750000000000,
    "dayHigh": 176.00,
    "dayLow": 174.50,
    "openPrice": 175.00,
    "previousClose": 174.80,
    "volume": 55000000,
    "lastUpdated": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
  ```
- **Controller:** `stocks.controller.ts:25`

### 2. Get All Stocks
- **Endpoint:** `GET /api/v1/stocks`
- **Status Code:** `200 OK`
- **Description:** Retrieve all stocks or search stocks
- **Query Parameters:**
  - `search` (string, optional): Search by symbol or name (case-insensitive)
- **Request Headers:**
  ```
  Authorization: Bearer <accessToken>
  ```
- **Examples:**
  - Get all: `GET /api/v1/stocks`
  - Search: `GET /api/v1/stocks?search=AAPL`
- **Response:**
  ```json
  [
    {
      "id": "uuid",
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "price": 175.50,
      "market": "NASDAQ",
      "sector": "Technology",
      "industry": "Consumer Electronics",
      "marketCap": 2750000000000,
      "dayHigh": 176.00,
      "dayLow": 174.50,
      "openPrice": 175.00,
      "previousClose": 174.80,
      "volume": 55000000,
      "lastUpdated": "2024-01-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
  ```
- **Controller:** `stocks.controller.ts:31`

### 3. Get Stocks by Market
- **Endpoint:** `GET /api/v1/stocks/market/:market`
- **Status Code:** `200 OK`
- **Description:** Retrieve all stocks from a specific market
- **URL Parameters:**
  - `market` (string, required): Market name (e.g., NASDAQ, NYSE)
- **Request Headers:**
  ```
  Authorization: Bearer <accessToken>
  ```
- **Example:** `GET /api/v1/stocks/market/NASDAQ`
- **Response:** Array of stock objects
- **Controller:** `stocks.controller.ts:40`

### 4. Get Stocks by Sector
- **Endpoint:** `GET /api/v1/stocks/sector/:sector`
- **Status Code:** `200 OK`
- **Description:** Retrieve all stocks from a specific sector
- **URL Parameters:**
  - `sector` (string, required): Sector name (e.g., Technology, Healthcare)
- **Request Headers:**
  ```
  Authorization: Bearer <accessToken>
  ```
- **Example:** `GET /api/v1/stocks/sector/Technology`
- **Response:** Array of stock objects
- **Controller:** `stocks.controller.ts:46`

### 5. Get Stock by Symbol
- **Endpoint:** `GET /api/v1/stocks/symbol/:symbol`
- **Status Code:** `200 OK`
- **Description:** Retrieve a specific stock by its symbol
- **URL Parameters:**
  - `symbol` (string, required): Stock symbol (e.g., AAPL, MSFT)
- **Request Headers:**
  ```
  Authorization: Bearer <accessToken>
  ```
- **Example:** `GET /api/v1/stocks/symbol/AAPL`
- **Response:** Single stock object
- **Controller:** `stocks.controller.ts:52`

### 6. Get Stock by ID
- **Endpoint:** `GET /api/v1/stocks/:id`
- **Status Code:** `200 OK`
- **Description:** Retrieve a specific stock by ID
- **URL Parameters:**
  - `id` (string, required): Stock UUID
- **Request Headers:**
  ```
  Authorization: Bearer <accessToken>
  ```
- **Response:** Single stock object
- **Controller:** `stocks.controller.ts:58`

### 7. Update Stock
- **Endpoint:** `PUT /api/v1/stocks/:id`
- **Status Code:** `200 OK`
- **Description:** Update stock information
- **URL Parameters:**
  - `id` (string, required): Stock UUID
- **Request Headers:**
  ```
  Authorization: Bearer <accessToken>
  ```
- **Request Body:** (All fields optional)
  ```json
  {
    "price": 180.00,
    "dayHigh": 181.00,
    "dayLow": 179.00,
    "volume": 60000000,
    "lastUpdated": "2024-01-02T00:00:00.000Z"
  }
  ```
- **Response:** Updated stock object
- **Controller:** `stocks.controller.ts:64`

### 8. Delete Stock
- **Endpoint:** `DELETE /api/v1/stocks/:id`
- **Status Code:** `204 No Content`
- **Description:** Delete a stock entry
- **URL Parameters:**
  - `id` (string, required): Stock UUID
- **Request Headers:**
  ```
  Authorization: Bearer <accessToken>
  ```
- **Response:** No content
- **Controller:** `stocks.controller.ts:73`

---

## Currency Management Routes

**Base Path:** `/api/v1/currency`

**Protection:** Protected (JWT required)

**Authentication:** All routes require `Authorization: Bearer <accessToken>` header

### 1. Create Currency
- **Endpoint:** `POST /api/v1/currency`
- **Status Code:** `201 Created`
- **Description:** Create a new currency entry
- **Request Headers:**
  ```
  Authorization: Bearer <accessToken>
  ```
- **Request Body:**
  ```json
  {
    "code": "USD",
    "name": "United States Dollar",
    "exchangeRate": 1.0,
    "baseCurrency": "USD",
    "lastUpdated": "2024-01-01T00:00:00.000Z"
  }
  ```
- **Response:**
  ```json
  {
    "id": "uuid",
    "code": "USD",
    "name": "United States Dollar",
    "exchangeRate": 1.0,
    "baseCurrency": "USD",
    "lastUpdated": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
  ```
- **Controller:** `currency.controller.ts:25`

### 2. Get All Currencies
- **Endpoint:** `GET /api/v1/currency`
- **Status Code:** `200 OK`
- **Description:** Retrieve all currencies or search currencies
- **Query Parameters:**
  - `search` (string, optional): Search by code or name (case-insensitive)
- **Request Headers:**
  ```
  Authorization: Bearer <accessToken>
  ```
- **Examples:**
  - Get all: `GET /api/v1/currency`
  - Search: `GET /api/v1/currency?search=USD`
- **Response:**
  ```json
  [
    {
      "id": "uuid",
      "code": "USD",
      "name": "United States Dollar",
      "exchangeRate": 1.0,
      "baseCurrency": "USD",
      "lastUpdated": "2024-01-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
  ```
- **Controller:** `currency.controller.ts:31`

### 3. Get Currencies by Base Currency
- **Endpoint:** `GET /api/v1/currency/base/:baseCurrency`
- **Status Code:** `200 OK`
- **Description:** Retrieve all currencies with a specific base currency
- **URL Parameters:**
  - `baseCurrency` (string, required): Base currency code (e.g., USD, EUR)
- **Request Headers:**
  ```
  Authorization: Bearer <accessToken>
  ```
- **Example:** `GET /api/v1/currency/base/USD`
- **Response:** Array of currency objects
- **Controller:** `currency.controller.ts:40`

### 4. Get Currency by Code
- **Endpoint:** `GET /api/v1/currency/code/:code`
- **Status Code:** `200 OK`
- **Description:** Retrieve a specific currency by its code
- **URL Parameters:**
  - `code` (string, required): Currency code (e.g., USD, EUR, GBP)
- **Request Headers:**
  ```
  Authorization: Bearer <accessToken>
  ```
- **Example:** `GET /api/v1/currency/code/USD`
- **Response:** Single currency object
- **Controller:** `currency.controller.ts:48`

### 5. Get Currency by ID
- **Endpoint:** `GET /api/v1/currency/:id`
- **Status Code:** `200 OK`
- **Description:** Retrieve a specific currency by ID
- **URL Parameters:**
  - `id` (string, required): Currency UUID
- **Request Headers:**
  ```
  Authorization: Bearer <accessToken>
  ```
- **Response:** Single currency object
- **Controller:** `currency.controller.ts:54`

### 6. Update Currency
- **Endpoint:** `PUT /api/v1/currency/:id`
- **Status Code:** `200 OK`
- **Description:** Update currency information
- **URL Parameters:**
  - `id` (string, required): Currency UUID
- **Request Headers:**
  ```
  Authorization: Bearer <accessToken>
  ```
- **Request Body:** (All fields optional)
  ```json
  {
    "exchangeRate": 1.05,
    "lastUpdated": "2024-01-02T00:00:00.000Z"
  }
  ```
- **Response:** Updated currency object
- **Controller:** `currency.controller.ts:60`

### 7. Delete Currency
- **Endpoint:** `DELETE /api/v1/currency/:id`
- **Status Code:** `204 No Content`
- **Description:** Delete a currency entry
- **URL Parameters:**
  - `id` (string, required): Currency UUID
- **Request Headers:**
  ```
  Authorization: Bearer <accessToken>
  ```
- **Response:** No content
- **Controller:** `currency.controller.ts:69`

---

## Quick Reference

### Total Endpoints: 26

| Category | Public | Protected | Total |
|----------|--------|-----------|-------|
| Auth | 4 | 0 | 4 |
| Users | 0 | 4 | 4 |
| Stocks | 0 | 8 | 8 |
| Currency | 0 | 7 | 7 |
| **Total** | **4** | **22** | **26** |

### HTTP Methods Summary

| Method | Count | Usage |
|--------|-------|-------|
| GET | 14 | Retrieve resources |
| POST | 6 | Create resources |
| PUT | 3 | Update resources |
| DELETE | 3 | Delete resources |

---

## Authentication

### How to Get Access Token

1. **Register** or **Login** to get tokens:
   ```bash
   curl -X POST http://localhost:3000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"user@example.com","password":"password123"}'
   ```

2. **Use the accessToken** in subsequent requests:
   ```bash
   curl -X GET http://localhost:3000/api/v1/users \
     -H "Authorization: Bearer <your-access-token>"
   ```

3. **Refresh token** when access token expires:
   ```bash
   curl -X POST http://localhost:3000/api/v1/auth/refresh \
     -H "Content-Type: application/json" \
     -d '{"refreshToken":"<your-refresh-token>"}'
   ```

---

## Error Responses

All endpoints return standardized error responses:

```json
{
  "statusCode": 400,
  "message": ["Error message"],
  "errors": {},
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/v1/endpoint",
  "method": "POST"
}
```

### Common Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 204 | No Content - Request successful, no content to return |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Missing or invalid JWT token |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error - Server error |

---

## Notes

- **Protected Routes:** Require a valid JWT access token in the `Authorization` header
- **Symbols & Codes:** Automatically normalized to uppercase (e.g., "aapl" becomes "AAPL")
- **UUIDs:** All IDs are UUIDs (e.g., "123e4567-e89b-12d3-a456-426614174000")
- **Timestamps:** All timestamps are in ISO 8601 format
- **Search:** Case-insensitive search using ILIKE query
- **Validation:** All request bodies are validated using class-validator
- **Pagination:** Not yet implemented (future enhancement)

---

## Development Notes

### Adding New Routes

When adding new routes during development:

1. Create/update the controller in `src/application/controllers/`
2. Add the route method with appropriate decorators
3. Update this file with the new endpoint details
4. Include HTTP method, path, status code, and request/response examples
5. Document any query parameters or URL parameters
6. Specify if the route is protected or public

### Example Template for New Route

```markdown
### X. Route Name
- **Endpoint:** `METHOD /api/v1/path`
- **Status Code:** `XXX Status`
- **Description:** Brief description
- **URL Parameters:** (if any)
  - `param` (type, required/optional): Description
- **Query Parameters:** (if any)
  - `query` (type, required/optional): Description
- **Request Headers:** (if protected)
  ```
  Authorization: Bearer <accessToken>
  ```
- **Request Body:** (if applicable)
  ```json
  {
    "field": "value"
  }
  ```
- **Response:**
  ```json
  {
    "field": "value"
  }
  ```
- **Controller:** `controller.file.ts:line`
```

---

## Testing with Swagger

### Quick Start Guide

1. **Register a new user:**
   - Go to http://localhost:3000/api/docs
   - Expand `POST /api/v1/auth/register`
   - Click "Try it out"
   - Fill in the request body:
     ```json
     {
       "email": "test@example.com",
       "password": "Test123!",
       "firstName": "John",
       "lastName": "Doe"
     }
     ```
   - Click "Execute"
   - Copy the `accessToken` from the response

2. **Authorize Swagger:**
   - Click the **"Authorize"** button (lock icon) at the top of the page
   - Paste your `accessToken` in the "Value" field
   - Click "Authorize" then "Close"

3. **Test Protected Endpoints:**
   - All protected endpoints now have the JWT token attached automatically
   - Try creating a stock: `POST /api/v1/stocks`
   - Try getting all users: `GET /api/v1/users`
   - Try creating a currency: `POST /api/v1/currency`

### Swagger Features

- **Schemas Tab:** View all DTOs (CreateStockDto, UpdateUserDto, etc.)
- **Persist Authorization:** Your JWT token persists even after page refresh
- **Error Responses:** See example error responses for each status code
- **Validation:** Swagger shows validation rules for all fields
- **Examples:** Pre-filled examples for all request bodies

---

**Documentation Version:** 1.0.0
**API Version:** v1
**Server:** http://localhost:3000
**Swagger UI:** http://localhost:3000/api/docs
**Environment:** Development
