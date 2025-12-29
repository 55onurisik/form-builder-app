# Form Builder Application

## Installation with Docker

You can get this project up and running with a single command using Docker.

### Requirements
- Docker
- Docker Compose

### Installation Steps

1. **Clone the Project:**
   ```bash
   git clone https://github.com/55onurisik/form-builder-app
   cd form-builder-case
   ```

2. **Start Docker:**
   The following command will start all services (Frontend, Backend, MongoDB).
   ```bash
   docker-compose up --build
   ```

3. **Access the Application:**
   - **Frontend (Form Builder):** [http://localhost:3000](http://localhost:3000)
   - **Backend API:** [http://localhost:5000](http://localhost:5000)


Manual Installation

If you prefer to run the project manually on your local machine, follow these steps.

### Prerequisites

- **Node.js**: v18 or higher
- **MongoDB**: v6.0 or higher (must be running locally or accessible via URI)

### 1. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Create a `.env` file in the `backend` directory with the following content:
    ```env
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/formbuilder
    ```
    *Note: Adjust `MONGODB_URI` if your local MongoDB instance is different.*

4.  Start the backend server:
    ```bash
    npm run dev
    ```
    The server should be running at `http://localhost:5000`.

### 2. Frontend Setup

1.  Navigate to the frontend directory (in a new terminal):
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

4.  Access the application at `http://localhost:3000`.

---

## Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Library:** React 18
- **Language:** TypeScript
- **Styling:** CSS Modules / Vanilla CSS
- **Form Builder:** `react-form-builder2`
- **HTTP Client:** Axios
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB 8.0
- **ODM:** Mongoose

### DevOps
- **Containerization:** Docker & Docker Compose
- **Tooling:** Prettier, ESLint
