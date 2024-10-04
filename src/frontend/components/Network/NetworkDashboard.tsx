import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import NetworkGraph from '../../shared/components/NetworkGraph';
import ConnectionGrid from '../../shared/components/ConnectionGrid';
import useNetwork from '../../hooks/useNetwork';
import { ConnectionWithUser } from '../../shared/types/connection';
import { calculateNetworkGrowth } from '../../shared/utils/networkCalculations';

/**
 * NetworkDashboard component serves as the main view for displaying and managing a user's professional network.
 * 
 * Requirements addressed:
 * 1. Visual Network Management (Technical specification/1.1 System Objectives)
 * 2. Quantifiable Networking (Technical specification/1.1 System Objectives)
 * 3. Strategic Growth Tools (Technical specification/1.1 System Objectives)
 */
const NetworkDashboard: React.FC = () => {
  const theme = useTheme();
  const { connections, fetchConnections, addConnection, removeConnection } = useNetwork();
  const [viewMode, setViewMode] = useState<'graph' | 'grid'>('graph');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [networkGrowth, setNetworkGrowth] = useState<number>(0);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  useEffect(() => {
    const growth = calculateNetworkGrowth(connections);
    setNetworkGrowth(growth);
  }, [connections]);

  const handleNodeClick = (userId: string) => {
    setSelectedUserId(userId);
    // TODO: Implement logic to show user details or actions
  };

  const handleAddConnection = async (userId: string) => {
    await addConnection(userId);
    fetchConnections(); // Refresh the connections list
  };

  const handleRemoveConnection = async (userId: string) => {
    await removeConnection(userId);
    fetchConnections(); // Refresh the connections list
  };

  const renderNetworkStats = () => (
    <div className="network-stats" style={{ marginBottom: theme.spacing(3) }}>
      <h2>Network Statistics</h2>
      <p>Total Connections: {connections.length}</p>
      <p>Network Value: {calculateNetworkValue(connections).toFixed(2)}</p>
      <p>Network Growth: {networkGrowth.toFixed(2)}%</p>
    </div>
  );

  const renderViewToggle = () => (
    <div className="view-toggle" style={{ marginBottom: theme.spacing(2) }}>
      <button onClick={() => setViewMode('graph')} disabled={viewMode === 'graph'}>
        Graph View
      </button>
      <button onClick={() => setViewMode('grid')} disabled={viewMode === 'grid'}>
        Grid View
      </button>
    </div>
  );

  return (
    <div className="network-dashboard">
      <h1>Your Professional Network</h1>
      {renderNetworkStats()}
      {renderViewToggle()}
      {viewMode === 'graph' ? (
        <NetworkGraph connections={connections} onNodeClick={handleNodeClick} />
      ) : (
        <ConnectionGrid
          connections={connections}
          onAddConnection={handleAddConnection}
          onRemoveConnection={handleRemoveConnection}
        />
      )}
      {/* TODO: Implement ConnectionList component */}
      {/* <ConnectionList connections={connections} onSelect={handleNodeClick} /> */}
    </div>
  );
};

// Helper function to calculate network value
const calculateNetworkValue = (connections: ConnectionWithUser[]): number => {
  return connections.reduce((total, connection) => total + connection.connectionValue, 0);
};

export default NetworkDashboard;