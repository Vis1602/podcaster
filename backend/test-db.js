const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection
const testDBConnection = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        console.log('Connection string:', process.env.MONGO_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
        
        await mongoose.connect(process.env.MONGO_URI, { 
            dbName: 'podcastDB',
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB successfully');
        
        // Test query
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));
        
        // Close connection
        await mongoose.connection.close();
        console.log('Connection closed');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        console.error('Error stack:', err.stack);
    }
};

// Run the test
testDBConnection(); 