# Drive Assist API Testing Guide

## 🎯 Overview

This guide helps you test the Drive Assist API using both **Swagger UI** and **Postman**.

---

## 📚 Swagger/OpenAPI Documentation

### Accessing Swagger UI

Once your Laravel server is running, access the interactive API documentation at:

```
http://localhost/api/documentation
```

### Features

- **Interactive Testing**: Test API endpoints directly from your browser
- **Request/Response Examples**: See example requests and responses for each endpoint
- **Authentication**: Use the "Authorize" button to set your Bearer token
- **Schema Validation**: View request and response schemas

### How to Use Swagger UI

1. **Start Your Server**
   ```bash
   php artisan serve
   ```

2. **Navigate to Swagger UI**
   ```
   http://localhost:8000/api/documentation
   ```

3. **Authenticate (for protected endpoints)**
   - Click the "Authorize" button (🔒) at the top right
   - Enter your token in the format: `Bearer YOUR_TOKEN_HERE`
   - Click "Authorize"
   - Click "Close"

4. **Test an Endpoint**
   - Expand any endpoint (e.g., POST /auth/login)
   - Click "Try it out"
   - Fill in the request body/parameters
   - Click "Execute"
   - View the response below

### Regenerating Documentation

If you make changes to the API annotations, regenerate the documentation:

```bash
php artisan l5-swagger:generate
```

---

## 📮 Postman Collection

### Files Included

1. **`Drive_Assist_API.postman_collection.json`** - Complete API collection with 40+ endpoints
2. **`Drive_Assist_API.postman_environment.json`** - Environment variables for local testing

### Importing into Postman

#### Step 1: Import Collection

1. Open Postman
2. Click **"Import"** button (top left)
3. Select **"File"** tab
4. Navigate to your project directory
5. Select `Drive_Assist_API.postman_collection.json`
6. Click **"Import"**

#### Step 2: Import Environment

1. Click **"Import"** again
2. Select `Drive_Assist_API.postman_environment.json`
3. Click **"Import"**

#### Step 3: Select Environment

1. In the top-right corner, click the environment dropdown
2. Select **"Drive Assist - Local"**

### Using the Collection

#### Authentication Flow

The collection includes automatic token management:

1. **Register or Login**
   - Go to **Authentication** → **Login** (or Register)
   - Send the request
   - The token will automatically be saved to `{{auth_token}}`

2. **Use Protected Endpoints**
   - All authenticated endpoints use the saved token automatically
   - No need to manually copy/paste tokens

#### Collection Structure

```
Drive Assist API v1
├── Authentication
│   ├── Register
│   ├── Login
│   ├── Get Current User
│   ├── Refresh Token
│   └── Logout
│
├── Diagnosis
│   ├── Get Vehicles
│   ├── Submit Diagnosis
│   ├── Get Diagnosis History
│   ├── Get Specific Diagnosis
│   └── Delete Diagnosis
│
├── Driver
│   ├── Get Dashboard
│   ├── Vehicles (CRUD operations)
│   ├── Favorites
│   └── Maintenance Reminders
│
├── Expert
│   ├── Public (Get Experts, Details, Contact)
│   ├── Get Dashboard
│   ├── Update Profile
│   ├── Get Leads
│   └── Get Reviews
│
└── Resources
    ├── Car Issues (Get, Details, Mark Helpful)
    └── Road Signs (Get, Details)
```

### Environment Variables

The environment includes these pre-configured variables:

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `base_url` | API base URL | `http://localhost/api/v1` |
| `auth_token` | Authentication token | (auto-filled on login) |
| `user_email` | Test user email | `john@example.com` |
| `user_password` | Test user password | `password123` |

### Updating Base URL

If your server runs on a different port:

1. Click the environment dropdown
2. Select **"Drive Assist - Local"**
3. Click the eye icon (👁️) to view variables
4. Click **"Edit"**
5. Update `base_url` (e.g., `http://localhost:8000/api/v1`)
6. Save

---

## 🧪 Testing Workflow

### 1. Start the Application

```bash
# Start Laravel server
php artisan serve

# Or if using Docker/Sail
./vendor/bin/sail up
```

