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

**Note:** The initial run may take some time as "mongodb" and "node" images are downloaded. The application is ready when you see "Ready on http://localhost:3000" in the console.
