## Get Single Question

### Endpoint: `/api/question/:question_id`
**Method**: `GET`  
**Description**: Retrieves details of a specific question.

### URL Parameters
- `question_id` (integer): The unique identifier of the question.

### Example Request
```http
GET /api/question/1 HTTP/1.1
Host: evangadi-forum.com
Content-Type: application/json
Successful Response
Status Code: 200 OK

Content-Type: application/json

Response Body:

json
{
  "question": {
    "question_id": 1,
    "title": "First Question",
    "content": "This is the first question.",
    "user_id": 123,
    "created_at": "2023-06-30T12:00:00Z"
  }
}
Error Responses
404 Not Found

Description: The specified question was not found.

Response Body:

json
{
  "error": "Not Found",
  "message": "The requested question could not be found."
}
500 Internal Server Error

Description: An unexpected error occurred.

Response Body:

json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred."
}