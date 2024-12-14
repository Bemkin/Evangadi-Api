### API Documentation for Evangadi Forum

#### Authentication Middleware

**Endpoint**: `/api/user/checkUser`  
**Method**: `GET`  
**Description**: Checks the current authenticated user's information.

**Request Headers**:
- `Authorization`: `Bearer token` (required)

**Successful Response**:
- **Status Code**: `200 OK`
- **Content-Type**: `application/json`
- **Response Body**:
  ```json
  {
    "message": "Valid user",
    "username": "Kebede",
    "userid": "123"
  }
### Error Responses:

401 Unauthorized

**Status Code**: 401 Unauthorized

**Description**: Authentication credentials were missing or incorrect.

**Response Body**:

```json
{
  "error": "Unauthorized",
  "message": "Authentication invalid"
}