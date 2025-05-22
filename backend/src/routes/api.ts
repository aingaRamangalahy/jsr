import express, { Request, Response, Router } from 'express';
import resourceRoutes from './resource.routes';
import categoryRoutes from './category.routes';
import resourceTypeRoutes from './resourceType.routes';
import authRoutes from './auth.routes';
import interactionRoutes from './interaction.routes';

const router: Router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get API information
 *     description: Returns basic information about the API
 *     tags: [API]
 *     responses:
 *       200:
 *         description: Successfully returned API info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: JSR API
 *                     version:
 *                       type: string
 *                       example: 1.0.0
 *                     description:
 *                       type: string
 *                       example: API for JavaScript Resources
 */
// Root API endpoint
router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    data: {
      name: 'JSR API',
      version: '1.0.0',
      description: 'API for JavaScript Resources'
    }
  });
});

/**
 * @swagger
 * /resources:
 *   get:
 *     summary: Get all resources
 *     tags: [Resources]
 *     responses:
 *       200:
 *         description: List of all resources
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of all categories
 */

/**
 * @swagger
 * /types:
 *   get:
 *     summary: Get all resource types
 *     tags: [Resource Types]
 *     responses:
 *       200:
 *         description: List of all resource types
 */

/**
 * @swagger
 * /auth:
 *   get:
 *     summary: Authentication routes
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Authentication endpoints
 */

// Register route modules
router.use('/resources', resourceRoutes);
router.use('/categories', categoryRoutes);
router.use('/types', resourceTypeRoutes);
router.use('/auth', authRoutes);
router.use('/', interactionRoutes); // User interactions

export default router; 