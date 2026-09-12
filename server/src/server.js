import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import apiRoutes from './routes.js';
import errorMiddleware from './common/middleware/error.middleware.js';
import { apiLimiter } from './common/middleware/rateLimit.middleware.js';

// Fail at boot, not on the first login, if config is missing.
const REQUIRED_ENV = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnv = REQUIRED_ENV.filter(key => !process.env[key]);
if (missingEnv.length > 0) {
    console.error(
        `Missing required environment variables: ${missingEnv.join(', ')}`
    );
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Managed hosts put a proxy in front of us. Without this, express-rate-limit
// rejects the X-Forwarded-For header and every user shares the proxy's IP.
app.set('trust proxy', 1);

// Increase limit to send image to backend for uploading in mongodb
// todo: remove when start using special db for media
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(cookieParser());

const allowedOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);

app.use(
    cors({
        origin: function (origin, callback) {
            const isLocalhost =
                origin &&
                (origin.startsWith('http://localhost:') ||
                    origin.startsWith('http://127.0.0.1:'));

            if (!origin || isLocalhost || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true, // Allow cookies to be sent
    })
);

// Health check. Above the limiter so uptime pings never trip it.
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    });
});

// Routes
app.use(apiLimiter);
app.use('/api', apiRoutes);
app.use(errorMiddleware);

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
        process.exit(1);
    });
