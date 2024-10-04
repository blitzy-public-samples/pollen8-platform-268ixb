/**
 * This file contains utility functions for input validation across the Pollen8 platform,
 * ensuring data integrity and security.
 * 
 * Requirements addressed:
 * 1. Input Validation (Technical Specification/1.1 System Objectives/Verified Connections)
 * 2. Data Integrity (Technical Specification/9.2 Data Security/9.2.2 Data Access Controls)
 */

import { User, PhoneNumber } from '../types/user';
import { Connection } from '../types/connection';
import { Invite } from '../types/invite';
import { Industry } from '../types/industry';
import { Interest } from '../types/interest';
import { isValid } from 'validator';
import { PhoneNumber as LibPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';

/**
 * Validates if the given string is a valid phone number using the libphonenumber-js library.
 * 
 * @param phoneNumber - The phone number to validate
 * @returns True if the phone number is valid, false otherwise
 */
export function validatePhoneNumber(phoneNumber: string): boolean {
  try {
    const parsedNumber = parsePhoneNumber(phoneNumber);
    return parsedNumber.isValid();
  } catch (error) {
    return false;
  }
}

/**
 * Validates if the given string is a valid email address using the validator library.
 * 
 * @param email - The email address to validate
 * @returns True if the email is valid, false otherwise
 */
export function validateEmail(email: string): boolean {
  return isValid.isEmail(email);
}

/**
 * Validates if the given string meets the password requirements (e.g., minimum length, complexity).
 * 
 * @param password - The password to validate
 * @returns True if the password meets the requirements, false otherwise
 */
export function validatePassword(password: string): boolean {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    password.length >= minLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSpecialChar
  );
}

/**
 * Validates if the given array of industries meets the minimum requirement (at least 3)
 * and contains valid industry names.
 * 
 * @param industries - The array of industries to validate
 * @returns True if the industries array is valid, false otherwise
 */
export function validateIndustries(industries: string[]): boolean {
  const minIndustries = 3;
  const uniqueIndustries = new Set(industries);

  return (
    industries.length >= minIndustries &&
    industries.every((industry) => industry.trim().length > 0) &&
    uniqueIndustries.size === industries.length
  );
}

/**
 * Validates if the given array of interests meets the minimum requirement (at least 3)
 * and contains valid interest names.
 * 
 * @param interests - The array of interests to validate
 * @returns True if the interests array is valid, false otherwise
 */
export function validateInterests(interests: string[]): boolean {
  const minInterests = 3;
  const uniqueInterests = new Set(interests);

  return (
    interests.length >= minInterests &&
    interests.every((interest) => interest.trim().length > 0) &&
    uniqueInterests.size === interests.length
  );
}

/**
 * Validates if the given string is a valid ZIP code format.
 * 
 * @param zipCode - The ZIP code to validate
 * @returns True if the ZIP code is valid, false otherwise
 */
export function validateZipCode(zipCode: string): boolean {
  return isValid.isPostalCode(zipCode, 'US');
}

/**
 * Validates if the given string is a valid invite URL format.
 * 
 * @param url - The invite URL to validate
 * @returns True if the invite URL is valid, false otherwise
 */
export function validateInviteUrl(url: string): boolean {
  const isValidUrl = isValid.isURL(url, {
    protocols: ['https'],
    require_protocol: true,
    require_host: true,
  });

  const expectedDomain = 'pollen8.com';
  const expectedPath = '/invite/';

  return (
    isValidUrl &&
    url.includes(expectedDomain) &&
    url.includes(expectedPath)
  );
}

/**
 * Validates a User object to ensure all required fields are present and valid.
 * 
 * @param user - The User object to validate
 * @returns True if the User object is valid, false otherwise
 */
export function validateUser(user: Partial<User>): boolean {
  return (
    !!user.id &&
    validatePhoneNumber(user.phoneNumber as string) &&
    validateIndustries(user.industries?.map((i) => i.name) || []) &&
    validateInterests(user.interests?.map((i) => i.name) || []) &&
    !!user.city &&
    validateZipCode(user.zipCode as string) &&
    !!user.createdAt &&
    !!user.lastLogin
  );
}

/**
 * Validates a Connection object to ensure all required fields are present and valid.
 * 
 * @param connection - The Connection object to validate
 * @returns True if the Connection object is valid, false otherwise
 */
export function validateConnection(connection: Partial<Connection>): boolean {
  return (
    !!connection.id &&
    !!connection.userId &&
    !!connection.connectedUserId &&
    typeof connection.connectionValue === 'number' &&
    connection.connectionValue >= 0 &&
    !!connection.connectedAt &&
    Array.isArray(connection.industries) &&
    connection.industries.every((industry) => typeof industry === 'string')
  );
}

/**
 * Validates an Invite object to ensure all required fields are present and valid.
 * 
 * @param invite - The Invite object to validate
 * @returns True if the Invite object is valid, false otherwise
 */
export function validateInvite(invite: Partial<Invite>): boolean {
  return (
    !!invite.id &&
    !!invite.userId &&
    !!invite.name &&
    validateInviteUrl(invite.url as string) &&
    typeof invite.clickCount === 'number' &&
    invite.clickCount >= 0 &&
    !!invite.createdAt
  );
}

/**
 * Validates an Industry object to ensure all required fields are present and valid.
 * 
 * @param industry - The Industry object to validate
 * @returns True if the Industry object is valid, false otherwise
 */
export function validateIndustry(industry: Partial<Industry>): boolean {
  return (
    !!industry.id &&
    !!industry.name &&
    industry.name.trim().length > 0
  );
}

/**
 * Validates an Interest object to ensure all required fields are present and valid.
 * 
 * @param interest - The Interest object to validate
 * @returns True if the Interest object is valid, false otherwise
 */
export function validateInterest(interest: Partial<Interest>): boolean {
  return (
    !!interest.id &&
    !!interest.name &&
    interest.name.trim().length > 0
  );
}