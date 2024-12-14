Get Answers for a Question
Endpoint: /api/answer/:question_id
Method: GET Description: Retrieves answers for a specific question.

URL Parameters
question_id (integer): The unique identifier of the question.

Example Request
http
GET /api/answer/1 HTTP/1.1
Host: evangadi-forum.com
Content-Type: application/json
Successful Response
Status Code: 200 OK

Content-Type: application/json

Response Body:

json
{
  "answers": [
    {
      "answer_id": 1,
      "content": "This is an answer.",
      "user_name": "Abebe",
      "created_at": "2023-06-30T12:00:00Z"
    },
    {
      "answer_id": 2,
      "content": "This is another answer.",
      "user_name": "Almaz",
      "created_at": "2023-06-30T13:00:00Z"
    }
  ]
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