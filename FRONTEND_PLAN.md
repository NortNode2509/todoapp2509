## Frontend Implementation Plan: Todo List with Bootstrap Grid

### Context
- **Entry point**: `public/index.html` (serves the frontend)
- **API base**: Server routes are defined in `api.js`
  - `GET /todo` → returns a list of todos as `{ id, description, priority, isDone }`
  - `POST /todo` → creates a todo using `{ description, priority, isDone }`
  - `DELETE /todo/:id` → deletes a todo by `id`

### Goal
Render the list of todo tasks on the front page using Bootstrap rows and columns, loading data from the API.

### Deliverables
1. A visible list on the front page laid out with Bootstrap grid: a header row (Description, Priority, Status, Actions) and one Bootstrap row per todo. Task IDs are not displayed.
2. Data is fetched from `GET /todo` on page load and rendered.
3. Loading and error states are handled and shown to the user.
4. Optional interactions: delete an item from the table and add a new item via a simple form.

### Implementation Steps
1. Structure the frontend assets
   - Add a `public/app.js` for frontend logic.
   - Optionally add `public/styles.css` for small custom styles.
   - Ensure `public/index.html` includes:
     - Bootstrap CSS CDN link in `<head>`
     - `<script src="./app.js" defer></script>` at the end of `<body>`
     - Optional: Bootstrap JS bundle CDN (for components if needed; not required for grid)

2. Markup updates in `public/index.html`
   - Add container elements using Bootstrap:
     - A top-level `.container` wrapper.
     - A status area for loading and error messages (e.g., `.alert` placeholders, `aria-live="polite"`).
     - A header row (`.row.fw-bold`) with four columns (`.col-*`) for: Description, Priority, Status, Actions.
     - A list container (e.g., `<div id="todo-list" class="mt-2"></div>`) where each todo will be rendered as a `.row` with four `.col-*` children matching the header.
   - Optional: a small form (description, priority, isDone) styled with Bootstrap form classes to add a new todo.

3. Data fetching
   - On DOMContentLoaded, call `fetch('/todo')`.
   - Parse JSON response and validate array shape.
   - Handle non-200 responses and network errors with a visible error message.
   - Show a loading indicator while the request is in-flight.

4. Rendering logic
   - Clear the `#todo-list` container before rendering.
   - For each todo `{ id, description, priority, isDone }`, render a `.row` containing four `.col` elements:
     - Column 1: Description (text)
     - Column 2: Priority (text)
     - Column 3: Status ("Done" / "Not done")
     - Column 4: Actions (a Bootstrap-styled Delete button; optional in first iteration)
   - Do not display the `id` in the UI; keep it in memory or as a `data-*` attribute on the row or button for actions.
   - If there are zero items, render an empty-state `.row` with a single `.col` spanning full width with a muted message.

5. Delete interaction (optional, can be v2)
   - On Delete button click, call `fetch('/todo/${id}', { method: 'DELETE' })`.
   - On success (HTTP 200), remove the row from the DOM or re-fetch list.
   - On failure (HTTP 406 or error), show an error toast/message.

6. Add interaction (optional, can be v2)
   - On form submit, serialize fields to `{ description, priority, isDone }`.
   - POST to `/todo` with `Content-Type: application/json` and a JSON body.
   - On success (HTTP 201), clear form and re-fetch list.
   - On failure, show an error message.

7. UX and accessibility
   - Keyboard-focusable buttons and form controls.
   - Use Bootstrap classes for clear hierarchy; ensure header row uses `role="row"` and columns use `role="cell"` if additional semantics are desired.
   - Announce loading and errors in a status region (`aria-live="polite"`).

8. Styling (lightweight)
   - Leverage Bootstrap grid and utilities (e.g., spacing, typography, `text-muted`, `fw-bold`).
   - Visual states for loading and errors using Bootstrap alerts (e.g., `.alert-warning`, `.alert-danger`).

9. Testing and verification
   - Manual test: with non-empty and empty datasets.
   - Verify error handling by simulating network failure (e.g., stop server) or forcing a non-200.
   - Verify DELETE and POST flows if implemented.

10. Performance considerations
   - Use a single render pass per fetch (build rows using DocumentFragment to avoid layout thrash).
   - Keep JS minimal; no framework required for current scope.

### Acceptance Criteria
- On page load, the app fetches todos from `/todo` and displays them as Bootstrap rows with columns for Description, Priority, Status, Actions (no IDs shown).
- Loading state is visible until data appears.
- Errors are presented clearly without breaking layout.
- Columns accurately reflect `{ description, priority, isDone }`.
- Optional: Delete removes an item from the list; Add creates an item and updates the list.

### Future Enhancements (out of scope for initial delivery)
- Edit inline and toggle `isDone` without full reload.
- Client-side sorting and filtering.
- Persisted user preferences (e.g., sort order).
- Basic e2e test with Playwright or Cypress.


### PATCH Endpoint Flow (Description + Mermaid Diagram)
When the user toggles a task's `isDone` state in the frontend, the app sends a `PATCH /api/todo/:id` request containing `{ isDone: boolean }`. The Express route in `api.js` maps `isDone` to the database field `status` and calls `updateTodo(id, { status })` in `model/model.js`. The model updates only the provided fields in MongoDB. The endpoint returns 200 on success, 406 on failure.

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as Frontend (public/app.js)
    participant A as API Router (api.js)
    participant M as Model (model/model.js)
    participant DB as MongoDB

    U->>F: Toggle isDone checkbox
    F->>A: PATCH /api/todo/:id { isDone }
    A->>A: Map isDone -> status
    A->>M: updateTodo(id, { status })
    M->>DB: updateOne({_id}, {$set: {status}})
    DB-->>M: matchedCount/modifiedCount
    M-->>A: updateSuccessful (boolean)
    A-->>F: 200 OK (if success) or 406 (if failure)
    F->>F: Optimistically update UI; revert on error
```


