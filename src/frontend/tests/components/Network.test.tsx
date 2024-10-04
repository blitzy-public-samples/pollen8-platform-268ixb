import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { NetworkDashboard } from '../../components/Network/NetworkDashboard';
import { ConnectionList } from '../../components/Network/ConnectionList';
import { NetworkGraph } from '../../../shared/components/NetworkGraph';
import { ConnectionGrid } from '../../../shared/components/ConnectionGrid';
import { useNetwork } from '../../hooks/useNetwork';
import { theme } from '../../styles/theme';
import { ConnectionWithUser } from '../../shared/types/connection';

// Mock the useNetwork hook
jest.mock('../../hooks/useNetwork');
const mockUseNetwork = useNetwork as jest.MockedFunction<typeof useNetwork>;

// Mock the shared components
jest.mock('../../../shared/components/NetworkGraph', () => ({
  NetworkGraph: jest.fn(() => <div data-testid="network-graph" />),
}));
jest.mock('../../../shared/components/ConnectionGrid', () => ({
  ConnectionGrid: jest.fn(() => <div data-testid="connection-grid" />),
}));

// Mock data
const mockConnections: ConnectionWithUser[] = [
  { id: '1', userId: 'user1', connectedUserId: 'user2', connectionValue: 3.14, user: { id: 'user2', name: 'John Doe' } },
  { id: '2', userId: 'user1', connectedUserId: 'user3', connectionValue: 3.14, user: { id: 'user3', name: 'Jane Smith' } },
];

describe('NetworkDashboard', () => {
  beforeEach(() => {
    mockUseNetwork.mockReturnValue({
      connections: mockConnections,
      fetchConnections: jest.fn(),
      addConnection: jest.fn(),
      removeConnection: jest.fn(),
    });
  });

  const setup = () => {
    return render(
      <ThemeProvider theme={theme}>
        <NetworkDashboard />
      </ThemeProvider>
    );
  };

  test('renders NetworkDashboard with correct initial state', async () => {
    setup();

    expect(screen.getByText('Your Professional Network')).toBeInTheDocument();
    expect(screen.getByText('Total Connections: 2')).toBeInTheDocument();
    expect(screen.getByText('Network Value: 6.28')).toBeInTheDocument();
    expect(screen.getByTestId('network-graph')).toBeInTheDocument();
  });

  test('toggles between graph and grid view', async () => {
    setup();

    expect(screen.getByTestId('network-graph')).toBeInTheDocument();
    expect(screen.queryByTestId('connection-grid')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Grid View'));

    expect(screen.queryByTestId('network-graph')).not.toBeInTheDocument();
    expect(screen.getByTestId('connection-grid')).toBeInTheDocument();
  });

  test('calculates and displays network growth', async () => {
    setup();

    // Assuming the calculateNetworkGrowth function returns 10% for the mock data
    expect(screen.getByText('Network Growth: 10.00%')).toBeInTheDocument();
  });

  test('handles adding a new connection', async () => {
    const { addConnection, fetchConnections } = mockUseNetwork();
    setup();

    fireEvent.click(screen.getByText('Grid View'));
    fireEvent.click(screen.getByText('Add Connection'));

    expect(addConnection).toHaveBeenCalled();
    expect(fetchConnections).toHaveBeenCalled();
  });

  test('handles removing a connection', async () => {
    const { removeConnection, fetchConnections } = mockUseNetwork();
    setup();

    fireEvent.click(screen.getByText('Grid View'));
    fireEvent.click(screen.getByText('Remove Connection'));

    expect(removeConnection).toHaveBeenCalled();
    expect(fetchConnections).toHaveBeenCalled();
  });
});

describe('ConnectionList', () => {
  test('renders ConnectionList with correct data', () => {
    render(<ConnectionList connections={mockConnections} onSelect={jest.fn()} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  test('calls onSelect when a connection is clicked', () => {
    const mockOnSelect = jest.fn();
    render(<ConnectionList connections={mockConnections} onSelect={mockOnSelect} />);

    fireEvent.click(screen.getByText('John Doe'));
    expect(mockOnSelect).toHaveBeenCalledWith('user2');
  });
});

// Additional tests for NetworkGraph and ConnectionGrid components can be added here
// These tests would focus on the specific functionality of these shared components
// within the context of the Network feature