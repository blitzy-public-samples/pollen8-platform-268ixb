import { Router } from 'express';
import { NetworkController } from '../controllers/networkController';
import { authMiddleware } from '../middleware/auth';
import { validateDto } from '../middleware/validation';
import { AddConnectionDto } from '../dto/addConnection.dto';

/**
 * This file defines the network-related routes for the Pollen8 API, handling endpoints for managing user connections,
 * retrieving network data, and network analytics.
 * 
 * Requirements addressed:
 * - Network Management (Technical Specification/1.1 System Objectives/Visual Network Management)
 * - Quantifiable Networking (Technical Specification/1.1 System Objectives/Quantifiable Networking)
 */

const router = Router();
const networkController = new NetworkController();

/**
 * @route GET /network
 * @desc Retrieve the user's network
 * @access Private
 */
router.get('/network', authMiddleware, networkController.getNetwork);

/**
 * @route POST /network/connection
 * @desc Add a new connection to the user's network
 * @access Private
 */
router.post('/network/connection', authMiddleware, validateDto(AddConnectionDto), networkController.addConnection);

/**
 * @route DELETE /network/connection/:connectionId
 * @desc Remove a connection from the user's network
 * @access Private
 */
router.delete('/network/connection/:connectionId', authMiddleware, networkController.removeConnection);

/**
 * @route GET /network/analytics
 * @desc Retrieve analytics data for the user's network
 * @access Private
 */
router.get('/network/analytics', authMiddleware, networkController.getNetworkAnalytics);

/**
 * @route GET /network/connections
 * @desc Retrieve a list of connections for the user with optional sorting and filtering
 * @access Private
 */
router.get('/network/connections', authMiddleware, networkController.getConnections);

/**
 * Error handling:
 * This file relies on the error handling implemented in the networkController and the global error handling middleware.
 * It does not implement any specific error handling logic.
 * 
 * Input validation:
 * The route for adding a connection (/network/connection) uses the validateDto middleware to ensure that the incoming
 * request data is valid before passing it to the controller.
 * 
 * Authentication:
 * All routes in this file are protected by the authMiddleware, ensuring that only authenticated users can access
 * network-related functionality.
 * 
 * Performance considerations:
 * - The routes are designed to be lightweight, delegating the actual processing to the controller functions.
 * - For potentially large networks, consider implementing pagination for the GET /network and GET /network/analytics
 *   endpoints in the controller logic.
 * 
 * Security considerations:
 * - All routes are protected by authentication middleware.
 * - Input validation is applied to the connection creation route to prevent invalid data.
 * - The use of Express Router helps in modularizing the application and applying middleware efficiently.
 * 
 * Future enhancements:
 * - Implement rate limiting for network-related endpoints to prevent abuse.
 * - Add caching mechanisms for frequently accessed network data to improve performance.
 * - Introduce versioning for the API routes (e.g., /v1/network) to allow for future API changes without breaking existing clients.
 * - Implement HATEOAS (Hypermedia as the Engine of Application State) principles for better API discoverability and navigation.
 */

export default router;