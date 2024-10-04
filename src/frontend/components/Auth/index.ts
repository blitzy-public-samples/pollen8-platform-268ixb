/**
 * This file serves as the entry point for the Auth components in the Pollen8 platform's frontend,
 * exporting the main authentication-related components for use throughout the application.
 * 
 * Requirements addressed:
 * - User Authentication and Profile Creation
 *   Location: Technical specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation
 *   Description: Centralize access to authentication components
 */

import PhoneVerification from './PhoneVerification';
import OnboardingForm from './OnboardingForm';

export {
  PhoneVerification,
  OnboardingForm
};

/**
 * PhoneVerification: Component for handling phone number verification during user authentication.
 * It provides a two-step process for entering the phone number and verifying the code.
 * 
 * OnboardingForm: Component for collecting essential user information during the onboarding process.
 * It includes fields for city, ZIP code, industry selection (minimum 3), and interest selection (minimum 3).
 * 
 * These components work together to fulfill the user authentication and profile creation requirements
 * of the Pollen8 platform, ensuring a secure and comprehensive user onboarding experience.
 */