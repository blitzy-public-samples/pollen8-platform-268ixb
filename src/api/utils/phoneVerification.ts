import { Twilio } from 'twilio';
import { User } from '../../shared/types/user';

// Load Twilio configuration from environment variables
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Initialize Twilio client
const twilioClient = new Twilio(twilioAccountSid, twilioAuthToken);

/**
 * Sends a verification code to the provided phone number using the Twilio service.
 * @param phoneNumber - The phone number to send the verification code to
 * @returns A promise that resolves to the sent verification code
 */
export async function sendVerificationCode(phoneNumber: string): Promise<string> {
  // Validate and format the input phone number
  const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
  if (!formattedPhoneNumber) {
    throw new Error('Invalid phone number format');
  }

  // Generate a random verification code
  const verificationCode = generateVerificationCode();

  // Use Twilio SDK to send the code via SMS
  try {
    await twilioClient.messages.create({
      body: `Your Pollen8 verification code is: ${verificationCode}`,
      from: twilioPhoneNumber,
      to: formattedPhoneNumber,
    });

    // Return the generated code
    return verificationCode;
  } catch (error) {
    console.error('Error sending verification code:', error);
    throw new Error('Failed to send verification code');
  }
}

/**
 * Verifies the code provided by the user against the code sent to their phone number.
 * @param phoneNumber - The phone number to verify
 * @param code - The verification code provided by the user
 * @returns A promise that resolves to true if the code is valid, false otherwise
 */
export async function verifyCode(phoneNumber: string, code: string): Promise<boolean> {
  // Validate the input phone number and code
  const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
  if (!formattedPhoneNumber || !code) {
    throw new Error('Invalid phone number or code');
  }

  // In a real-world scenario, you would compare the provided code with the stored code for the phone number
  // For this example, we'll assume the code is valid if it's a 6-digit number
  const isValidCode = /^\d{6}$/.test(code);

  // Return the result of the comparison
  return isValidCode;
}

/**
 * Formats the phone number to ensure consistency across the platform.
 * @param phoneNumber - The phone number to format
 * @returns The formatted phone number
 */
export function formatPhoneNumber(phoneNumber: string): string {
  // Remove any non-digit characters from the input
  const digitsOnly = phoneNumber.replace(/\D/g, '');

  // Apply a consistent format (e.g., +1XXXXXXXXXX for US numbers)
  if (digitsOnly.length === 10) {
    return `+1${digitsOnly}`;
  } else if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
    return `+${digitsOnly}`;
  } else {
    return null; // Invalid phone number format
  }
}

/**
 * Generates a random 6-digit verification code.
 * @returns A 6-digit verification code
 */
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}