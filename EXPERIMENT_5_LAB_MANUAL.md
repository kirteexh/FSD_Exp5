# Full Stack Development (FSD) — Experiment 5 Lab Manual
**Integration of MongoDB and Mongoose with RESTful APIs**  
*Using Node.js, Express.js, MongoDB Atlas / Local MongoDB, Mongoose, and Postman*

---

### Student Information
- **Name:** Kirteesh D. Rakshe
- **Class:** D15A
- **Roll No:** 43
- **Academic Year:** 2026–2027

---

## 1. Project Directory Structure
```
EXP_5/
├── backend/
│   ├── config/
│   │   └── db.js                 # Mongoose database connection
│   ├── controllers/
│   │   └── eventController.js    # 5 CRUD operations with validation
│   ├── middleware/
│   │   └── errorMiddleware.js    # Global error & CastError handler
│   ├── models/
│   │   └── Event.js              # Mongoose Schema and Model
│   ├── routes/
│   │   └── eventRoutes.js        # RESTful API route definitions
│   ├── .env                      # Database URI & port configuration
│   ├── .env.example              # Safe template without secrets
│   ├── Event_Management_MongoDB.postman_collection.json # Exportable Postman collection
│   ├── package.json              # Express, Mongoose, Dotenv, Cors, Nodemon
│   ├── seed.js                   # Script to populate sample events into MongoDB
│   └── server.js                 # Main server entry point
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx               # React UI displaying MongoDB records, CRUD & error tests
│   │   ├── main.jsx              # React DOM root
│   │   └── index.css             # Tailwind CSS & animations
│   ├── index.html                # HTML template with Tailwind CSS
│   ├── package.json              # React 18, Vite 5
│   └── vite.config.js            # Vite configuration
│
├── build_exp5_submission.py      # Python script generating the official Word report
├── FSD_Exp_5_Kirteesh_Rakshe_D15A_43.docx # Ready-to-submit Word report with placeholders
└── EXPERIMENT_5_LAB_MANUAL.md    # Complete documentation & testing guide
```

---

## 2. Quick Start Guide

### Step 2.1: Start the Backend Server
Open a terminal in the `backend/` directory:
```bash
cd backend
npm run dev
```
*(Or `npm start`)*

You should see:
```
===============================================
 MongoDB Connected Successfully!
 Host:     127.0.0.1 (or cluster0.xxxxx.mongodb.net)
 Database: eventDB
 Port:     27017
===============================================
🚀 Server running on http://localhost:5000
📊 API Endpoints available at http://localhost:5000/api/events
```

### Step 2.2: (Optional) Seed the Database
To populate MongoDB with sample events:
```bash
npm run seed
```

### Step 2.3: Start the Frontend Application
In a separate terminal:
```bash
cd frontend
npm run dev
```
Open **`http://localhost:5173`** in your browser to view the interactive UI showing live MongoDB documents with `_id` badges, CRUD modals, and error tests.

---

