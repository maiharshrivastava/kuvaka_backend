const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { socketSetup } = require('./socket');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');

const app = express();

// CORS configuration
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
};

// Middleware setup
app.use(cors(corsOptions));
app.use(express.json());

// Database connection setup
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
        process.exit(1);
    }
};

// Connect to the database
connectDB();

// Routes setup
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Create HTTP server and set up socket.io
const server = http.createServer(app);
socketSetup(server);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
