const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const apartmentRoutes = require('./routes/apartments');
const userRoutes = require("./routes/users");
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());

// CORS Configuration
const corsOptions = {
    origin: ['http://localhost:5173', 'https://clync.me'],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
app.use(cors(corsOptions));

// Optional: Handle preflight for all routes with the same options
app.options('*', cors(corsOptions));

connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use("/api/apartments", apartmentRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
