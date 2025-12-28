# Form Builder Application

A full-stack form builder application built with Next.js and Express, featuring drag-and-drop form creation and MongoDB storage.

## Tech Stack

### Frontend
- **Next.js 16** (App Router)
- **TypeScript**
- **React Form Builder 2** - Drag-and-drop form builder
- **Axios** - HTTP client
- **Bootstrap 4** - UI framework

### Backend
- **Node.js** with **Express 5**
- **MongoDB** with **Mongoose**
- **CORS** enabled
- **Service-Repository Pattern** architecture

## Prerequisites

Before running this project, ensure you have:

- **Node.js** (v18 or higher)
- **MongoDB** (v6 or higher) running locally or connection string ready
- **npm** or **yarn** package manager

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd form-builder-case
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Configure environment variables in `backend/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/formbuilder
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

## Running the Application

### Start Backend Server
```bash
cd backend
npm start
```
Backend will run on **http://localhost:5000**

### Start Frontend Application
```bash
cd frontend
npm run dev
```
Frontend will run on **http://localhost:3000**

## API Endpoints

### Base URL
```
http://localhost:5000/api/forms
```

### Available Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| POST   | `/api/forms` | Create new form | `{ title: string, task_data: array }` |
| GET    | `/api/forms` | Get all forms | - |
| GET    | `/api/forms/:id` | Get form by ID | - |
| PUT    | `/api/forms/:id` | Update form | `{ title: string, task_data: array }` |
| DELETE | `/api/forms/:id` | Delete form | - |

### Example Request
```bash
POST http://localhost:5000/api/forms
Content-Type: application/json

{
  "title": "Contact Form",
  "task_data": [
    {
      "id": "1",
      "element": "TextInput",
      "text": "Name",
      "required": true
    }
  ]
}
```

### Example Response
```json
{
  "success": true,
  "message": "Form created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Contact Form",
    "task_data": [...],
    "createdAt": "2025-12-28T12:00:00.000Z",
    "updatedAt": "2025-12-28T12:00:00.000Z"
  }
}
```

## Project Structure

```
form-builder-case/
├── backend/
│   ├── controllers/        # Request handlers
│   ├── services/          # Business logic layer
│   ├── repositories/      # Data access layer
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   ├── server.js         # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/          # Next.js app router pages
│   │   ├── components/   # React components
│   │   └── types/        # TypeScript definitions
│   ├── public/
│   └── package.json
└── README.md
```

## Architecture

### Backend - Service-Repository Pattern
- **Controllers**: Handle HTTP requests/responses
- **Services**: Contain business logic
- **Repositories**: Manage database operations
- **Models**: Define data schemas

This separation ensures clean code, testability, and maintainability.

## Features

- Drag-and-drop form builder interface
- Real-time form preview
- Form data persistence to MongoDB
- RESTful API with full CRUD operations
- CORS-enabled for cross-origin requests
- Professional error handling
- TypeScript for type safety

## Development Notes

- Backend uses Express 5 with async/await pattern
- Frontend is a Next.js 16 App Router application
- All API responses follow consistent JSON structure
- CORS is configured to allow requests from frontend

## Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running: `sudo systemctl status mongod`
- Verify connection string in `.env` file

**CORS Error:**
- Check that backend CORS middleware is enabled
- Verify frontend is making requests to correct port (5000)

**Port Already in Use:**
- Change PORT in backend `.env` file
- Update API URL in frontend component accordingly

## License

ISC
