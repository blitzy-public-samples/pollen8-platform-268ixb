/**
 * This file serves as the main export point for all Profile-related components in the Pollen8 platform's frontend.
 * 
 * Requirements addressed:
 * - Profile Components Organization
 *   Location: Technical specification/2. SYSTEM ARCHITECTURE/2.3 COMPONENT DIAGRAMS/2.3.1 Frontend Components
 *   Description: Centralize exports of Profile components
 * 
 * This file follows the barrel pattern, which is a common practice in TypeScript/React projects for organizing and exporting multiple related modules.
 * It simplifies imports in other parts of the application, allowing developers to import from 'components/Profile' instead of individual files.
 * As new Profile-related components are added to the folder, they should be exported from this index file to maintain consistency.
 * The file is kept simple and only contains export statements to avoid any side effects during imports.
 * Proper type checking is ensured for all exported components.
 */

// Named exports for individual components
export { default as ProfileCard } from './ProfileCard';
export { default as ProfileEdit } from './ProfileEdit';

// Optional default export of all Profile components as a single object
import ProfileCard from './ProfileCard';
import ProfileEdit from './ProfileEdit';

export default {
  ProfileCard,
  ProfileEdit
};

/**
 * Usage examples:
 * 
 * 1. Importing individual components:
 *    import { ProfileCard, ProfileEdit } from 'components/Profile';
 * 
 * 2. Importing all components as a single object:
 *    import ProfileComponents from 'components/Profile';
 *    const { ProfileCard, ProfileEdit } = ProfileComponents;
 * 
 * 3. Importing specific component directly:
 *    import ProfileCard from 'components/Profile/ProfileCard';
 */