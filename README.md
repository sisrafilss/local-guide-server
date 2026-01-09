# Local Guide - Server

This is the **backend server** for the Local Guide project, built to manage users, guides, tours, and bookings. It provides RESTful APIs for authentication, user management, tour management, and booking management.

---

## 🌐 Live Server

You can access the live backend server here:  
[https://local-guide-server.onrender.com/](https://local-guide-server.onrender.com/)

---

## 📦 Postman Collection

You can use the following Postman collection to test all APIs:

**Postman Collection JSON:**  
[Download / Import Collection](https://www.getpostman.com/collections/01030193-80f6-453c-a1b9-c80b59d41e82)

---

## 🛠️ Features

### 1. User Management

- Register Tourist, Guide, or Admin
- Get all users by role
- Update user information
- Delete users

### 2. Authentication

- Login and logout
- Refresh tokens
- Change password
- Forgot & Reset password
- Get current logged-in user info (`/auth/me`)

### 3. Tour Management

- Create, update, delete tours
- Get all tours
- Get a single tour by ID

### 4. Booking Management

- Create, update, delete bookings
- Get all bookings or a booking by ID
- Booking statistics

### 5. Tourist Management

- Update, delete, and get tourists
- Get a single tourist by ID

### 6. Guide Management

- Update, delete, and get guides
- Get a single guide by ID
- Guide statistics

### 7. Admin Management

- Update, delete, and get admins
- Admin statistics

---

## ⚡ API Endpoints Overview

Base URL: `https://local-guide-server.onrender.com/`

### User Endpoints

| Endpoint               | Method | Description           |
| ---------------------- | ------ | --------------------- |
| `/user/create-tourist` | POST   | Register a tourist    |
| `/user/create-guide`   | POST   | Register a guide      |
| `/user/create-admin`   | POST   | Register an admin     |
| `/user?role=TOURIST`   | GET    | Get all users by role |

### Auth Endpoints

| Endpoint                | Method | Description                        |
| ----------------------- | ------ | ---------------------------------- |
| `/auth/login`           | POST   | Login user (tourist, guide, admin) |
| `/auth/refresh-token`   | POST   | Refresh access token               |
| `/auth/change-password` | POST   | Change password                    |
| `/auth/forgot-password` | POST   | Forgot password request            |
| `/auth/reset-password`  | POST   | Reset password using token         |
| `/auth/me`              | GET    | Get logged-in user info            |

### Tour Endpoints

| Endpoint             | Method | Description       |
| -------------------- | ------ | ----------------- |
| `/tours/create-tour` | POST   | Create a new tour |
| `/tours/:id`         | PATCH  | Update a tour     |
| `/tours`             | GET    | Get all tours     |
| `/tours/:id`         | GET    | Get tour by ID    |
| `/tours/:id`         | DELETE | Delete tour by ID |

### Booking Endpoints

| Endpoint         | Method | Description            |
| ---------------- | ------ | ---------------------- |
| `/booking/`      | POST   | Create booking         |
| `/booking/`      | GET    | Get all bookings       |
| `/booking/:id`   | GET    | Get booking by ID      |
| `/booking/:id`   | PATCH  | Update a booking       |
| `/booking/:id`   | DELETE | Delete a booking       |
| `/booking/stats` | GET    | Get booking statistics |

### Tourist Endpoints

| Endpoint       | Method | Description          |
| -------------- | ------ | -------------------- |
| `/tourist/`    | GET    | Get all tourists     |
| `/tourist/:id` | GET    | Get a single tourist |
| `/tourist/:id` | PATCH  | Update tourist info  |
| `/tourist/:id` | DELETE | Delete a tourist     |

### Guide Endpoints

| Endpoint       | Method | Description          |
| -------------- | ------ | -------------------- |
| `/guide`       | GET    | Get all guides       |
| `/guide/:id`   | GET    | Get guide by ID      |
| `/guide/:id`   | PATCH  | Update guide info    |
| `/guide/:id`   | DELETE | Delete guide         |
| `/guide/stats` | POST   | Get guide statistics |

### Admin Endpoints

| Endpoint       | Method | Description          |
| -------------- | ------ | -------------------- |
| `/admin`       | GET    | Get all admins       |
| `/admin/:id`   | GET    | Get admin by ID      |
| `/admin/:id`   | PATCH  | Update admin info    |
| `/admin/:id`   | DELETE | Delete admin         |
| `/admin/stats` | GET    | Get admin statistics |

---

## 🔧 Technologies Used

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL / MySQL (database)
- JWT Authentication
- Cloud hosting: Render

---

## 🚀 How to Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/local-guide-server.git
cd local-guide-server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file with your configuration (database URL, JWT secret, etc.)

### 4. Run the Server

```bash
npm run dev
```

The server will start at `http://localhost:5000` (default).

---

## 📚 Postman Testing

1. Import the Postman Collection
2. Replace `{{URL}}` with your local or live server URL
3. Test all endpoints easily

---

## 📝 Notes

- Make sure to send proper Authorization headers for protected routes.
- Some endpoints require admin or guide privileges.

---

## 🔗 Links

- **Frontend:** [Local Guide Frontend](#)
- **Backend Live:** https://local-guide-server.onrender.com/

---

## 📄 License

MIT License
