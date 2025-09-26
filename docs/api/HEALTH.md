## GET /health

### Summary
Health check endpoint to verify the server is running.

### Method and URL
- GET `/health`

### Request
- Headers: none required
- Body: none

### Responses
- 200 OK
  - Body:
    ```json
    { "status": "OK" }
    ```

### Example
```bash
curl -s http://localhost:8085/health
```


