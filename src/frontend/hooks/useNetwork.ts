/**
 * This file defines a custom React hook for managing network-related operations and state in the Pollen8 platform's frontend.
 * 
 * Requirements addressed:
 * 1. Network Management (Technical Specification/1.1 System Objectives/Visual Network Management)
 * 2. Quantifiable Networking (Technical Specification/1.1 System Objectives/Quantifiable Networking)
 * 3. Visual Network Management (Technical Specification/1.1 System Objectives/Visual Network Management)
 */

import { useState, useEffect, useCallback } from 'react';
import { Connection, ConnectionWithUser, CreateConnectionDto, ConnectionQueryParams, ConnectionAnalytics } from '../../shared/types/connection';
import NetworkService from '../../shared/api/networkService';
import { calculateNetworkGrowth } from '../../shared/utils/networkCalculations';
import { useNetworkValue } from '../../shared/hooks/useNetworkValue';

interface NetworkState {
  connections: Connection[];
  networkValue: number;
  networkGrowth: number;
  isLoading: boolean;
  error: string | null;
}

interface NetworkOperations {
  fetchConnections: (queryParams?: ConnectionQueryParams) => Promise<void>;
  createConnection: (connectionData: CreateConnectionDto) => Promise<void>;
  removeConnection: (connectionId: string) => Promise<void>;
  getConnectionDetails: (connectionId: string) => Promise<ConnectionWithUser>;
  getNetworkAnalytics: () => Promise<ConnectionAnalytics>;
  searchPotentialConnections: (query: string, queryParams?: ConnectionQueryParams) => Promise<Connection[]>;
}

export const useNetwork = (): [NetworkState, NetworkOperations] => {
  const [state, setState] = useState<NetworkState>({
    connections: [],
    networkValue: 0,
    networkGrowth: 0,
    isLoading: true,
    error: null,
  });

  const [networkValue, recalculateNetworkValue] = useNetworkValue(state.connections);

  const fetchConnections = useCallback(async (queryParams?: ConnectionQueryParams) => {
    setState(prevState => ({ ...prevState, isLoading: true, error: null }));
    try {
      const connections = await NetworkService.getConnections(queryParams);
      setState(prevState => ({ ...prevState, connections, isLoading: false }));
    } catch (error) {
      setState(prevState => ({ ...prevState, isLoading: false, error: 'Failed to fetch connections' }));
    }
  }, []);

  const createConnection = useCallback(async (connectionData: CreateConnectionDto) => {
    setState(prevState => ({ ...prevState, isLoading: true, error: null }));
    try {
      const newConnection = await NetworkService.createConnection(connectionData);
      setState(prevState => ({
        ...prevState,
        connections: [...prevState.connections, newConnection],
        isLoading: false,
      }));
      recalculateNetworkValue();
    } catch (error) {
      setState(prevState => ({ ...prevState, isLoading: false, error: 'Failed to create connection' }));
    }
  }, [recalculateNetworkValue]);

  const removeConnection = useCallback(async (connectionId: string) => {
    setState(prevState => ({ ...prevState, isLoading: true, error: null }));
    try {
      await NetworkService.removeConnection(connectionId);
      setState(prevState => ({
        ...prevState,
        connections: prevState.connections.filter(conn => conn.id !== connectionId),
        isLoading: false,
      }));
      recalculateNetworkValue();
    } catch (error) {
      setState(prevState => ({ ...prevState, isLoading: false, error: 'Failed to remove connection' }));
    }
  }, [recalculateNetworkValue]);

  const getConnectionDetails = useCallback(async (connectionId: string): Promise<ConnectionWithUser> => {
    try {
      return await NetworkService.getConnectionDetails(connectionId);
    } catch (error) {
      throw new Error('Failed to fetch connection details');
    }
  }, []);

  const getNetworkAnalytics = useCallback(async (): Promise<ConnectionAnalytics> => {
    try {
      return await NetworkService.getNetworkAnalytics();
    } catch (error) {
      throw new Error('Failed to fetch network analytics');
    }
  }, []);

  const searchPotentialConnections = useCallback(async (query: string, queryParams?: ConnectionQueryParams): Promise<Connection[]> => {
    try {
      return await NetworkService.searchPotentialConnections(query, queryParams);
    } catch (error) {
      throw new Error('Failed to search potential connections');
    }
  }, []);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  useEffect(() => {
    setState(prevState => ({ ...prevState, networkValue }));
  }, [networkValue]);

  useEffect(() => {
    const calculateGrowth = async () => {
      try {
        const analytics = await NetworkService.getNetworkAnalytics();
        const previousValue = analytics.totalConnectionValue - networkValue;
        const growth = calculateNetworkGrowth(networkValue, previousValue);
        setState(prevState => ({ ...prevState, networkGrowth: growth }));
      } catch (error) {
        console.error('Failed to calculate network growth:', error);
      }
    };

    calculateGrowth();
  }, [networkValue]);

  const networkOperations: NetworkOperations = {
    fetchConnections,
    createConnection,
    removeConnection,
    getConnectionDetails,
    getNetworkAnalytics,
    searchPotentialConnections,
  };

  return [state, networkOperations];
};

export default useNetwork;