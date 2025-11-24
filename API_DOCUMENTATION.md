# Drive Assist API Documentation

## Base URL
All API endpoints are prefixed with: `/api/v1`

## Authentication
This API uses Laravel Sanctum for authentication. Include the token in the Authorization header:

```
Authorization: Bearer {your_token}
```

---

## Response Format

All API responses follow a standard JSON format:

### Success Response
```json
{
  "success": true,
  "message": "Success message",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": {}
}
```

### Pagination Response
```json
{
  "success": true,
  "message": "Success message",
  "data": [],
  "pagination": {
    "total": 100,
    "per_page": 15,
    "current_page": 1,
    "last_page": 7,
    "from": 1,
    "to": 15
  }
}
```

---

## Authentication Endpoints

### Register
**POST** `/api/v1/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "user_type": "driver",  // "driver" or "expert"
  "phone": "+1234567890"  // optional
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Registration successful! Please verify your email.",
  "data": {
    "user": {},
    "token": "1|abc123...",
    "token_type": "Bearer"
  }
}
```

---

### Login
**POST** `/api/v1/auth/login`

Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {},
    "token": "1|abc123...",
    "token_type": "Bearer"
  }
}
```

---

### Logout
**POST** `/api/v1/auth/logout`

**Headers:** `Authorization: Bearer {token}`

Revoke the current access token.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Get Current User
**GET** `/api/v1/auth/user`

**Headers:** `Authorization: Bearer {token}`

Get authenticated user information.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "user_type": "driver",
    ...
  }
}
```

---

### Refresh Token
**POST** `/api/v1/auth/refresh-token`

**Headers:** `Authorization: Bearer {token}`

Refresh the access token (revokes old token and issues new one).

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "token": "2|xyz789...",
    "token_type": "Bearer"
  }
}
```

---

## Diagnosis Endpoints

### Get User's Vehicles
**GET** `/api/v1/diagnosis/vehicles`

**Headers:** `Authorization: Bearer {token}`

Get list of user's vehicles for diagnosis form.

**Response:** `200 OK`

---

### Submit Diagnosis
**POST** `/api/v1/diagnosis`

**Headers:**
- `Authorization: Bearer {token}`
- `Content-Type: multipart/form-data`

Submit a new diagnosis for AI analysis.

**Request Body (multipart/form-data):**
```
category: "engine"
description: "Car is making a knocking sound..."
vehicle_make: "Toyota"
vehicle_model: "Camry"
vehicle_year: 2018
mileage: 50000
images[]: [file]
images[]: [file]
voice_note_url: "https://..." (optional)
```

**Response:** `201 Created`

---

### Get Diagnosis History
**GET** `/api/v1/diagnosis`

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `per_page` (optional): Number of items per page (default: 15)
- `page` (optional): Page number

**Response:** `200 OK`

---

### Get Specific Diagnosis
**GET** `/api/v1/diagnosis/{id}`

**Headers:** `Authorization: Bearer {token}`

Get detailed diagnosis with AI results.

**Response:** `200 OK`

---

### Delete Diagnosis
**DELETE** `/api/v1/diagnosis/{id}`

**Headers:** `Authorization: Bearer {token}`

Delete a diagnosis.

**Response:** `200 OK`

---

## Driver Endpoints

All driver endpoints require authentication and driver role.

### Get Dashboard
**GET** `/api/v1/driver/dashboard`

**Headers:** `Authorization: Bearer {token}`

Get driver dashboard data including recent diagnoses, favorite experts, and upcoming reminders.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "recent_diagnoses": [],
    "favorite_experts": [],
    "upcoming_reminders": [],
    "statistics": {
      "total_diagnoses": 5,
      "total_vehicles": 2,
      "pending_reminders": 3
    }
  }
}
```

---

### Vehicle Management

#### Get Vehicles
**GET** `/api/v1/driver/vehicles`

#### Create Vehicle
**POST** `/api/v1/driver/vehicles`

**Request Body:**
```json
{
  "make": "Toyota",
  "model": "Camry",
  "year": 2018,
  "vin": "ABC123...",
  "mileage": 50000,
  "fuel_type": "gasoline",
  "transmission_type": "automatic"
}
```

#### Update Vehicle
**PUT** `/api/v1/driver/vehicles/{id}`

#### Delete Vehicle
**DELETE** `/api/v1/driver/vehicles/{id}`

---

### Favorites Management

#### Get Favorite Experts
**GET** `/api/v1/driver/favorites`

**Query Parameters:**
- `per_page` (optional): Number of items per page (default: 12)

#### Toggle Favorite
**POST** `/api/v1/driver/favorites/{expert_id}/toggle`

Add or remove expert from favorites.

---

### Maintenance Reminders

#### Get Reminders
**GET** `/api/v1/driver/reminders`

**Query Parameters:**
- `status` (optional): "pending" or "completed"
- `per_page` (optional): Number of items per page (default: 15)

#### Create Reminder
**POST** `/api/v1/driver/reminders`

**Request Body:**
```json
{
  "vehicle_id": 1,
  "reminder_type": "oil_change",
  "due_date": "2024-12-31",
  "due_mileage": 60000,
  "description": "Regular oil change"
}
```

