# Form Builder Application

A modern, full-stack form builder featuring a premium **Apple-inspired design**, drag-and-drop functionality, and dynamic form handling.

## 🚀 Key Features

*   **Premium UI/UX**: Minimalist "Apple-style" interface with glassmorphism, smooth animations, and Lucide icons.
*   **Drag & Drop Builder**: Intuitive builder based on `react-form-builder2`, customized for better aesthetics.
*   **Dynamic Form Handling**: Custom "AppleEditModal" allows setting precise **Field Names (Variables)** for backend integration.
*   **Form Management**: Create, Edit, Delete, and Fill forms.
*   **Form Responses**: View and analyze submitted form data in a clean data table.
*   **Full Stack**: Built with Next.js 16 (App Router), Express 5, and MongoDB.

## 🛠 Tech Stack

**Frontend**
*   Next.js 16 (App Router) & TypeScript
*   Lucide React (Icons) & Font Awesome
*   React Form Builder 2 (Customized)

**Backend**
*   Node.js & Express 5
*   MongoDB (Mongoose)
*   Service-Repository Pattern

## ⚡️ Quick Start

### 1. Backend
```bash
cd backend
npm install
npm start
# Runs on http://localhost:5000
```
*Ensure MongoDB is running locally or configure `.env`.*

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

## 📂 Project Structure

```
form-builder-case/
├── backend/           # Node.js/Express API
│   ├── modules/       # Service-Repository Architecture
│   └── server.js      # Entry Point
├── frontend/          # Next.js Application
│   ├── src/app/       # App Router Pages (Home, Saved Forms, View)
│   ├── components/    # Reusable UI Components (AppleBuilder, Modals)
└── README.md
```

## 🎨 Design Philosophy
The project emphasizes visual hierarchy and simplicity. Standard library styles were overridden to match a consistent "Apple" aesthetic (Rounded corners, blur effects, #0071e3 blue).
