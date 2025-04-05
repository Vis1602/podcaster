const mongoose = require('mongoose');
const config = require('./config');

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(config.mongoURI, { 
            dbName: 'podcastDB'
        });
        console.log('Connected to MongoDB successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        console.error('Connection string:', config.mongoURI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
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