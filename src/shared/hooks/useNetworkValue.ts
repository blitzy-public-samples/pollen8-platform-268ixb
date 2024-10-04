/**
 * This file defines a custom React hook for calculating and managing network value in the Pollen8 platform.
 * 
 * Requirements addressed:
 * 1. Quantifiable Networking (Technical Specification/1.1 System Objectives/Quantifiable Networking)
 * 2. Network Value Calculation (Technical Specification/1.1 System Objectives/Quantifiable Networking)
 */

import { useState, useEffect, useCallback } from 'react';
import { Connection } from '../types/connection';
import { CONNECTION_VALUE } from '../constants/networkValues';
import { calculateNetworkValue } from '../utils/networkCalculations';

/**
 * Custom hook for calculating and managing network value based on user connections.
 * 
 * @param connections - An array of Connection objects representing the user's network
 * @returns A tuple containing the current network value and a function to manually trigger recalculation
 */
export const useNetworkValue = (connections: Connection[]): [number, () => void] => {
  // Initialize state for network value
  const [networkValue, setNetworkValue] = useState<number>(0);

  /**
   * Function to calculate the network value using the provided utility function
   */
  const calculateValue = useCallback(() => {
    try {
      const value = calculateNetworkValue(connections);
      setNetworkValue(value);
    } catch (error) {
      console.error('Error calculating network value:', error);
      // In case of error, fallback to a simple calculation
      setNetworkValue(connections.length * CONNECTION_VALUE);
    }
  }, [connections]);

  /**
   * Effect to recalculate network value when connections change
   */
  useEffect(() => {
    calculateValue();
  }, [connections, calculateValue]);

  /**
   * Function to manually trigger network value recalculation
   */
  const recalculateNetworkValue = useCallback(() => {
    calculateValue();
  }, [calculateValue]);

  return [networkValue, recalculateNetworkValue];
};

/**
 * Helper function to format the network value for display
 * 
 * @param value - The network value to format
 * @returns A formatted string representation of the network value
 */
export const formatNetworkValue = (value: number): string => {
  return value.toFixed(2);
};

/**
 * Helper function to calculate the network growth percentage
 * 
 * @param currentValue - The current network value
 * @param previousValue - The previous network value
 * @returns The growth percentage as a number
 */
export const calculateNetworkGrowth = (currentValue: number, previousValue: number): number => {
  if (previousValue === 0) return currentValue > 0 ? 100 : 0;
  return ((currentValue - previousValue) / previousValue) * 100;
};

/**
 * Helper function to get a color code based on network value
 * This can be used for visual representation of network strength
 * 
 * @param value - The network value
 * @returns A string representing a color code
 */
export const getNetworkValueColor = (value: number): string => {
  if (value >= 100) return '#00FF00'; // Green for high value
  if (value >= 50) return '#FFFF00';  // Yellow for medium value
  return '#FF0000';                   // Red for low value
};

/**
 * Custom hook for tracking network value history
 * 
 * @param currentValue - The current network value
 * @returns An array of historical network values
 */
export const useNetworkValueHistory = (currentValue: number): number[] => {
  const [history, setHistory] = useState<number[]>([]);

  useEffect(() => {
    setHistory(prevHistory => {
      const newHistory = [...prevHistory, currentValue].slice(-10); // Keep last 10 values
      return newHistory;
    });
  }, [currentValue]);

  return history;
};