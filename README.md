# Automated KYC Verification System

A full-stack web application that automates the Know Your Customer (KYC) verification process using document upload, OCR processing, and admin validation workflows.


## Overview

The Automated KYC System streamlines identity verification by allowing users to upload documents and enabling administrators to review and approve/reject applications efficiently.

This project demonstrates a real-world fintech workflow with authentication, role-based access control, document handling, and verification tracking.



## Features

### User Features
- User registration & login (JWT-based authentication)
- Upload KYC documents
- Track application status (Pending / Approved / Rejected)

### Admin Features
- View all KYC applications
- Approve / Reject applications
- Monitor verification logs

### System Features
- OCR-based document processing
- Secure file upload handling
- Role-based authorization
- RESTful API architecture



## Tech Stack

### Frontend
- React (Vite)
- Context API (State Management)
- CSS / Tailwind (if used)

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)

### Other Tools
- JWT Authentication
- Multer (File Upload)
- OCR Service Integration


## 📂 Project Structure

Automated-KYC/
│
├── backend/
│   ├── src/
│   │   ├── config/              # DB, environment configs
│   │   ├── controllers/         # Route logic
│   │   ├── services/            # Business logic (OCR, etc.)
│   │   ├── models/              # Mongoose schemas
│   │   ├── routes/              # API routes
│   │   ├── middleware/          # Auth, upload, error handling
│   │   ├── utils/               # Helper functions (tokens, etc.)
│   │   ├── validations/         # Request validation (optional)
│   │   ├── constants/           # Static values
│   │   ├── app.js               # Express app config
│   │   └── server.js            # Entry point
│   │
│   ├── uploads/                # Uploaded documents (ignored in git)
│   ├── tests/                  # Backend tests
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/             # Images, icons
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Screens/pages
│   │   ├── layouts/            # Layout wrappers
│   │   ├── routes/             # Routing logic
│   │   ├── context/            # Global state (AuthContext)
│   │   ├── hooks/              # Custom hooks
│   │   ├── services/           # API calls
│   │   ├── utils/              # Helpers
│   │   ├── constants/          # Static data
│   │   ├── styles/             # Global styles
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── .env
│   ├── .gitignore
│   └── package.json
│
├── .gitignore
└──  README.md

## Installation & Setup

### 1. Clone the repository
bash git clone https://github.com/vaidikkumarpatel410/Automated-KYC.git 
cd Automated-KYC 



### 2. Backend Setup
bash cd backend npm install 

Create a .env file:
PORT=5000 
MONGO_URI=your_mongodb_connection 
JWT_SECRET=your_secret_key

Run backend:
bash :
npm run dev 



### 3. Frontend Setup
bash :
cd frontend 
npm install 
npm run dev 



##  Authentication Flow

- User logs in → receives JWT
- Token stored in frontend
- Protected routes validated via middleware
- Admin routes restricted by role



## KYC Workflow

1. User uploads document
2. OCR extracts data
3. Data stored in database
4. Admin reviews application
5. Status updated (Approved / Rejected)




## Future Improvements

- AI-based document validation
- Email/SMS notifications
- Multi-document support
- Cloud storage integration (AWS S3)
- Deployment (Docker + CI/CD)



## Contributing

Contributions are welcome!  
Feel free to fork the repo and submit a pull request.



## Author

Vaidikkumar Patel  
GitHub: https://github.com/vaidikkumarpatel410


## Acknowledgements

- Open-source community
- OCR libraries and tools
- Node.js & React eco
