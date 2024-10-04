/**
 * This file serves as a central export point for all shared components in the Pollen8 platform,
 * facilitating easier imports throughout the application.
 * 
 * Requirements addressed:
 * 1. Visual Network Management (Technical specification/1.1 System Objectives)
 * 2. Quantifiable Networking (Technical specification/1.1 System Objectives)
 * 3. Strategic Growth Tools (Technical specification/1.1 System Objectives)
 */

// Export the NetworkGraph component
export { default as NetworkGraph } from './NetworkGraph';

// Export the ConnectionGrid component
export { default as ConnectionGrid } from './ConnectionGrid';

// Export the IndustrySelector component
export { default as IndustrySelector } from './IndustrySelector';

// Export the InterestSelector component
export { default as InterestSelector } from './InterestSelector';

// Export the InviteLink component
export { default as InviteLink } from './InviteLink';

/**
 * This index file follows the barrel pattern, which is a common practice in TypeScript/React projects
 * to simplify import statements.
 * 
 * By centralizing exports, it allows other parts of the application to import multiple components
 * from a single location, reducing the number of import statements needed.
 * 
 * This structure supports the modular architecture of the Pollen8 platform, making it easier to
 * manage and scale the shared components.
 * 
 * As new shared components are added to the project, they should be exported from this file to
 * maintain consistency in the import pattern across the application.
 * 
 * The components exported here directly correspond to the core functionalities outlined in the
 * system objectives, such as network visualization, industry selection, and invite system.
 */