## 3. MongoDB Atlas Configuration (Cloud Option)
If you wish to use MongoDB Atlas (Cloud) instead of local MongoDB:
1. Log in to **[cloud.mongodb.com](https://cloud.mongodb.com)**.
2. Create a free **M0 Sandbox Cluster**.
3. Under **Database Access**, create a user:
   - Username: `admin_fsd`
   - Password: `<your_password>` (e.g. `KirteeshPass123`)
   - Role: `readWriteAnyDatabase`
4. Under **Network Access**, click **Add IP Address** -> Select **Allow Access from Anywhere (`0.0.0.0/0`)**.
5. Under **Clusters**, click **Connect** -> **Drivers (Node.js)**.
6. Copy the connection string and paste it into `backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://admin_fsd:<your_password>@cluster0.xxxxx.mongodb.net/eventDB?retryWrites=true&w=majority
   ```
7. Restart the backend server. It will automatically connect to MongoDB Atlas!

---

## 4. Postman API Testing Guide
Import `backend/Event_Management_MongoDB.postman_collection.json` directly into Postman (**File -> Import**).

The collection includes all 5 CRUD operations and error handling tests:

| Request | Method | URL | Payload / Notes | Status Code |
|---|---|---|---|---|
| **1. Root Check** | `GET` | `http://localhost:5000/` | Confirms server & MongoDB status | `200 OK` |
| **2. GET All Events** | `GET` | `http://localhost:5000/api/events` | Retrieves all MongoDB documents with `_id` | `200 OK` |
| **3. POST Create Event** | `POST` | `http://localhost:5000/api/events` | JSON body with `name`, `date`, `location`, `capacity`, `registered` | `201 Created` |
| **4. GET Single Event** | `GET` | `http://localhost:5000/api/events/:id` | Use a valid 24-character hexadecimal `_id` from step 2 | `200 OK` |
| **5. PUT Update Event** | `PUT` | `http://localhost:5000/api/events/:id` | JSON body with updated fields (e.g. `capacity: 350`) | `200 OK` |
| **6. DELETE Event** | `DELETE` | `http://localhost:5000/api/events/:id` | Permanently deletes document from MongoDB | `200 OK` |
| **7. Error: Malformed ID** | `GET` | `http://localhost:5000/api/events/invalid-mongo-id-123` | Tests Mongoose `CastError` handling | `400 Bad Request` |
| **8. Error: Non-existent ID** | `GET` | `http://localhost:5000/api/events/654321654321654321654321` | Tests 24-char ObjectId not present in DB | `404 Not Found` |
| **9. Error: Missing Fields** | `POST` | `http://localhost:5000/api/events` | Send empty `{}` or missing `name` | `400 Bad Request` |

---

## 5. Required Screenshots Checklist for Lab Report

### A. MongoDB Configuration
- [ ] **Screenshot 1:** MongoDB Atlas cluster & collection viewer (or MongoDB Compass showing `eventDB` database and `events` collection).
- [ ] **Screenshot 2:** Server terminal displaying successful MongoDB connection (`MongoDB Connected Successfully! Host: ... Database: eventDB`).

### B. Postman API Testing
- [ ] **Screenshot 3:** `GET http://localhost:5000/api/events` showing `200 OK` and array of documents.
- [ ] **Screenshot 4:** `GET http://localhost:5000/api/events/:id` showing `200 OK` and single event.
- [ ] **Screenshot 5:** `POST http://localhost:5000/api/events` with JSON body showing `201 Created` and returned new `_id`.
- [ ] **Screenshot 6:** `PUT http://localhost:5000/api/events/:id` showing `200 OK` with updated fields.
- [ ] **Screenshot 7:** `DELETE http://localhost:5000/api/events/:id` showing `200 OK` and deletion message.
- [ ] **Screenshot 8:** Error handling request (`GET /api/events/invalid-mongo-id-123`) showing `400 Bad Request`.

### C. Frontend Integration
- [ ] **Screenshot 9:** React frontend at `http://localhost:5173` showing events loaded from MongoDB with `_id` badges, connection status, and details modal.

---

## 6. Theory Questions and Answers

### Q1: What is MongoDB Atlas, and why is it used?
**Answer:**  
MongoDB Atlas is a fully-managed cloud Database-as-a-Service (DBaaS) developed by MongoDB that runs on AWS, Google Cloud, or Azure.  
**Why it is used:**
1. **Zero Server Maintenance:** Eliminates manual server provisioning, installation, storage management, and OS patching.
2. **High Availability & Fault Tolerance:** Deploys automated multi-node replica sets with self-healing failover.
3. **Automated Backups & Point-in-Time Recovery:** Continually protects database records.
4. **Enterprise Security:** Provides automatic TLS encryption in transit, encryption at rest, network isolation, and IP access lists.
5. **Elastic Scalability:** Easily scales storage and compute vertically or horizontally with zero downtime.

### Q2: What is Mongoose? Explain the purpose of schemas and models.
**Answer:**  
Mongoose is an Object Data Modeling (ODM) library for Node.js and MongoDB. It manages relationships between data, provides schema validation, and translates between objects in code and representations in MongoDB.  
- **Purpose of Schemas:** Since MongoDB is document-oriented and schemaless, a Mongoose Schema defines the structure, data types, validation rules (required, minlength, enum), default values, and middleware for documents in a collection.
- **Purpose of Models:** A Mongoose Model is a wrapper compiled from the Schema. It represents a MongoDB collection and provides the programmatic API for all CRUD database interactions (`find`, `create`, `findByIdAndUpdate`, `deleteOne`).

### Q3: What is the purpose of MONGODB_URI and mongoose.connect()?
**Answer:**  
- **`MONGODB_URI`:** A standardized Uniform Resource Identifier that contains all connection parameters (protocol `mongodb://` or `mongodb+srv://`, username, password, cluster hostname, database name, and options like `retryWrites=true`).
- **`mongoose.connect()`:** The asynchronous method in Mongoose that establishes a persistent connection pool between the Node.js application and the MongoDB database instance.

### Q4: Differentiate between in-memory storage and MongoDB storage.
**Answer:**  
| Feature | In-Memory Storage (Exp 4) | MongoDB Storage (Exp 5) |
|---|---|---|
| **Persistence** | Data stored in volatile RAM; lost upon server restart | Data stored persistently on disk/SSD |
| **Scalability** | Limited by single machine RAM | Horizontally scalable across clusters |
| **Query Power** | Basic JavaScript array methods (`filter`, `find`) | Rich query engine, indexes, aggregations |
| **Data Integrity** | Manual, error-prone validation | Enforced via Mongoose schemas & validators |
| **Production Ready** | Only suitable for prototypes/unit tests | Industry-standard for production systems |

### Q5: Explain the purpose of find(), findById(), create(), findByIdAndUpdate() and findByIdAndDelete().
**Answer:**  
1. **`Event.find()`**: Queries the collection and returns an array of all documents matching the filter.
2. **`Event.findById(id)`**: Searches for a single document matching the specified 24-character hexadecimal ObjectId.
3. **`Event.create(data)`**: Validates and inserts one or more new documents into MongoDB in a single atomic operation.
4. **`Event.findByIdAndUpdate(id, data, options)`**: Updates a document by ID and returns the updated document when `{ new: true }` is specified.
5. **`Event.findByIdAndDelete(id)`**: Finds and removes a document by ID from MongoDB, returning the deleted document.

### Q6: What is MongoDB ObjectId?
**Answer:**  
An ObjectId is a 12-byte (24-character hexadecimal string) globally unique identifier assigned automatically as the `_id` primary key of every MongoDB document.  
Its 12 bytes consist of:
1. **4 bytes:** Unix timestamp (seconds since epoch) capturing the exact creation time.
2. **5 bytes:** Random process/machine identifier preventing multi-server collisions.
3. **3 bytes:** Incrementing counter initialized to a random value.

### Q7: Why should database credentials be stored securely in a .env file?
**Answer:**  
1. **Prevents Secret Leaks:** Hardcoded credentials in source code can accidentally be pushed to public Git repositories, exposing the database to attackers.
2. **Adheres to 12-Factor App Methodology:** Decouples configuration from application code, allowing effortless switching between local, staging, and production environments.
3. **Protected by `.gitignore`:** Adding `.env` to `.gitignore` ensures sensitive credentials never enter version control histories.

---

## 7. Submission Artifacts
1. **Word Document:** `FSD_Exp_5_Kirteesh_Rakshe_D15A_43.docx` (Complete with student info, aim, problem statement, all 7 theory answers, 6 code snippets, and 9 formatted screenshot tables).
2. **Backend Code:** In `backend/` with `server.js`, `config/db.js`, `models/Event.js`, `controllers/eventController.js`, `routes/eventRoutes.js`, `seed.js`.
3. **Frontend Code:** In `frontend/` with Vite + React + Tailwind live MongoDB viewer.
4. **Postman Collection:** `backend/Event_Management_MongoDB.postman_collection.json`.

