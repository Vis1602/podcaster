# Podcaster - Podcast Management Application

A full-stack web application for discovering, uploading, and managing podcasts. This application allows users to browse popular podcasts from iTunes, upload their own podcasts, and manage episodes.

## Features

- **User Authentication**: Register, login, and secure access to personal content
- **Podcast Discovery**: Browse popular podcasts from iTunes
- **Personal Podcast Management**: Upload and manage your own podcasts
- **Episode Management**: Add, view, and delete episodes
- **Responsive Design**: Works on desktop and mobile devices
- **Search Functionality**: Filter podcasts by title

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- Context API for state management
- Axios for API requests
- Tailwind CSS for styling

### Backend
- Node.js
- Express.js
- MongoDB for database
- JWT for authentication
- Multer for file uploads

## Project Structure

```
podcast-test/
├── backend/                # Backend server code
│   ├── middleware/         # Middleware functions
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── uploads/            # Uploaded files storage
│   ├── server.js           # Main server file
│   └── package.json        # Backend dependencies
│
├── frontend/               # Frontend React application
│   ├── public/             # Static files
│   ├── src/                # Source code
│   │   ├── components/     # Reusable components
│   │   ├── context/        # Context providers
│   │   ├── pages/          # Page components
│   │   ├── styles/         # CSS styles
│   │   ├── App.js          # Main application component
│   │   └── index.js        # Entry point
│   └── package.json        # Frontend dependencies
│
└── README.md               # Project documentation
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/podcast-test.git
cd podcast-test
```

2. Install backend dependencies
```
cd backend
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret_key
```

4. Install frontend dependencies
```
cd ../frontend
npm install
```

5. Start the backend server
```
cd ../backend
node server.js
```

6. Start the frontend development server
```
cd ../frontend
npm start
```

7. Open your browser and navigate to `http://localhost:3000`

## Usage

### For Users
- Register a new account or login with existing credentials
- Browse podcasts on the home page
- Click on a podcast to view details and episodes
- Upload your own podcast by clicking "Upload Your Own Podcast"
- Add episodes to your podcasts
- Delete your podcasts and episodes as needed

### For Developers
- The backend API is available at `http://localhost:5000/api`
- Authentication is required for most endpoints
- File uploads are handled through dedicated endpoints

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token

### Podcasts
- `GET /api/podcasts` - Get all user-uploaded podcasts
- `GET /api/podcasts/:id` - Get a specific podcast
- `POST /api/podcasts` - Create a new podcast
- `DELETE /api/podcasts/:id` - Delete a podcast

### Episodes
- `POST /api/podcasts/:podcastId/episodes` - Add an episode to a podcast
- `DELETE /api/podcasts/:podcastId/episodes/:episodeId` - Delete an episode

### Uploads
- `POST /api/upload/image` - Upload a podcast image
- `POST /api/upload/audio` - Upload an episode audio file

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- iTunes API for podcast data
- All contributors to the open-source libraries used in this project 