### 2. Test Authentication

#### Using Swagger:
1. Go to `http://localhost:8000/api/documentation`
2. Try POST `/auth/register` or `/auth/login`
3. Copy the token from the response
4. Click "Authorize" and paste: `Bearer {token}`

#### Using Postman:
1. Send **Authentication → Login** request
2. Token is automatically saved
3. All other requests now use this token

### 3. Test Diagnosis Flow

#### Using Postman:

```
1. Diagnosis → Submit Diagnosis
   - Upload images (optional)
   - Add vehicle info
   - Add description

2. Diagnosis → Get Diagnosis History
   - View all your diagnoses

3. Diagnosis → Get Specific Diagnosis
   - View AI analysis results
```

### 4. Test Driver Features

```
1. Driver → Get Dashboard
   - View overview

2. Driver → Vehicles → Create Vehicle
   - Add a vehicle

3. Driver → Maintenance Reminders → Create Reminder
   - Set up a reminder

4. Driver → Favorites → Toggle Favorite
   - Favorite an expert
```

### 5. Test Expert Features

```
1. Expert → Get Dashboard
   - View expert stats

2. Expert → Update Profile
   - Update business info

3. Expert → Get Leads
   - View customer inquiries
```

### 6. Test Public Resources

```
1. Resources → Car Issues → Get Car Issues
   - Browse car problems
   - No authentication required

2. Resources → Road Signs → Get Road Signs
   - Browse road signs
   - No authentication required
```

---

## 🔐 Authentication Examples

### cURL Example

```bash
# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Use token in subsequent requests
curl -X GET http://localhost:8000/api/v1/auth/user \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### JavaScript Example

```javascript
// Login
const response = await fetch('http://localhost:8000/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
});

const data = await response.json();
const token = data.data.token;

// Use token
const userResponse = await fetch('http://localhost:8000/api/v1/auth/user', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## 📊 Response Format

All API responses follow this standard format:

### Success Response

```json
{
  "success": true,
  "message": "Success message",
  "data": {
    // Response data here
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    // Validation errors or error details
  }
}
```

### Paginated Response

```json
{
  "success": true,
  "message": "Success message",
  "data": [
    // Array of items
  ],
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

## 🚀 Quick Start Checklist

- [ ] Laravel server is running
- [ ] Imported Postman collection
- [ ] Imported Postman environment
- [ ] Selected "Drive Assist - Local" environment in Postman
- [ ] Registered a test user or logged in
- [ ] Token is automatically saved in Postman
- [ ] Tested a protected endpoint (e.g., Get Dashboard)
- [ ] Accessed Swagger UI at `/api/documentation`

---

## 🐛 Troubleshooting

### Issue: "Unauthenticated" Error

**Solution:**
- Check if token is set in Postman environment
- Ensure token format is: `Bearer {token}` (not just the token)
- Token may have expired - login again

### Issue: "Validation failed" Error

**Solution:**
- Check request body matches the expected format
- Review Swagger documentation for required fields
- Check data types (string vs number)

### Issue: Cannot access Swagger UI

**Solution:**
- Ensure server is running: `php artisan serve`
- Clear cache: `php artisan config:clear`
- Regenerate docs: `php artisan l5-swagger:generate`
- Access at: `http://localhost:8000/api/documentation`

### Issue: CORS errors in browser

**Solution:**
- This is normal for web browsers
- Use Postman or configure CORS in `config/cors.php`
- For mobile apps, CORS is not an issue

---

## 📝 Notes

- **Base URL**: All routes are prefixed with `/api/v1`
- **Token Expiration**: Tokens don't expire by default with Sanctum
- **Rate Limiting**: API endpoints may have rate limiting enabled
- **File Uploads**: Use `multipart/form-data` for diagnosis images
- **Pagination**: Most list endpoints support `per_page` parameter

---

## 📞 Support

For issues or questions:
- Check `API_DOCUMENTATION.md` for detailed endpoint documentation
- Review Laravel logs: `storage/logs/laravel.log`
- Check database connections and migrations

---

## 🎉 Happy Testing!

You now have everything you need to test the Drive Assist API using both Swagger and Postman!
