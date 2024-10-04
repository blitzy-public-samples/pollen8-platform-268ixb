import { TwilioConfig } from '../../config/twilio.config';
import twilio from 'twilio';

/**
 * Utility functions for handling phone number verification in the Pollen8 platform.
 * This module addresses the requirement for ensuring authentic professional relationships
 * through phone number verification as specified in the Technical specification/1.1 System Objectives/Verified Connections.
 */

/**
 * Generates a random verification code for phone number verification.
 * @returns {string} A randomly generated verification code
 */
export function generateVerificationCode(): string {
  // Generate a 6-digit random verification code
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Sends an SMS with the verification code to the provided phone number using Twilio.
 * @param {string} phoneNumber - The phone number to send the verification code to
 * @param {string} code - The verification code to be sent
 * @returns {Promise<boolean>} A boolean indicating whether the SMS was sent successfully
 */
export async function sendVerificationSMS(phoneNumber: string, code: string): Promise<boolean> {
  try {
    const client = twilio(TwilioConfig.accountSid, TwilioConfig.authToken);
    
    const message = await client.messages.create({
      body: `Your Pollen8 verification code is: ${code}`,
      from: TwilioConfig.phoneNumber,
      to: phoneNumber
    });

    // If the message sid is present, it means the message was sent successfully
    return !!message.sid;
  } catch (error) {
    console.error('Error sending verification SMS:', error);
    return false;
  }
}

/**
 * Verifies if the provided code matches the one sent to the phone number.
 * Note: This is a simplified version. In a real-world scenario, you would typically
 * store the generated code securely (e.g., in a database or cache) along with the phone number and a timestamp.
 * 
 * @param {string} phoneNumber - The phone number to verify
 * @param {string} code - The verification code provided by the user
 * @returns {Promise<boolean>} A boolean indicating whether the verification was successful
 */
export async function verifyPhoneNumber(phoneNumber: string, code: string): Promise<boolean> {
  // In a real implementation, you would retrieve the stored code for the given phone number
  // and compare it with the provided code. You would also check if the code has expired.
  
  // For demonstration purposes, we'll assume the code is always "123456"
  const storedCode = "123456";
  
  return code === storedCode;
}

/**
 * This module provides utility functions for phone verification in the Pollen8 platform.
 * It includes functions for generating verification codes, sending SMS, and verifying phone numbers.
 * 
 * Note: The current implementation is simplified for demonstration purposes.
 * In a production environment, consider the following enhancements:
 * 1. Secure storage of verification codes (e.g., in a database or cache)
 * 2. Implement expiration for verification codes
 * 3. Rate limiting for SMS sending and verification attempts
 * 4. Error handling and logging for better debugging and monitoring
 * 5. Implement retry logic for SMS sending in case of temporary failures
 */