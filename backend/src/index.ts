import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/nutritionRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middleware Configuration
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', router);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Personalized Nutrition Calculator API Service is running.',
    documentation: '/api/health',
  });
});

// Global 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled API Error:', err);
  res.status(500).json({ error: 'Internal server error occurred.' });
});

app.listen(PORT, () => {
  console.log(`Backend API Server running on port ${PORT}`);
  console.log(`Health Check: http://localhost:${PORT}/api/health`);
});
