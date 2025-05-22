import { Request, Response } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'JSR API',
      version: '1.0.0',
      description: 'API for JavaScript Resources',
      contact: {
        name: 'JSR Team'
      }
    },
    servers: [
      {
        url: '/api/v1',
        description: 'Development Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts'] // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
};

export { swaggerSpec, swaggerDocs }; 