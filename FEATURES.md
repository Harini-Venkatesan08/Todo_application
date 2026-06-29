# Application Features

This document details the feature implementations for both the frontend and backend components of the Todo application.

## Frontend Features

### 1. Todo List Page (Main Routing `/`)
- **Display List**: Displays all active todo cards retrieved from the backend API.
- **Add Todo**: Triggers an overlay modal form to configure:
  - Title (Required)
  - Description (Optional)
  - Priority (Low, Medium, High)
  - Status (Pending, Completed)
  - Due Date
- **Edit Todo**: Clicking "Edit" on a card populates the overlay modal with that todo's properties, allowing full modification.
- **Delete Todo**: Prompts a browser confirmation alert and, if approved, deletes the record via the backend.
- **Toggle Completion Status**: Clicking the checkbox immediately switches status between `Pending` and `Completed` and updates the backend.
- **In-Memory Search**: Real-time filtering matching user input against both the `title` and `description` of all tasks.
- **Filter Controls**: Buttons to quickly filter todos by:
  - **All**: Displays all tasks.
  - **Completed**: Tasks with status set to `Completed`.
  - **Pending**: Tasks with status set to `Pending`.

### 2. Todo Details Page (Routing `/todo?id=:id`)
- **Query Parameter Matching**: Reads the query string using the `useSearchParams` React Router hook.
- **Individual Detail Retrieval**: Performs a focused `GET /todos/:id` API call on component mount to retrieve parameters.
- **Extended Task Parameters**: Displays title, priority badge, description, status badge, due date, and created date timestamp.
- **Back Navigation**: Includes a standard routing navigation link to return to the list view (`/`).

---

## Backend Features

### 1. File Database Storage
- Persists all todo data inside the `todos.json` file.
- Reads and updates the storage synchronously using Node `fs` APIs, ensuring data integrity.
- Automatically initializes with an empty array if the file is deleted or does not exist.

### 2. Validation & Security
- Configured with `cors` middleware to allow the frontend client to query endpoints.
- Custom `validateTodo` middleware intercepts write actions (`POST` and `PUT` requests) to ensure:
  - `title` is a non-empty string.
  - `status` is either `Pending` or `Completed`.
  - `priority` is either `Low`, `Medium`, or `High`.
  - `dueDate` (if specified) is a valid date string.
- ID indexing automatically manages integer IDs starting at `1` using a basic `Math.max` increment mechanism.