#### Mark Reminder as Complete
**POST** `/api/v1/driver/reminders/{id}/complete`

#### Delete Reminder
**DELETE** `/api/v1/driver/reminders/{id}`

---

## Expert Endpoints

### Get All Experts (Public)
**GET** `/api/v1/experts`

Get list of verified experts.

**Query Parameters:**
- `latitude` (optional): User's latitude
- `longitude` (optional): User's longitude
- `radius` (optional): Search radius in km (default: 25)
- `specialty` (optional): Filter by specialty
- `min_rating` (optional): Minimum rating (1-5)
- `open_now` (optional): Filter by currently open (boolean)
- `per_page` (optional): Number of items per page (default: 12)

**Response:** `200 OK`

---

### Get Expert Details (Public)
**GET** `/api/v1/experts/{id}`

Get detailed information about a specific expert.

**Response:** `200 OK`

---

### Contact Expert (Public/Authenticated)
**POST** `/api/v1/experts/{id}/contact`

Send a message to an expert (creates a lead).

**Request Body:**
```json
{
  "diagnosis_id": 1,
  "driver_name": "John Doe",
  "driver_email": "john@example.com",
  "driver_phone": "+1234567890",
  "message": "I need help with...",
  "preferred_contact_method": "phone",
  "best_time_to_contact": "Morning"
}
```

**Response:** `201 Created`

---

### Expert Dashboard (Authenticated Expert)
**GET** `/api/v1/expert/dashboard`

**Headers:** `Authorization: Bearer {token}`

Get expert dashboard data.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "profile": {},
    "statistics": {
      "total_jobs": 50,
      "avg_rating": 4.8,
      "profile_views": 1200,
      "new_leads_count": 5,
      "active_jobs_count": 3,
      "total_reviews": 45
    },
    "recent_leads": [],
    "recent_reviews": []
  }
}
```

---

### Update Expert Profile
**PUT** `/api/v1/expert/profile`

**Headers:** `Authorization: Bearer {token}`

Update expert profile information.

**Request Body:**
```json
{
  "business_name": "Joe's Auto Shop",
  "business_type": "mechanic",
  "bio": "Professional mechanic...",
  "years_experience": 10,
  "hourly_rate_min": 75,
  "hourly_rate_max": 150,
  "accepts_emergency": true
}
```

---

### Get Expert Leads
**GET** `/api/v1/expert/leads`

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `status` (optional): Filter by lead status
- `per_page` (optional): Number of items per page (default: 15)

---

### Get Expert Reviews
**GET** `/api/v1/expert/reviews`

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `per_page` (optional): Number of items per page (default: 15)

---

## Educational Resources Endpoints (Public)

### Car Issues

#### Get Car Issues
**GET** `/api/v1/resources/car-issues`

**Query Parameters:**
- `search` (optional): Search term
- `category` (optional): Filter by category
- `severity` (optional): Filter by severity
- `sort` (optional): Sort by "popular", "recent", "views", "helpful"
- `per_page` (optional): Number of items per page (default: 12)

**Response:** `200 OK`

---

#### Get Specific Car Issue
**GET** `/api/v1/resources/car-issues/{slug}`

Get detailed information about a specific car issue.

**Response:** `200 OK`

---

#### Mark Car Issue as Helpful
**POST** `/api/v1/resources/car-issues/{id}/helpful`

**Request Body:**
```json
{
  "helpful": true  // true for helpful, false for not helpful
}
```

---

### Road Signs

#### Get Road Signs
**GET** `/api/v1/resources/road-signs`

**Query Parameters:**
- `search` (optional): Search term
- `category` (optional): Filter by category
- `sort` (optional): Sort by "popular" or "name"
- `per_page` (optional): Number of items per page (default: 12)

**Response:** `200 OK`

---

#### Get Specific Road Sign
**GET** `/api/v1/resources/road-signs/{slug}`

Get detailed information about a specific road sign.

**Response:** `200 OK`

---

## Error Codes

- `200` - Success
- `201` - Resource created successfully
- `204` - No content (successful deletion)
- `400` - Bad request
- `401` - Unauthorized (invalid or missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Resource not found
- `422` - Validation error
- `500` - Internal server error

---

## Rate Limiting

API requests are rate limited. Check response headers for rate limit information:
- `X-RateLimit-Limit`: Maximum requests per minute
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Unix timestamp when the limit resets

---

## Testing the API

### Using cURL

```bash
# Register
curl -X POST http://localhost/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "user_type": "driver"
  }'

# Login
curl -X POST http://localhost/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Get user info (use token from login)
curl -X GET http://localhost/api/v1/auth/user \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman

1. Import the API endpoints
2. Set up an environment variable for `base_url`: `http://localhost/api/v1`
3. Set up an environment variable for `token` after login
4. Use `{{base_url}}` and `Bearer {{token}}` in your requests

---

## Notes

- All dates are in ISO 8601 format
- All timestamps are in UTC
- File uploads should use `multipart/form-data` encoding
- Maximum file upload size: 5MB per image
- Supported image formats: JPEG, PNG, WebP
