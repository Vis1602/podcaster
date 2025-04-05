const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const config = require('./config/config');

// Import database connection
const connectDB = require('./config/db');

// Import middleware
const limiter = require('./middleware/rateLimiter');

// Import routes
const authRoutes = require('./routes/auth');
const podcastRoutes = require('./routes/podcasts');
const uploadRoutes = require('./routes/uploads');

const app = express();
const PORT = config.port;

// Connect to MongoDB
connectDB();

// CORS configuration
const corsOptions = {
    origin: config.clientURL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
    maxAge: 86400 // 24 hours
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Apply rate limiter
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/podcasts', podcastRoutes);
app.use('/api/upload', uploadRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
