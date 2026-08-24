import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import apiRoutes from './routes.js';
import errorMiddleware from './common/middleware/error.middleware.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Increase limit to send image to backend for uploading in mongodb
// todo: remove when start using special db for media
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: function (origin, callback) {
            if (
                !origin ||
                origin.startsWith('http://localhost:') ||
                origin.startsWith('http://127.0.0.1:')
            ) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true, // Allow cookies to be sent
    })
);

// Routes

app.use('/api', apiRoutes);

// Database connection
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(error => {
        console.error('Error connecting to MongoDB:', error.message);
    });

app.use(errorMiddleware);
