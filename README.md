# Starwest E-commerce API

A REST API for e-commerce built with JavaScript and Express.js that provides JWT authentication and checkout functionality with payment method rules.

## Description

This API allows users to:
- Login with email and password to receive a JWT token
- Browse available products
- Perform authenticated checkout with different payment methods
- Get automatic discounts for cash payments

The API follows a clean architecture with organized folders for Routes, Middleware, Controllers, Services, and Models. All data is stored in memory (no database required).

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd starwest-tutorial
```

2. Install dependencies:
```bash
npm install
```

## How to Run

1. Start the server:
```bash
npm start
```

2. For development with auto-restart:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## Rules

### Authentication
- Users must login to receive a JWT token
- JWT tokens are required for protected endpoints (checkout)
- Tokens expire after 24 hours

### Checkout Rules
- **Payment Methods**: Only `cash` or `credit_card` are accepted
- **Cash Discount**: Cash payments receive a 10% discount automatically
- **Authentication**: Only authenticated users can perform checkout
- **Stock Validation**: Products must be in stock before checkout
- **Automatic Stock Update**: Product stock is automatically reduced after successful checkout

## Data Already Existent

### Users (3 default users)
| ID | Email | Password | Name |
|----|-------|----------|------|
| 1 | john.doe@example.com | password123 | John Doe |
| 2 | jane.smith@example.com | password123 | Jane Smith |
| 3 | bob.johnson@example.com | password123 | Bob Johnson |

### Products (3 default products)
| ID | Name | Description | Price | Stock |
|----|------|-------------|-------|-------|
| 1 | Wireless Headphones | High-quality wireless headphones with noise cancellation | $199.99 | 50 |
| 2 | Smart Watch | Advanced smartwatch with fitness tracking and notifications | $299.99 | 30 |
| 3 | Laptop Stand | Adjustable aluminum laptop stand for ergonomic workspace | $89.99 | 100 |

## How to Use the REST API

### Base URL
```
http://localhost:3000
```

### API Documentation
Visit `http://localhost:3000/api-docs` for interactive Swagger documentation.

### Endpoints

#### 1. Login (Get JWT Token)
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "john.doe@example.com",
      "name": "John Doe",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### 2. Get All Products
```http
GET /api/products
```

**Response:**
```json
{
  "message": "Products retrieved successfully",
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Wireless Headphones",
        "description": "High-quality wireless headphones with noise cancellation",
        "price": 199.99,
        "stock": 50,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

#### 3. Get Product by ID
```http
GET /api/products/1
```

#### 4. Get User Profile (Protected)
```http
GET /api/auth/profile
Authorization: Bearer <your-jwt-token>
```

#### 5. Checkout (Protected)
```http
POST /api/checkout
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 2,
      "quantity": 1
    }
  ],
  "paymentMethod": "cash"
}
```

**Response (Cash with 10% discount):**
```json
{
  "message": "Checkout completed successfully",
  "data": {
    "order": {
      "id": 1704067200000,
      "userId": 1,
      "items": [...],
      "paymentMethod": "cash",
      "subtotal": 699.97,
      "discount": 10,
      "discountAmount": 69.997,
      "total": 629.97,
      "stockUpdateResults": [...],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Authentication Header Format
For protected endpoints, include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Example Usage Flow

1. **Login** to get a JWT token
2. **Browse products** to see what's available
3. **Perform checkout** with your token, items, and payment method

### Error Responses
All endpoints return consistent error responses:
```json
{
  "error": "Error Type",
  "message": "Detailed error message"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created (checkout)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `404` - Not Found
- `500` - Internal Server Error

## Project Structure

```
src/
├── controllers/          # Request handlers
│   ├── authController.js
│   ├── productController.js
│   └── checkoutController.js
├── middleware/           # Custom middleware
│   └── auth.js
├── models/              # Data models
│   ├── User.js
│   └── Product.js
├── routes/              # API routes
│   ├── auth.js
│   ├── products.js
│   └── checkout.js
├── services/            # Business logic
│   ├── authService.js
│   ├── productService.js
│   └── checkoutService.js
└── server.js            # Main server file

docs/
└── swagger.yaml         # API documentation
```
