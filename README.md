# TripMate – Travel Planner and Booking Interface

A beginner-friendly full-stack student project built with React, CSS, Node.js, Express and MongoDB.

## Features

- Home page with destination search
- Destination cards with sample photos and estimated costs
- Hotel listing with destination, maximum-price and rating filters
- Trip planner with dates, duration and activities
- Estimated budget calculator
- Save and delete travel plans using MongoDB

> This is an educational demo. Hotel information is sample data. It does not make real hotel reservations or accept payments.

## Folder structure

```text
TripMate/
├── frontend/
│   ├── index.html
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       └── style.css
└── backend/
    ├── package.json
    ├── server.js
    ├── .env.example
    └── .gitignore
```

## Requirements

Install Node.js and have access to a MongoDB database. You can use a local MongoDB Community Server or MongoDB Atlas.

## 1. Configure the backend

Open a terminal in VS Code:

```bash
cd backend
npm install
```

Create a file named `.env` inside the `backend` folder. Copy the contents from `.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/tripmate
```

The example URI requires a local MongoDB server to be installed and running. If you use MongoDB Atlas, replace the URI with your own Atlas connection string. Do not share your database password.

Start the backend:

```bash
npm run dev
```

When connected, the terminal should show `MongoDB connected.` and `TripMate backend running at http://localhost:5000`.

## 2. Start the frontend

Open a second terminal in VS Code:

```bash
cd frontend
npm install
npm run dev
```

Open the local address shown by Vite, usually:

http://localhost:5173

## API routes

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/destinations` | Get destinations |
| GET | `/api/hotels` | Get hotels |
| GET | `/api/trips` | Get saved trips |
| POST | `/api/trips` | Save a trip |
| DELETE | `/api/trips/:id` | Delete a trip |

## Troubleshooting

- If the frontend says preview mode, check that the backend is running on port 5000.
- If the backend reports a MongoDB connection error, check that MongoDB is running and that `MONGO_URI` in `backend/.env` is correct.
- Run frontend and backend in two separate VS Code terminals.
- Do not create `.env` as `.env.txt`. In VS Code, use the exact filename `.env`.
