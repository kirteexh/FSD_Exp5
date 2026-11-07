# FSD Experiment 5: REST API Design with MongoDB & Mongoose
**Event Management System — Full Stack Development Lab**

**Student Details:**
* **Name:** Kirteesh D. Rakshe
* **Class:** D15A
* **Roll No:** 43
* **Academic Year:** 2026–2027

---

## 📌 Project Overview
This repository contains the complete implementation for **Experiment 5** of the Full Stack Development (FSD) curriculum. It extends the Event Management System RESTful API by integrating **MongoDB** and **Mongoose** to provide persistent database storage, request validation, robust error handling, and React frontend integration.

---

## 🛠️ Tech Stack
* **Backend:** Node.js, Express.js, Mongoose, dotenv, cors
* **Database:** MongoDB Atlas (Cloud) / Local MongoDB Server
* **Frontend:** React 18, Vite 5, Tailwind CSS
* **API Testing:** Postman (Collection included)

---

## 📂 Repository Structure
```
EXP_5/
├── backend/
│   ├── config/
│   │   └── db.js                 # Mongoose connection & logging
│   ├── controllers/
│   │   └── eventController.js    # 5 CRUD operations (getAll, getById, create, update, delete)
│   ├── middleware/
│   │   └── errorMiddleware.js    # Global error handler (CastError, ValidationError, 404, 500)
│   ├── models/
│   │   └── Event.js              # Mongoose Schema & Model with validation rules
│   ├── routes/
│   │   └── eventRoutes.js        # Express RESTful routes (/api/events)
│   ├── .env.example              # Environment variables template
│   ├── seed.js                   # Database seeding script for sample events
│   ├── server.js                 # Express server entry point
│   └── Event_Management_MongoDB.postman_collection.json # Exportable Postman collection
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx               # React UI showing live MongoDB documents, CRUD & error tests
│   │   ├── main.jsx              # React root
│   │   └── index.css             # Tailwind styling & animations
│   ├── index.html                # App HTML entry
│   ├── package.json              # React 18, Vite 5
│   └── vite.config.js            # Vite configuration
│
├── .gitignore                    # Prevents node_modules & .env leaks
├── EXPERIMENT_5_LAB_MANUAL.md    # Detailed lab documentation & theory questions
└── FSD_Exp_5_Kirteesh_Rakshe_D15A_43.docx # Lab report with embedded screenshots
```

---

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
npm run seed     # Populate sample events into MongoDB
npm run dev      # Start server on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev      # Start React client on http://localhost:5173
```

---

## 📡 REST API Endpoints

| HTTP Method | Endpoint | Description | Status Code |
|---|---|---|---|
| `GET` | `/` | API Health check & endpoint summary | `200 OK` |
| `GET` | `/api/events` | Retrieve all events from MongoDB | `200 OK` |
| `GET` | `/api/events/:id` | Retrieve single event by 24-char ObjectId | `200 OK` / `404 Not Found` |
| `POST` | `/api/events` | Create a new event document | `201 Created` / `400 Bad Request` |
| `PUT` | `/api/events/:id` | Update event by ObjectId | `200 OK` / `404 Not Found` |
| `DELETE` | `/api/events/:id` | Remove event from MongoDB | `200 OK` / `404 Not Found` |

---

## 🧪 Postman Collection
Import `backend/Event_Management_MongoDB.postman_collection.json` into Postman to test all endpoints and automated validation error checks.
