## Post Question

### Endpoint: `/api/question`
**Method**: `POST`  
**Description**: Creates a new question.

### Request Body
- `title` (string): The title of the question (required).
- `description` (string): The description of the question (required).

### Example Request
```json
{
  "title": "How to improve database performance?",
  "description": "I need tips on optimizing SQL queries and indexing strategies."
}
Successful Response
Status Code: 201 Created

Content-Type: application/json

Response Body:

json
{
  "message": "Question created successfully"
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
500 Internal Server Error

Description: An unexpected error occurred.

Response Body:

json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred."
}