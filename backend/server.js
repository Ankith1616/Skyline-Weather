import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import weatherRoutes from './routes/weatherRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import logger from './utils/logger.js';

// Load environmental variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: '*', // Allow all origins for simplicity or customize to frontend port (e.g. http://localhost:5173)
  methods: ['GET', 'POST', 'DELETE']
}));

// Request Logger Middleware
app.use(morgan('dev'));

// Body Parser Middleware
app.use(express.json());

// API Routes
app.use('/api', weatherRoutes);

// Base Route
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running smoothly' });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
