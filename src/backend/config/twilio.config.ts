/**
 * Twilio Configuration
 * 
 * This file contains the configuration settings for integrating Twilio services
 * into the Pollen8 backend application.
 * 
 * Requirements addressed:
 * - Phone Verification (Technical specification/1.1 System Objectives/Verified Connections)
 *   Configuration for Twilio SMS service to enable phone number verification
 */

// Import the environment variables (assuming they are defined in a .env file or process.env)
const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
  TWILIO_SERVICE_SID,
} = process.env;

/**
 * Twilio configuration object
 * Contains the necessary credentials and settings for Twilio integration
 */
export const twilioConfig = {
  /**
   * Twilio Account SID
   * This is the unique identifier for your Twilio account
   */
  accountSid: TWILIO_ACCOUNT_SID,

  /**
   * Twilio Auth Token
   * This is the authentication token for your Twilio account
   * IMPORTANT: Keep this token secret and never expose it in client-side code
   */
  authToken: TWILIO_AUTH_TOKEN,

  /**
   * Twilio Phone Number
   * This is the phone number from which SMS messages will be sent
   * It should be in E.164 format (e.g., +1234567890)
   */
  phoneNumber: TWILIO_PHONE_NUMBER,

  /**
   * Twilio Service SID
   * This is the unique identifier for the Twilio Verify service
   * used for phone number verification
   */
  serviceSid: TWILIO_SERVICE_SID,
};

/**
 * Validate Twilio configuration
 * This function checks if all required Twilio credentials are present
 */
export function validateTwilioConfig(): void {
  const requiredKeys = ['accountSid', 'authToken', 'phoneNumber', 'serviceSid'];
  const missingKeys = requiredKeys.filter(key => !twilioConfig[key]);

  if (missingKeys.length > 0) {
    throw new Error(`Missing Twilio configuration: ${missingKeys.join(', ')}`);
  }
}

// Validate the Twilio configuration when this module is imported
validateTwilioConfig();

export default twilioConfig;