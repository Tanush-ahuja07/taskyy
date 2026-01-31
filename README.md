# Global Trend Task Management - Backend API Documentation

## 📋 Table of Contents
- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Tasks](#tasks)
- [Data Models](#data-models)
- [Error Handling](#error-handling)

---

## 🔍 Overview

This is a RESTful API for a Task Management System built with Node.js, Express, and MongoDB. It provides user authentication and CRUD operations for task management with JWT-based authorization.

**Base URL:** `http://localhost:5000/api`

---

## 🛠 Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Environment Variables:** dotenv
- **CORS:** cors middleware

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Global Trend(Task M)/server"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file in the server directory**
   ```env
   PORT=5000
   MONGO_URL=mongodb://localhost:27017/taskmanager
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. **Start the server**
   ```bash
   npm start
   ```

   The server will run on `http://localhost:5000`

---

## 🔐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port number | `5000` |
| `MONGO_URL` | MongoDB connection string | `mongodb://localhost:27017/taskmanager` |
| `JWT_SECRET` | Secret key for JWT signing | `your_secret_key_123` |

---

## 📡 API Endpoints

### Authentication

#### 1. Register User

**Endpoint:** `POST /api/auth/register`

**Description:** Register a new user account

**Headers:** None required

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation Rules:**
- All fields are required
- Password must be at least 6 characters
- Email must be unique

**Success Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**

| Status Code | Message | Reason |
|-------------|---------|--------|
| `400` | `All fields are required` | Missing name, email, or password |
| `400` | `Password must be at least 6 characters` | Password too short |
| `400` | `User already exists` | Email already registered |
| `500` | `Error registering user` | Server error |

---

#### 2. Login User

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticate user and receive JWT token

**Headers:** None required

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**

| Status Code | Message | Reason |
|-------------|---------|--------|
| `400` | `Email and password are required` | Missing credentials |
| `401` | `Invalid credentials` | Wrong email or password |
| `500` | `Error logging in` | Server error |

---

#### 3. Get User Profile

**Endpoint:** `GET /api/auth/profile`

**Description:** Get authenticated user's profile (protected route)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200 OK):**
```json
{
  "message": "Protected profile route accessed",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-01-31T10:00:00.000Z",
    "updatedAt": "2026-01-31T10:00:00.000Z"
  }
}
```

**Error Responses:**

| Status Code | Message | Reason |
|-------------|---------|--------|
| `401` | `Access denied. No token provided` | Missing authorization header |
| `401` | `Invalid token` | Invalid or expired JWT token |

---

### Tasks

> **Note:** All task endpoints require authentication. Include the JWT token in the Authorization header:
> ```
> Authorization: Bearer <your_jwt_token>
> ```

---

#### 4. Get All Tasks

**Endpoint:** `GET /api/tasks`

**Description:** Retrieve all tasks for the authenticated user (sorted by newest first)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "status": "in-progress",
    "user": "507f1f77bcf86cd799439012",
    "createdAt": "2026-01-31T10:00:00.000Z",
    "updatedAt": "2026-01-31T11:30:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439013",
    "title": "Review pull requests",
    "description": "",
    "status": "pending",
    "user": "507f1f77bcf86cd799439012",
    "createdAt": "2026-01-30T09:00:00.000Z",
    "updatedAt": "2026-01-30T09:00:00.000Z"
  }
]
```

**Error Responses:**

| Status Code | Message | Reason |
|-------------|---------|--------|
| `401` | `Access denied. No token provided` | Missing authorization header |
| `401` | `Invalid token` | Invalid or expired JWT token |
| `500` | `Error fetching tasks` | Server error |

---

#### 5. Create Task

**Endpoint:** `POST /api/tasks`

**Description:** Create a new task for the authenticated user

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "status": "pending"
}
```

**Field Requirements:**
- `title` (required): String, task title
- `description` (optional): String, task details (default: "")
- `status` (optional): String, one of ["pending", "in-progress", "completed"] (default: "pending")

**Success Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "status": "pending",
  "user": "507f1f77bcf86cd799439012",
  "createdAt": "2026-01-31T10:00:00.000Z",
  "updatedAt": "2026-01-31T10:00:00.000Z"
}
```

**Error Responses:**

| Status Code | Message | Reason |
|-------------|---------|--------|
| `400` | `Title is required` | Missing title field |
| `401` | `Access denied. No token provided` | Missing authorization header |
| `401` | `Invalid token` | Invalid or expired JWT token |
| `500` | `Error creating task` | Server error |

---

#### 6. Get Single Task

**Endpoint:** `GET /api/tasks/:id`

**Description:** Get a specific task by ID (must belong to authenticated user)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**URL Parameters:**
- `id` (required): Task ID

**Success Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "status": "in-progress",
    "user": "507f1f77bcf86cd799439012",
    "createdAt": "2026-01-31T10:00:00.000Z",
    "updatedAt": "2026-01-31T11:30:00.000Z"
  }
]
```

