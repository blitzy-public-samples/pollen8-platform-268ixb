/**
 * This file contains utility functions for formatting various data types used throughout the Pollen8 application.
 * 
 * Requirements addressed:
 * - Data Formatting (Technical Specification/1.1 System Objectives/Quantifiable Networking)
 *   Provide consistent formatting for user-facing data
 */

import { format } from 'date-fns';
import { User, Connection, Invite } from '../types';
import { CONNECTION_VALUE } from '../constants/networkValues';

/**
 * Formats a phone number string into a standardized format (e.g., (123) 456-7890).
 * 
 * @param phoneNumber - The phone number to format
 * @returns The formatted phone number string
 */
export function formatPhoneNumber(phoneNumber: string): string {
  // Remove all non-digit characters from the input
  const cleaned = phoneNumber.replace(/\D/g, '');

  // Check if the cleaned number has 10 digits
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }

  // If invalid, return the original input
  return phoneNumber;
}

/**
 * Calculates and formats the network value based on the number of connections.
 * 
 * @param connections - The number of connections
 * @returns The formatted network value string
 */
export function formatNetworkValue(connections: number): string {
  const networkValue = connections * CONNECTION_VALUE;
  return networkValue.toFixed(2);
}

/**
 * Formats a Date object into a user-friendly string (e.g., "Jan 1, 2023").
 * 
 * @param date - The Date object to format
 * @returns The formatted date string
 */
export function formatDate(date: Date): string {
  return format(date, 'MMM d, yyyy');
}

/**
 * Formats a list of industries into a comma-separated string, limiting to the first three with an indicator if there are more.
 * 
 * @param industries - The array of industry names
 * @returns The formatted industry list string
 */
export function formatIndustryList(industries: string[]): string {
  const displayedIndustries = industries.slice(0, 3);
  const formattedList = displayedIndustries.join(', ');
  return industries.length > 3 ? `${formattedList}, ...` : formattedList;
}

/**
 * Generates a formatted invite URL based on the invite code.
 * 
 * @param inviteCode - The unique invite code
 * @returns The formatted invite URL
 */
export function formatInviteUrl(inviteCode: string): string {
  return `https://pollen8.com/invite/${inviteCode}`;
}

/**
 * Formats a User object into a display name.
 * 
 * @param user - The User object
 * @returns The formatted display name
 */
export function formatUserDisplayName(user: User): string {
  return `${user.firstName} ${user.lastName}`;
}

/**
 * Formats a Connection object into a display string.
 * 
 * @param connection - The Connection object
 * @returns The formatted connection display string
 */
export function formatConnectionDisplay(connection: Connection): string {
  const connectionDate = formatDate(connection.connectedAt);
  return `Connected with ${formatUserDisplayName(connection.connectedUser)} on ${connectionDate}`;
}

/**
 * Formats an Invite object into a display string.
 * 
 * @param invite - The Invite object
 * @returns The formatted invite display string
 */
export function formatInviteDisplay(invite: Invite): string {
  const creationDate = formatDate(invite.createdAt);
  return `Invite "${invite.name}" created on ${creationDate} - ${invite.clickCount} clicks`;
}

/**
 * Formats a number as a percentage string.
 * 
 * @param value - The number to format as a percentage
 * @param decimalPlaces - The number of decimal places to show (default: 1)
 * @returns The formatted percentage string
 */
export function formatPercentage(value: number, decimalPlaces: number = 1): string {
  return `${(value * 100).toFixed(decimalPlaces)}%`;
}

/**
 * Formats a number with thousands separators.
 * 
 * @param value - The number to format
 * @returns The formatted number string
 */
export function formatNumberWithCommas(value: number): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}