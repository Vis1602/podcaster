require('dotenv').config();

const config = {
    mongoURI: process.env.MONGO_URI || 'your_mongodb_uri',
    port: process.env.PORT || 5000,
    clientURL: process.env.CLIENT_URL || 'https://your-frontend-url.vercel.app',
    nodeEnv: process.env.NODE_ENV || 'development',
    secretKey: process.env.SECRET_KEY || 'your_secret_key'
};

module.exports = config; 