**Error Responses:**

| Status Code | Message | Reason |
|-------------|---------|--------|
| `401` | `Access denied. No token provided` | Missing authorization header |
| `401` | `Invalid token` | Invalid or expired JWT token |
| `500` | `Error fetching tasks` | Server error |

---

#### 7. Update Task

**Endpoint:** `PUT /api/tasks/:id`

**Description:** Update an existing task (must belong to authenticated user)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**URL Parameters:**
- `id` (required): Task ID

**Request Body (all fields optional):**
```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "status": "completed"
}
```

**Success Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Updated task title",
  "description": "Updated description",
  "status": "completed",
  "user": "507f1f77bcf86cd799439012",
  "createdAt": "2026-01-31T10:00:00.000Z",
  "updatedAt": "2026-01-31T12:00:00.000Z"
}
```

**Error Responses:**

| Status Code | Message | Reason |
|-------------|---------|--------|
| `401` | `Access denied. No token provided` | Missing authorization header |
| `401` | `Invalid token` | Invalid or expired JWT token |
| `404` | `Task not found` | Task doesn't exist or doesn't belong to user |
| `500` | `Error updating task` | Server error |

---

#### 8. Delete Task

**Endpoint:** `DELETE /api/tasks/:id`

**Description:** Delete a task (must belong to authenticated user)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**URL Parameters:**
- `id` (required): Task ID

**Success Response (200 OK):**
```json
{
  "message": "Task deleted successfully"
}
```

**Error Responses:**

| Status Code | Message | Reason |
|-------------|---------|--------|
| `401` | `Access denied. No token provided` | Missing authorization header |
| `401` | `Invalid token` | Invalid or expired JWT token |
| `404` | `Task not found` | Task doesn't exist or doesn't belong to user |
| `500` | `Error deleting task` | Server error |

---

## 📊 Data Models

### User Model

```javascript
{
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: Date,  // Auto-generated
  updatedAt: Date   // Auto-generated
}
```

### Task Model

```javascript
{
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending"
  },
  user: {
    type: ObjectId,
    ref: "User",
    required: true
  },
  createdAt: Date,  // Auto-generated
  updatedAt: Date   // Auto-generated
}
```

---

## ⚠️ Error Handling

### Common HTTP Status Codes

| Status Code | Meaning |
|-------------|---------|
| `200` | OK - Request successful |
| `201` | Created - Resource created successfully |
| `400` | Bad Request - Invalid input or validation error |
| `401` | Unauthorized - Authentication required or failed |
| `404` | Not Found - Resource doesn't exist |
| `500` | Internal Server Error - Server-side error |

### Error Response Format

All error responses follow this structure:

```json
{
  "message": "Error description",
  "error": "Detailed error message (in development)"
}
```

---

## 🔒 Authentication Flow

1. **Register** or **Login** to receive a JWT token
2. Include the token in the `Authorization` header for all protected routes:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. Token expires after 7 days
4. User information is automatically attached to `req.user` in protected routes

---

## 📝 Example Usage

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Create Task:**
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Complete documentation",
    "description": "Write API docs",
    "status": "pending"
  }'
```

**Get All Tasks:**
```bash
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Update Task:**
```bash
curl -X PUT http://localhost:5000/api/tasks/TASK_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "status": "completed"
  }'
```

**Delete Task:**
```bash
curl -X DELETE http://localhost:5000/api/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📁 Project Structure

```
server/
├── controllers/
│   ├── authController.js      # Authentication logic
│   └── taskController.js      # Task CRUD operations
├── middlewares/
│   └── authMiddleware.js      # JWT authentication middleware
├── models/
│   ├── User.js               # User schema
│   └── Task.js               # Task schema
├── routes/
│   ├── authRoutes.js         # Auth endpoints
│   └── taskRoutes.js         # Task endpoints
├── index.js                  # Server entry point
├── package.json              # Dependencies
└── .env                      # Environment variables
```

---

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

## 📄 License

ISC License

---

## 📞 Support

For questions or issues, please open an issue in the repository.

---

**Last Updated:** January 31, 2026
