import express, { Request, Response, NextFunction, Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import apiRoutes from './routes/api';
import { errorHandler, notFound } from './middleware/errorHandler';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec, swaggerDocs } from './config/swagger';

// Load environment variables
dotenv.config();

// Create Express application
const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// API routes
app.use('/api/v1', apiRoutes);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/swagger.json', swaggerDocs);

// 404 handler for non-existent routes
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Start server
if (process.env.NODE_ENV !== 'test') {
  // Connect to MongoDB
  connectDB().then(() => {
    // Start server only after successful database connection
    app.listen(port, () => {
      console.log(`Server running`);
      console.log(`API documentation available at http://localhost:${port}/api-docs`);
    });
  }).catch((err: unknown) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });
}

export default app; 