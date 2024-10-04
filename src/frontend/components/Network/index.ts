/**
 * This file serves as the entry point for the Network components in the frontend of the Pollen8 platform.
 * It exports the main components related to network functionality, making them easily accessible for use in other parts of the application.
 * 
 * Requirements addressed:
 * 1. Visual Network Management (Technical specification/1.1 System Objectives)
 *    - Offer intuitive network visualization and management
 * 2. Quantifiable Networking (Technical specification/1.1 System Objectives)
 *    - Provide measurable network growth metrics
 */

import NetworkDashboard from './NetworkDashboard';
import ConnectionList from './ConnectionList';

// Export the main components for network functionality
export {
  NetworkDashboard,
  ConnectionList
};

// Default export for easier importing
export default {
  NetworkDashboard,
  ConnectionList
};

/**
 * NetworkDashboard: Main component for network visualization and management
 * - Displays network statistics
 * - Provides graph and grid views of connections
 * - Allows interaction with network nodes
 * 
 * ConnectionList: Component for displaying and managing connections
 * - Lists user connections with detailed information
 * - Supports sorting, filtering, and searching connections
 * - Enables industry-specific filtering
 * 
 * These components work together to provide a comprehensive network management experience,
 * addressing both the visual representation of the user's network and the ability to
 * quantify and analyze network growth and value.
 */