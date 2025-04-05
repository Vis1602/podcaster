# Podcast App

A full-stack application for creating, managing, and listening to podcasts.

## Features

- User authentication (register, login, logout)
- Create and manage podcasts
- Upload podcast episodes
- Listen to podcast episodes
- Responsive design

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **File Storage**: Local storage (can be upgraded to cloud storage)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/podcast-app.git
   cd podcast-app
   ```

2. Install dependencies
   ```
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Set up environment variables
   - Create a `.env` file in the backend directory with the following variables:
     ```
     MONGO_URI=your_mongodb_uri
     SECRET_KEY=your_jwt_secret_key
     PORT=5000
     ```
   - Create a `.env` file in the frontend directory with the following variables:
     ```
     REACT_APP_API_URL=http://localhost:5000
     ```

4. Start the development servers
   ```
   # Start the backend server
   cd backend
   npm start

   # Start the frontend server
   cd ../frontend
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Deployment

### Backend (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the following environment variables:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `SECRET_KEY`: Your JWT secret key
   - `CLIENT_URL`: Your Vercel frontend URL
   - `NODE_ENV`: production

### Frontend (Vercel)

1. Create a new project on Vercel
2. Connect your GitHub repository
3. Set the following environment variables:
   - `REACT_APP_API_URL`: Your Render backend URL

## License

This project is licensed under the MIT License - see the LICENSE file for details. 