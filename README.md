# VoyageVista

## Role-Based Travel Booking Application with AI-Generated Itineraries

VoyageVista is a MERN full-stack travel booking web application where travellers can book hotels and generate travel itineraries using AI. Hotel owners can log in with a separate role, add and manage hotels and rooms, and view bookings.

AI itinerary generation is handled on the backend using the Hugging Face LLaMA instruction model and booking details.

---

## Overview

VoyageVista models a travel booking system with role-based functionality and a backend AI feature. The focus is on:

- Clear separation of traveller and hotel owner functionality
- Basic but realistic booking workflows
- Backend-secured AI integration
- Simple and readable project structure

All AI requests are made from the backend to protect API credentials.

---

## Screenshots

The following screenshots show the UI of different pages in the application.  

<p align="center">
  <img src="client/src/assets/Screenshot 2025-12-07 215355.png" width="500" alt="Home Page">
</p>

<p align="center">
  <img src="client/src/assets/Screenshot 2025-12-07 215413.png" width="500" alt="Login Page">
</p>

<p align="center">
  <img src="client/src/assets/Screenshot 2025-12-07 215435.png" width="500" alt="Booking Flow">
</p>

<p align="center">
  <img src="client/src/assets/Screenshot 2025-12-25 200536.png" width="500" alt="AI Generated Itinerary">
</p>

> Update these paths if you later move the screenshots to a different folder.

---

## Features

### Traveller
- Register and log in as a traveller
- Browse hotels and view available rooms
- Book rooms with check-in / check-out dates
- View booking history
- Generate an AI itinerary for a booking

### Hotel Owner
- Log in with a separate role
- Add and manage hotels
- Add room types and pricing
- View bookings for owned hotels

### AI Itinerary
- Produces day-by-day travel plans
- Uses booking data such as location, dates, and guests
- Output is plain text and readable
- Implemented in a backend route

---

## AI Integration

AI itinerary generation uses the Hugging Face Chat Completion API.

### Model

meta-llama/Llama-3.2-1B-Instruct:novita


### How It Works
1. The backend collects booking details.
2. A system prompt defines the model’s role.
3. A user prompt is constructed from booking data.
4. The model returns a multi-day itinerary.
5. The frontend displays the response.

### Configuration
- `max_tokens`: 1000  
- `temperature`: 0.8  

The itinerary logic is implemented in:

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
- JWT authentication
- Role-based authorization middleware

### AI / Services
- Hugging Face Inference API
- LLaMA model

---

## Project Structure
VoyageVista/
├── client/
│ └── src/
│ ├── assets/
│ │ ├── Screenshot 2025-12-07 215355.png
│ │ ├── Screenshot 2025-12-07 215413.png
│ │ ├── Screenshot 2025-12-07 215435.png
│ │ └── Screenshot 2025-12-25 200536.png
│ ├── pages/
│ ├── context/
│ ├── App.jsx
│ └── main.jsx
│
├── server/
│ ├── routes/
│ │ ├── aiRoutes.js
│ │ ├── bookingRoutes.js
│ │ ├── hotelRoutes.js
│ │ ├── roomRoutes.js
│ │ └── userRoutes.js
│ ├── models/
│ ├── middleware/
│ └── server.js
│
└── README.md
---

## Environment Variables

Create a `.env` file in the `server` directory:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
HF_TOKEN=your_huggingface_api_key

yaml
Copy code

---
## Running the Project Locally

### Clone the repository
```bash
git clone https://github.com/abhayjeet5465/VoyageVista.git
cd VoyageVista
Start the backend
cd server
npm install
npm run dev

Start the frontend
cd client
npm install
npm run dev

### API
Generate AI Itinerary
POST /api/ai/itinerary
Returns a multi-day text itinerary based on the booking details sent in the payload.

Notes
Backend-only AI logic protects keys and prompt design

The AI flow is simple and focused on readability

The project prioritizes clarity and correctness

License

MIT
