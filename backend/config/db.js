const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { 
            dbName: 'podcastDB'
        });
        console.log('Connected to MongoDB successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        console.error('Connection string:', process.env.MONGO_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
        process.exit(1);
    }
};

// Add connection event listeners
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected');
});

module.exports = connectDB; 