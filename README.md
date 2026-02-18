# VoyageVista

## Role-Based Travel Booking Application with AI-Generated Itineraries

VoyageVista is a full-stack travel booking web application. Travellers can book hotels and generate AI-based travel itineraries, while hotel owners can manage hotels, rooms, and bookings through a separate role-based interface.

AI itinerary generation is handled on the backend using a Hugging Face LLaMA instruction model and real booking data.


---

## Overview

VoyageVista models a practical travel booking system with two user roles and a backend-driven AI feature.

Key points:
- Clear separation of traveller and hotel owner workflows
- Realistic booking and room management
- Backend-only AI integration
- Simple and readable codebase

All AI calls are made from the backend.

---

## Screenshots

<p align="center">
  <img src="client/src/assets/Screenshot 2025-12-07 215355.png" width="480">
</p>
<p align="center">
  <img src="client/src/assets/Screenshot 2025-12-07 215413.png" width="480">
</p>
<p align="center">
  <img src="client/src/assets/Screenshot 2025-12-07 215435.png" width="480">
</p>
<p align="center">
  <img src="client/src/assets/Screenshot 2025-12-25 200536.png" width="480">
</p>

---

## Features

### Traveller
- Register and log in
- Browse hotels and rooms
- Book rooms with check-in and check-out dates
- View booking history
- Generate AI itineraries for bookings

### Hotel Owner
- Separate role-based login
- Add and manage hotels
- Add rooms and pricing
- View bookings for owned hotels

### AI Itinerary
- Generates day-by-day travel plans
- Uses booking details as input
- Plain text output
- Implemented as a backend route

---

## AI Integration

### Model
meta-llama/Llama-3.2-1B-Instruct:novita


### Flow
1. Backend fetches booking details
2. System prompt defines planner role
3. User prompt is built from booking data
4. Model returns multi-day itinerary
5. Frontend displays response

### Configuration
- max_tokens: 1000
- temperature: 0.8

AI logic location:
server/routes/aiRoutes.js


---

## Tech Stack

### Frontend
- React (Vite)
- React Router DOM
- Axios
- Context API

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Role-based authorization

### AI
- Hugging Face Inference API
- LLaMA instruction model

---

## Project Structure

VoyageVista/
├── client/
│ └── src/
│ ├── assets/
│ ├── pages/
│ ├── context/
│ ├── App.jsx
│ └── main.jsx
│
├── server/
│ ├── routes/
│ ├── models/
│ ├── middleware/
│ └── server.js
│
└── README.md


---

## Environment Variables

Create a `.env` file inside the `server` directory:

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
HF_TOKEN=your_huggingface_api_key

yaml

---

## Running the Project

Clone the repository:
git clone https://github.com/abhayjeet5465/VoyageVista.git
cd VoyageVista

Start backend:
cd server
npm install
npm run dev

Start frontend:
cd client
npm install
npm run dev

---

## API

### Generate AI Itinerary
POST /api/ai/itinerary
Returns a multi-day text itinerary generated from booking details.

---

## License

MIT
