import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ConnectionWithUser, ConnectionSortOption } from '../types/connection';
import { calculateNetworkValue } from '../utils/networkCalculations';
import { useNetworkValue, formatNetworkValue, getNetworkValueColor } from '../hooks/useNetworkValue';

/**
 * Props for the ConnectionGrid component
 */
interface ConnectionGridProps {
  connections: ConnectionWithUser[];
  onConnectionClick: (connection: ConnectionWithUser) => void;
}

/**
 * ConnectionGrid component displays a grid of user connections in the Pollen8 platform,
 * providing a visual representation of a user's network.
 * 
 * Requirements addressed:
 * 1. Visual Network Management (Technical Specification/1.1 System Objectives)
 * 2. Connection Grid Views (Technical Specification/1.1 System Objectives/Visual Network Management)
 */
export const ConnectionGrid: React.FC<ConnectionGridProps> = ({ connections, onConnectionClick }) => {
  // State for sorting and filtering
  const [sortBy, setSortBy] = useState<ConnectionSortOption>('connectionValue');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [industryFilter, setIndustryFilter] = useState<string>('');

  // Use custom hook to calculate and manage network value
  const [networkValue, recalculateNetworkValue] = useNetworkValue(connections);

  // Memoized sorted and filtered connections
  const sortedAndFilteredConnections = useMemo(() => {
    let filteredConnections = connections;

    // Apply industry filter
    if (industryFilter) {
      filteredConnections = filteredConnections.filter(connection =>
        connection.industries.includes(industryFilter)
      );
    }

    // Sort connections
    return filteredConnections.sort((a, b) => {
      if (sortBy === 'connectionValue') {
        return sortOrder === 'asc' ? a.connectionValue - b.connectionValue : b.connectionValue - a.connectionValue;
      } else if (sortBy === 'connectedAt') {
        return sortOrder === 'asc' ? a.connectedAt.getTime() - b.connectedAt.getTime() : b.connectedAt.getTime() - a.connectedAt.getTime();
      } else {
        // Sort by industry (first industry in the list)
        const industryA = a.industries[0] || '';
        const industryB = b.industries[0] || '';
        return sortOrder === 'asc' ? industryA.localeCompare(industryB) : industryB.localeCompare(industryA);
      }
    });
  }, [connections, sortBy, sortOrder, industryFilter]);

  // Effect to recalculate network value when connections change
  useEffect(() => {
    recalculateNetworkValue();
  }, [connections, recalculateNetworkValue]);

  // Callback for changing sort options
  const handleSortChange = useCallback((option: ConnectionSortOption) => {
    setSortBy(option);
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
  }, []);

  // Render individual connection card
  const renderConnectionCard = useCallback((connection: ConnectionWithUser) => (
    <div
      key={connection.id}
      className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onConnectionClick(connection)}
    >
      <h3 className="text-lg font-semibold mb-2">{connection.connectedUser.name}</h3>
      <p className="text-sm text-gray-600 mb-1">Industries: {connection.industries.join(', ')}</p>
      <p className="text-sm text-gray-600 mb-1">Connected: {connection.connectedAt.toLocaleDateString()}</p>
      <p className="text-sm font-bold" style={{ color: getNetworkValueColor(connection.connectionValue) }}>
        Value: {formatNetworkValue(connection.connectionValue)}
      </p>
    </div>
  ), [onConnectionClick]);

  return (
    <div className="connection-grid">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Network</h2>
        <p className="text-lg">
          Total Network Value: <span className="font-bold">{formatNetworkValue(networkValue)}</span>
        </p>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <div>
          <label htmlFor="sortBy" className="mr-2">Sort by:</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value as ConnectionSortOption)}
            className="border rounded p-1"
          >
            <option value="connectionValue">Value</option>
            <option value="connectedAt">Date Connected</option>
            <option value="industry">Industry</option>
          </select>
          <button
            onClick={() => setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc')}
            className="ml-2 p-1 border rounded"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
        <div>
          <label htmlFor="industryFilter" className="mr-2">Filter by Industry:</label>
          <input
            id="industryFilter"
            type="text"
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="border rounded p-1"
            placeholder="Enter industry"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedAndFilteredConnections.map(renderConnectionCard)}
      </div>

      {sortedAndFilteredConnections.length === 0 && (
        <p className="text-center text-gray-600 mt-8">No connections found. Start building your network!</p>
      )}
    </div>
  );
};

export default ConnectionGrid;