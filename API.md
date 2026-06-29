# Backend CRUD API Documentation

The backend service runs on `http://localhost:5000` and serves the following RESTful JSON API endpoints.

---

## Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/todos` | Retrieve all todo items |
| **GET** | `/todos/:id` | Retrieve a single todo item by ID |
| **POST** | `/todos` | Create a new todo item |
| **PUT** | `/todos/:id` | Update an existing todo item by ID |
| **DELETE** | `/todos/:id` | Delete a todo item by ID |

---

## Endpoint Details

### 1. Get All Todos
Retrieves the complete list of saved todo tasks.

* **URL**: `/todos`
* **Method**: `GET`
* **Headers**: `Content-Type: application/json`
* **Success Response (200 OK)**:
  ```json
  [
    {
      "id": 1,
      "title": "Buy groceries",
      "description": "Get milk, bread, and eggs.",
      "status": "Pending",
      "priority": "Medium",
      "dueDate": "2026-07-05",
      "createdDate": "2026-06-28T22:52:10.000Z"
    }
  ]
  ```

---

### 2. Get Todo by ID
Retrieves details for a specific todo task.

* **URL**: `/todos/:id`
* **Method**: `GET`
* **URL Params**: `id=[integer]`
* **Success Response (200 OK)**:
  ```json
  {
    "id": 1,
    "title": "Buy groceries",
    "description": "Get milk, bread, and eggs.",
    "status": "Pending",
    "priority": "Medium",
    "dueDate": "2026-07-05",
    "createdDate": "2026-06-28T22:52:10.000Z"
  }
  ```
* **Error Response (404 Not Found)**:
  ```json
  {
    "error": "Todo with ID 999 not found."
  }
  ```

---

### 3. Create Todo
Creates a new todo task. The `id` and `createdDate` are auto-generated on the server.

* **URL**: `/todos`
* **Method**: `POST`
* **Headers**: `Content-Type: application/json`
* **Request Body Schema**:
  ```json
  {
    "title": "Clean workspace",          // Required (string)
    "description": "Wipe down the desk", // Optional (string)
    "priority": "Low",                   // Optional (string: "Low" | "Medium" | "High", default: "Medium")
    "status": "Pending",                 // Optional (string: "Pending" | "Completed", default: "Pending")
    "dueDate": "2026-06-30"              // Optional (string: "YYYY-MM-DD" or null)
  }
  ```
* **Success Response (201 Created)**:
  ```json
  {
    "id": 4,
    "title": "Clean workspace",
    "description": "Wipe down the desk",
    "priority": "Low",
    "status": "Pending",
    "dueDate": "2026-06-30",
    "createdDate": "2026-06-28T17:31:00.000Z"
  }
  ```
* **Error Response (400 Bad Request)**:
  ```json
  {
    "error": "Title is required and cannot be empty."
  }
  ```

---

### 4. Update Todo
Updates an existing todo task by ID. Performs validation on updated fields.

* **URL**: `/todos/:id`
* **Method**: `PUT`
* **URL Params**: `id=[integer]`
* **Request Body Schema**: Same parameters as POST payload.
* **Success Response (200 OK)**:
  ```json
  {
    "id": 1,
    "title": "Buy organic groceries",
    "description": "Get milk, bread, and eggs.",
    "status": "Completed",
    "priority": "Medium",
    "dueDate": "2026-07-05",
    "createdDate": "2026-06-28T22:52:10.000Z"
  }
  ```
* **Error Responses**:
  * **400 Bad Request**:
    ```json
    {
      "error": "Priority must be one of \"Low\", \"Medium\", or \"High\"."
    }
    ```
  * **404 Not Found**:
    ```json
    {
      "error": "Todo with ID 999 not found."
    }
    ```

---

### 5. Delete Todo
Deletes a todo item by ID.

* **URL**: `/todos/:id`
* **Method**: `DELETE`
* **URL Params**: `id=[integer]`
* **Success Response (200 OK)**:
  ```json
  {
    "message": "Todo deleted successfully.",
    "deletedTodo": {
      "id": 1,
      "title": "Buy groceries",
      "status": "Pending"
    }
  }
  ```
* **Error Response (404 Not Found)**:
  ```json
  {
    "error": "Todo with ID 999 not found."
  }
  ```
