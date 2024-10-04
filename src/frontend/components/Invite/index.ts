/**
 * This file serves as the entry point for the Invite-related components in the Pollen8 platform's frontend.
 * It exports the main components used for invite functionality, making them easily accessible to other parts of the application.
 * 
 * Requirements addressed:
 * 1. Strategic Growth Tools (Technical specification/1.1 System Objectives/Strategic Growth Tools)
 *    - Enable targeted network expansion
 * 2. Invite System (Technical specification/1.1 System Objectives/Strategic Growth Tools)
 *    - Trackable invite links
 * 3. Click Analytics (Technical specification/1.1 System Objectives/Strategic Growth Tools)
 *    - Track invite link interactions
 */

// Import the InviteGenerator component
import { InviteGenerator } from './InviteGenerator';

// Import the InviteStats component
import { InviteStats } from './InviteStats';

// Export the components
export { InviteGenerator } from './InviteGenerator';
export { InviteStats } from './InviteStats';

// Default export for convenient importing
export default {
  InviteGenerator,
  InviteStats,
};