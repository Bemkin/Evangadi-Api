## Login

### Endpoint: `/api/user/login`
**Method**: `POST`  
**Description**: Authenticates a user and returns a JWT token.

### Request Body
- `email` (string): The email of the user (required).
- `password` (string): The password of the user (required).

### Example Request
```json
{
  "email": "john.doe@example.com",
  "password": "examplePassword"
}
Successful Response
Status Code: 200 OK

Content-Type: application/json

Response Body:

json
{
  "message": "User login successful",
  "token": "jwt_token"
}
Error Responses
401 Unauthorized

Description: Invalid credentials.

Response Body:

json
{
  "error": "Unauthorized",
  "message": "Invalid username or password"
}
400 Bad Request

Description: Missing or invalid fields.

Response Body:

json
{
  "error": "Bad Request",
  "message": "Please provide all required fields"
}
500 Internal Server Error

Description: An unexpected error occurred.

Response Body:

json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred."
}