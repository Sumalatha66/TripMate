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
| GET | `/` | Backend status check |
| GET | `/api/health` | Health & MongoDB Atlas connection status |
| GET | `/api/destinations` | Get destinations (with fallback) |
| GET | `/api/hotels` | Get hotels (with fallback) |
| GET | `/api/trips` | Get saved trips |
| POST | `/api/trips` | Save a trip |
| DELETE | `/api/trips/:id` | Delete a trip |

## Troubleshooting

- Check server health and database status at `http://localhost:5000/api/health`.
- If the frontend says preview mode, check that the backend is running on port 5000 and that MongoDB Atlas is connected.
- If the backend reports a MongoDB Atlas connection error:
  1. Verify your database username and password in `backend/.env`.
  2. In MongoDB Atlas, go to **Network Access** and ensure `0.0.0.0/0` is active.
- Run frontend and backend in two separate terminals.
- Do not create `.env` as `.env.txt`. In VS Code, use the exact filename `.env`.

## Deployment Guide (Render + Vercel + MongoDB Atlas)

### 1. Database (MongoDB Atlas)
1. Sign up for free at [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a free **M0 Cluster**.
3. Under **Database Access**, create a user with a secure password.
4. Under **Network Access**, add `0.0.0.0/0` to allow connections from cloud hosting providers.
5. Click **Connect** > **Drivers** to copy your connection string:
   `mongodb+srv://<username>:<password>@cluster0.mongodb.net/tripmate?retryWrites=true&w=majority`

### 2. Backend Deployment (Render)
1. Sign up at [Render](https://render.com/) and connect your GitHub account.
2. Click **New +** > **Web Service**.
3. Connect your repository `TripMate`.
4. Configure the service settings:
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Under **Environment Variables**, add:
   - `MONGO_URI`: *your MongoDB Atlas connection string*
   - `PORT`: `5000`
6. Click **Deploy Web Service** and copy your backend URL (e.g., `https://tripmate-backend.onrender.com`).

### 3. Frontend Deployment (Vercel)
1. Sign up at [Vercel](https://vercel.com/) and import your `TripMate` GitHub repository.
2. Configure project settings:
   - **Root Directory**: select `frontend`
   - **Framework Preset**: `Vite`
3. Under **Environment Variables**, add:
   - `VITE_API_URL`: *your Render backend URL* (e.g. `https://tripmate-backend.onrender.com/api`)
4. Click **Deploy**!
