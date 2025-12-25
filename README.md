# VoyageVista
## Role-Based Travel Booking Application with AI-Generated Itineraries
<img width="1896" height="914" alt="Screenshot 2025-12-07 215413" src="https://github.com/user-attachments/assets/9361deaa-28eb-41c2-90c5-5aefe74a79e1" />

VoyageVista is a full-stack travel booking web application. Travellers can book hotels and generate AI-based travel itineraries. Hotel owners can manage hotels, rooms, and bookings through a separate role-based interface.

AI itinerary generation is implemented on the backend using a Hugging Face LLaMA instruction model and real booking data.

---
<img width="1897" height="907" alt="Screenshot 2025-12-07 215435" src="https://github.com/user-attachments/assets/04bf1ef5-199c-48db-9ba3-0844c8150c26" />
<img width="1896" height="914" alt="Screenshot 2025-12-07 215413" src="https://github.com/user-attachments/assets/3e6ed94b-e0e4-4fde-b2bf-19e7f1c33442" />
<img width="1901" height="850" alt="Screenshot 2025-12-07 215355" src="https://github.com/user-attachments/assets/13243025-3a37-4023-bff7-b36b4203f2dd" />
<img width="1902" height="716" alt="Screenshot 2025-12-07 215222" src="https://github.com/user-attachments/assets/19a8c060-920c-490d-bb69-c103bb93e77d" />
<img width="929" height="608" alt="image" src="https://github.com/user-attachments/assets/a6b939ca-c5e1-4ddf-8738-e582bd2e12fd" />


## Overview

VoyageVista models a realistic travel booking system with two distinct user roles and a backend-driven AI feature.

The project focuses on:
- Clear separation of roles (traveller vs hotel owner)
- Realistic booking workflows
- Secure backend-only AI integration
- Avoiding unnecessary abstraction and over-engineering

All AI requests are made from the backend.

---

## Features

### Traveller
- Register and log in
- Browse hotels and available rooms
- Book rooms with check-in and check-out dates
- View booking history
- Generate an itinerary for a booking

### Hotel Owner
- Log in using a separate role
- Add and manage hotels
- Add rooms and pricing
- View bookings for owned hotels

### AI Itinerary Generation
- Generates a day-by-day travel plan
- Uses booking data such as city and dates
- Output is plain text and readable
- Implemented as a backend route

---

## AI Implementation

The itinerary generation uses the Hugging Face Chat Completion API.

### Model

### Flow
1. Booking details are fetched on the backend.
2. A system prompt defines the model as a travel planner.
3. A user prompt is created from booking data.
4. The model returns a multi-day itinerary.
5. The frontend renders the response.

### Configuration
- max_tokens: 1000
- temperature: 0.8

AI logic is implemented in:

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
- Role-based authorization

### AI
- Hugging Face Inference API
- LLaMA instruction model
  
## Project Structure
VoyageVista/
├── client/
│ └── src/
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
## Environment Variables

Create a `.env` file inside the `server` directory:

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
HF_TOKEN=your_huggingface_api_key

yaml
Copy code

---

## Running Locally

Clone the repository:
git clone https://github.com/abhayjeet5465/VoyageVista.git
cd VoyageVista

powershell
Copy code

Start the backend:
cd server
npm install
npm run dev

powershell
Copy code

Start the frontend:
cd client
npm install
npm run dev

yaml
Copy code

---

## API

### Generate Itinerary
POST /api/ai/itinerary

yaml
Copy code

Returns a text-based itinerary generated from booking details.

---

## Notes

- AI logic is intentionally handled only on the backend.
- Prompts are kept simple and controlled.
- The project prioritizes correctness and clarity over polish.

---

## License

MIT
