VoyageVista 

Role-Based Travel Booking Platform with AI-Generated Itineraries

VoyageVista is a full-stack travel booking web application that allows travellers to book hotels and receive AI-generated, day-by-day travel itineraries, while enabling hotel owners to manage properties and bookings through a separate role-based interface.

The project integrates a Hugging Face LLaMA instruction model on the backend to generate itineraries using real booking data.

Overview

VoyageVista demonstrates a complete end-to-end system involving:

Role-based authentication (Traveller / Hotel Owner)

Hotel, room, and booking management

Secure backend-driven AI integration

Clean separation between frontend, backend, and AI logic

The application follows a client–server architecture with all AI interactions handled server-side.

Core Features
Traveller

Register and log in as a traveller

Browse hotels and available rooms

Book rooms with check-in and check-out dates

View and manage bookings

Generate AI-powered travel itineraries for a booking

Hotel Owner

Separate login and role-based access

Add and manage hotels

Add room types and pricing

View bookings for owned properties

AI Itinerary Generation

Generates detailed, day-wise travel plans

Uses booking details as prompt context

Controlled system prompt for consistent outputs

AI requests executed securely on the backend

AI Implementation Details

VoyageVista uses Hugging Face’s Chat Completion API for itinerary generation.

Model
meta-llama/Llama-3.2-1B-Instruct:novita

How It Works

Booking details are collected (city, dates, guests).

Backend constructs a structured prompt.

A system instruction defines the model’s role as a travel planner.

The model returns a readable, multi-day itinerary.

The itinerary is rendered in the frontend itinerary page.

Configuration

max_tokens: 1000

temperature: 0.8

Hugging Face API token stored in environment variables.

AI logic is implemented in server/routes/aiRoutes.js.

Tech Stack
Frontend

React (Vite)

React Router DOM

Axios

Context API

Custom CSS

Backend

Node.js

Express.js

MongoDB

Mongoose

JWT-based authentication

Role-based authorization

AI & External Services

Hugging Face Inference API

LLaMA instruction model

Project Structure
VoyageVista/
│
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── SelectRole.jsx
│   │   │   ├── MyBookings.jsx
│   │   │   ├── Itinerary.jsx
│   │   │   └── hotelOwner/
│   │   ├── context/
│   │   ├── App.jsx
│   │   └── main.jsx
│
├── server/
│   ├── routes/
│   │   ├── aiRoutes.js
│   │   ├── userRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── hotelRoutes.js
│   │   └── roomRoutes.js
│   ├── models/
│   ├── middleware/
│   │   └── authMiddleware.js
│   └── server.js
│
└── README.md

Environment Setup

Create a .env file inside the server/ directory:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
HF_TOKEN=your_huggingface_api_key

Local Development
Clone the repository
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

API Overview
Generate AI Itinerary
POST /api/ai/itinerary


Response

{
  "itinerary": "Day 1: Arrival and local exploration...\nDay 2: Sightseeing..."
}

Design Notes

AI requests are handled entirely on the backend to protect API keys.

Role-based authorization ensures separation between traveller and hotel owner workflows.

The AI layer is modular and can be updated without frontend changes.

Future Improvements

Structured itinerary output (JSON)

Editable itineraries

AI response caching

Multi-language itinerary support

Payment gateway integration

License

This project is licensed under the MIT License.
