## Get All Questions

### Endpoint: `/api/question`
**Method**: `GET`  
**Description**: Fetches all questions.

### Example Request
```http
GET /api/question HTTP/1.1
Host: evangadi-forum.com
Content-Type: application/json
Successful Response
Status Code: 200 OK

Content-Type: application/json

Response Body:

json
{
  "questions": [
    {
      "question_id": 1,
      "title": "First Question",
      "content": "This is the first question.",
      "user_name": "Sisay",
      "created_at": "2023-06-30T12:00:00Z"
    },
    {
      "question_id": 2,
      "title": "Second Question",
      "content": "This is the second question.",
      "user_name": "Sara",
      "created_at": "2023-06-30T13:00:00Z"
    }
  ]
}
Error Responses
404 Not Found

Description: No questions found.

Response Body:

json
{
  "error": "Not Found",
  "message": "No questions found."
}
500 Internal Server Error

Description: An unexpected error occurred.

Response Body:

json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred."
}