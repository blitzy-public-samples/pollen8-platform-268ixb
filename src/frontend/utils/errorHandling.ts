/**
 * This file contains utility functions for handling errors in the frontend of the Pollen8 application.
 * It provides a centralized way to manage, log, and display errors to users, ensuring a consistent
 * error handling approach across the application.
 *
 * Requirements addressed:
 * 1. Error Logging (Technical Specification/1.1 System Objectives/Quantifiable Networking)
 * 2. User Feedback (Technical Specification/1.2 Scope/Core Functionalities)
 */

import axios, { AxiosError } from 'axios';
import { showToast } from '../components/UI/Toast';
import { logEvent } from './analytics';

/**
 * Handles errors from API calls made using Axios.
 * It processes the error, logs it, and displays an appropriate message to the user.
 * 
 * @param error - The AxiosError object from the failed API call
 */
export const handleApiError = (error: AxiosError): void => {
  // Extract error details
  const statusCode = error.response?.status;
  const errorMessage = error.response?.data?.message || error.message;

  // Log the error
  logError(error, 'API Error');

  // Determine user-friendly error message
  const userMessage = getUserFriendlyErrorMessage(statusCode, errorMessage);

  // Display error message to user
  displayErrorMessage(userMessage);
};

/**
 * Logs errors to the console and potentially to an error tracking service.
 * It includes additional context if provided.
 * 
 * @param error - The Error object to be logged
 * @param context - Additional context about where the error occurred
 */
export const logError = (error: Error, context: string = 'General Error'): void => {
  // Console log the error and context
  console.error(`${context}:`, error);

  // Use the logEvent function from analytics to track the error
  logEvent('ERROR', {
    context,
    message: error.message,
    stack: error.stack,
  });

  // If an error tracking service is integrated, send the error details to it
  // This is a placeholder for future implementation
  // sendToErrorTrackingService(error, context);
};

/**
 * Displays an error message to the user using the Toast component.
 * 
 * @param message - The error message to be displayed
 */
export const displayErrorMessage = (message: string): void => {
  showToast({
    message,
    type: 'error',
    duration: 5000, // Display for 5 seconds
  });
};

/**
 * Determines a user-friendly error message based on the status code and error message.
 * 
 * @param statusCode - The HTTP status code of the error
 * @param errorMessage - The original error message
 * @returns A user-friendly error message
 */
const getUserFriendlyErrorMessage = (statusCode?: number, errorMessage?: string): string => {
  switch (statusCode) {
    case 400:
      return 'The request was invalid. Please check your input and try again.';
    case 401:
      return 'You are not authorized to perform this action. Please log in and try again.';
    case 403:
      return 'You do not have permission to access this resource.';
    case 404:
      return 'The requested resource was not found. Please check the URL and try again.';
    case 500:
      return 'An unexpected error occurred on our servers. Please try again later.';
    default:
      return errorMessage || 'An unexpected error occurred. Please try again later.';
  }
};

/**
 * Handles errors that occur during form submission.
 * 
 * @param error - The error object from the form submission
 * @param formName - The name of the form where the error occurred
 */
export const handleFormError = (error: Error, formName: string): void => {
  logError(error, `Form Error: ${formName}`);
  displayErrorMessage('There was an error submitting the form. Please check your input and try again.');
};

/**
 * Handles errors that occur during data fetching (e.g., in React Query).
 * 
 * @param error - The error object from the data fetching operation
 * @param queryName - The name of the query where the error occurred
 */
export const handleQueryError = (error: Error, queryName: string): void => {
  logError(error, `Query Error: ${queryName}`);
  displayErrorMessage('There was an error fetching the data. Please try again later.');
};

/**
 * Handles errors that occur during user authentication.
 * 
 * @param error - The error object from the authentication process
 */
export const handleAuthError = (error: Error): void => {
  logError(error, 'Authentication Error');
  displayErrorMessage('There was an error during authentication. Please try again.');
};

/**
 * Handles errors that occur during file upload.
 * 
 * @param error - The error object from the file upload process
 * @param fileName - The name of the file being uploaded
 */
export const handleFileUploadError = (error: Error, fileName: string): void => {
  logError(error, `File Upload Error: ${fileName}`);
  displayErrorMessage('There was an error uploading the file. Please try again.');
};

/**
 * Global error handler for unexpected errors.
 * This can be used as a last resort for catching unhandled errors.
 * 
 * @param error - The error object
 * @param errorInfo - Additional information about the error
 */
export const globalErrorHandler = (error: Error, errorInfo: React.ErrorInfo): void => {
  logError(error, 'Unhandled Error');
  console.error('Error Info:', errorInfo);
  displayErrorMessage('An unexpected error occurred. Our team has been notified.');

  // Here you might want to reset the application state or navigate to an error page
  // depending on the severity of the error
};

// Export all error handling functions
export {
  handleApiError,
  logError,
  displayErrorMessage,
  handleFormError,
  handleQueryError,
  handleAuthError,
  handleFileUploadError,
  globalErrorHandler,
};