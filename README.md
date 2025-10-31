#  Book Collection Manager (MERN Stack)

A full-stack **Book Collection Manager** web application built using **React (Vite)** for the frontend and **Node.js + Express + MongoDB** for the backend.  
This project allows users to **sign up, log in, manage their profiles, add books, view their collection, update or delete books**, and search efficiently.

---

##  Features

###  User Management
- Secure user registration and login (JWT authentication)
- Role-based access (Super Admin, Admin, Student)
- Profile view and edit functionality

###  Book Management
- Add, update, view, and delete books
- Search books dynamically with debounce
- Each book includes title, author, genre, year, description, and cover image

###  Tech Stack

 **Frontend**      React (Vite), Material UI, TailwindCSS, Axios, SweetAlert2 
 **Backend**       Node.js, Express.js, MongoDB, JWT, BcryptJS 
 **Database**      MongoDB Atlas / Local MongoDB 
 **Environment**   dotenv for configuration 



##  Installation & Setup

###  1. Clone the Repository
```bash
git clone https://github.com/your-username/book-collection-manager.git
cd book-collection-manager

2. Backend Setup

cd backend
npm install

Create a .env file inside backend:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

npm run dev

The backend runs on http://localhost:5000


3. Run the development server:
   npm run dev

The frontend runs on:
http://localhost:5173

---

## API Endpoints

### User Routes
POST /users/signup – Register a new user  
POST /users/login – Login and get JWT token  
GET /users/profile – Get logged-in user's profile  
PUT /users/profile – Update profile  

### Book Routes
GET /books – Fetch all books  
POST /books – Add new book  
PUT /books/:id – Update existing book  
DELETE /books/:id – Delete book  
POST /books/search – Search books by title or author  

---

## Frontend Pages

Home (/) – Overview and book access  
MyBooks (/MyBooks) – View, update, delete, and search books  
Signup (/signup) – Register new user  
Login (/login) – User authentication  
ViewBook (/book-details/:id) – Detailed view of a book  
Profile (/Profile) – User profile and edit options  



## Scripts

### Frontend
npm run dev – Start the development server  
npm run build – Build for production  
npm run preview – Preview production build  

### Backend
npm run dev – Start server with nodemon  
npm start – Run production server  



## Deployment Guide

### Frontend
Deployed using Vercel or Netlify.  
After building the project with `npm run build`, upload the contents of the "dist" folder.  
Update API_URL in your Axios calls to match your backend’s hosted URL.  

### Backend
Deployed using Render, Cyclic, or Railway.  
Set all required environment variables in deployment settings, such as PORT, MONGO_URI, and JWT_SECRET.  



## Author

Name: Gaddam Janareddy  
Email: janareddygaddam425@gmail.com 
