## Sign-up

### Endpoint: `/api/user/register`
**Method**: `POST`  
**Description**: Registers a new user.

### Request Body
- `username` (string): The username of the user (required).
- `first_name` (string): The first name of the user (required).
- `last_name` (string): The last name of the user (required).
- `email` (string): The email of the user (required).
- `password` (string): The password of the user (required).

### Example Request
```json
{
  "username": "exampleUser",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "password": "examplePassword"
}

Successful Response
Status Code: 201 Created

Content-Type: application/json

Response Body:

json
{
  "message": "User registered successfully"
}
Error Responses
400 Bad Request

Description: Missing or invalid fields.

Response Body:

json
{
  "error": "Bad Request",
  "message": "Please provide all required fields"
}
Description: Password must be at least 8 characters.

Response Body:

json
{
  "error": "Bad Request",
  "message": "Password must be at least 8 characters"
}
409 Conflict

Description: A user with the provided username or email already exists.

Response Body:

json
{
  "error": "Conflict",
  "message": "User already existed"
}
500 Internal Server Error

Description: An unexpected error occurred.

Response Body:

json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred."
}