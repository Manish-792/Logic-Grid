const mongoose = require('mongoose');

async function main() {
    try {
        const connectionString = process.env.DB_CONNECT_STRING;
        if (!connectionString) {
            throw new Error('DB_CONNECT_STRING environment variable is not set');
        }
        
        await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}

module.exports = main;


