## Todo Item Endpoints

Base path: `/api/todo/:id`

### DELETE /api/todo/:id
Deletes a todo by id.

#### Path params
- `id` (string): Todo identifier (MongoDB ObjectId as string)

#### Responses
- 200 OK (deleted)
- 406 Not Acceptable (not deleted)

### PATCH /api/todo/:id
Partially updates a todo by id.

#### Path params
- `id` (string): Todo identifier (MongoDB ObjectId as string)

#### Request
- Headers:
  - `Content-Type: application/json`
- Body: any subset of fields below
  ```json
  {
    "description": "New text",
    "priority": "medium",
    "isDone": true
  }
  ```

Notes:
- In the database, `isDone` maps to `status`.

#### Responses
- 200 OK (updated)
- 406 Not Acceptable (not updated)


