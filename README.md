VoyageVista
Role-based travel booking application with AI-generated itineraries

VoyageVista is a full-stack travel booking web application.
Travellers can book hotels and generate AI-based travel itineraries.
Hotel owners can manage hotels, rooms, and view bookings using a separate role-based interface.

The AI itinerary generation is implemented on the backend using a Hugging Face LLaMA instruction model and real booking data.

What this project does

The application models a basic travel booking system with two types of users and a simple AI feature layered on top.

Main ideas behind the project:

Keep roles clearly separated (traveller vs hotel owner)

Handle bookings in a realistic way

Integrate AI without exposing keys or logic to the frontend

Avoid unnecessary complexity

All AI calls are made from the backend.

Features
Traveller

Register and log in

Browse hotels and rooms

Book rooms with check-in and check-out dates

View previous bookings

Generate an itinerary for a booking

Hotel owner

Log in with a separate role

Add and manage hotels

Add rooms and pricing

View bookings for owned hotels

AI itinerary

Generates a day-by-day travel plan

Uses booking details such as city and dates

Output is plain text and readable

Implemented as a backend route

AI implementation

The itinerary generation uses the Hugging Face chat completion API.

Model used:

meta-llama/Llama-3.2-1B-Instruct:novita


How it works:

Booking details are fetched on the backend.

A system prompt defines the model as a travel planner.

A user prompt is created from booking data.

The model returns a multi-day itinerary.

The frontend displays the response as-is.

Configuration:

max_tokens: 1000

temperature: 0.8

The code for this lives in server/routes/aiRoutes.js.

Tech stack

Frontend:

React (Vite)

React Router

Axios

Context API

Backend:

Node.js

Express

MongoDB

Mongoose

JWT-based authentication

Role-based authorization

AI:

Hugging Face Inference API

LLaMA instruction model

Project structure
VoyageVista/
├── client/
│   └── src/
│       ├── pages/
│       ├── context/
│       ├── App.jsx
│       └── main.jsx
│
├── server/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── server.js
│
└── README.md

Environment variables

Create a .env file inside the server directory:

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
HF_TOKEN=your_huggingface_api_key

Running the project locally

Clone the repository:

git clone https://github.com/abhayjeet5465/VoyageVista.git
cd VoyageVista


Start the backend:

cd server
npm install
npm run dev


Start the frontend:

cd client
npm install
npm run dev

API

Generate itinerary:

POST /api/ai/itinerary


Returns a text-based itinerary generated from booking details.

Notes

AI logic is intentionally kept on the backend.

Prompts are simple and controlled.

The project focuses on correctness over polish.

License

MIT
