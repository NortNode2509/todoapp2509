## Todo Collection Endpoints

Base path: `/api/todo`

### GET /api/todo
Returns the list of todos.

#### Response
- 200 OK
  - Body: Array of objects
    ```json
    [
      {
        "id": "68d6b6ee5c421870cfd6a30b",
        "description": "Buy milk",
        "priority": "high",
        "isDone": false
      }
    ]
    ```

### POST /api/todo
Creates a new todo.

#### Request
- Headers:
  - `Content-Type: application/json`
- Body:
  ```json
  {
    "description": "Buy milk",
    "priority": "high",
    "isDone": false
  }
  ```

#### Responses
- 201 Created (no body)
- 400 Bad Request (if body is invalid)


