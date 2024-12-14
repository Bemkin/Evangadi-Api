## Post Answers for a Question

### Endpoint: `/api/answer`
**Method**: `POST`  
**Description**: Submits an answer for a specific question.

### Request Body
- `questionid` (number): The ID for a specific question (required).
- `answer` (string): The answer for a specific question (required).

### Example Request
```json
{
  "questionid": 1,
  "answer": "This is my answer to the question."
}

Successful Response
Status Code: 201 Created

Content-Type: application/json

Response Body:

json
{
  "message": "Answer posted successfully"
}
Error Responses
400 Bad Request

Description: Missing or invalid fields.

Response Body:

json
{
  "error": "Bad Request",
  "message": "Please provide answer"
}
500 Internal Server Error

Description: An unexpected error occurred.

Response Body:

json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred."
}