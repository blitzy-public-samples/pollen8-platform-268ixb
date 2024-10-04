import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography, TextField, Button, Chip, Box } from '@mui/material';
import { PersonIcon, SearchIcon, SortIcon } from '@mui/icons-material';
import { ConnectionWithUser, ConnectionSortOption } from '../../../shared/types/connection';
import { useNetwork } from '../../hooks/useNetwork';
import { formatDate } from '../../../shared/utils/formatting';
import { debounce } from 'lodash';

/**
 * ConnectionList component displays a list of user connections with sorting, filtering, and search capabilities.
 * 
 * Requirements addressed:
 * 1. Visual Network Management (Technical specification/1.1 System Objectives)
 * 2. Quantifiable Networking (Technical specification/1.1 System Objectives)
 * 3. Industry-specific analytics (Technical specification/1.1 System Objectives/Quantifiable Networking)
 */
const ConnectionList: React.FC = () => {
  const [{ connections, isLoading, error }, { fetchConnections }] = useNetwork();
  const [sortOption, setSortOption] = useState<ConnectionSortOption>('connectionValue');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState<string | null>(null);

  const handleSort = (option: ConnectionSortOption) => {
    if (option === sortOption) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortOption(option);
      setSortOrder('desc');
    }
  };

  const debouncedFetchConnections = useMemo(
    () => debounce((queryParams) => fetchConnections(queryParams), 300),
    [fetchConnections]
  );

  useEffect(() => {
    debouncedFetchConnections({
      sortBy: sortOption,
      sortOrder,
      industry: industryFilter,
    });
  }, [debouncedFetchConnections, sortOption, sortOrder, industryFilter]);

  const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    debouncedFetchConnections({ search: event.target.value });
  }, [debouncedFetchConnections]);

  const handleIndustryFilter = (industry: string | null) => {
    setIndustryFilter(industry);
  };

  const filteredConnections = useMemo(() => {
    return connections.filter((connection) =>
      connection.connectedUser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      connection.connectedUser.industry.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [connections, searchTerm]);

  const renderConnectionItem = (connection: ConnectionWithUser) => (
    <ListItem
      key={connection.id}
      alignItems="flex-start"
      sx={{ borderBottom: '1px solid #e0e0e0', '&:last-child': { borderBottom: 'none' } }}
    >
      <ListItemAvatar>
        <Avatar src={connection.connectedUser.profilePicture} alt={connection.connectedUser.name}>
          <PersonIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={connection.connectedUser.name}
        secondary={
          <React.Fragment>
            <Typography component="span" variant="body2" color="text.primary">
              {connection.connectedUser.industry}
            </Typography>
            <br />
            Connected on: {formatDate(connection.connectedAt)}
            <br />
            Connection Value: {connection.connectionValue.toFixed(2)}
          </React.Fragment>
        }
      />
      <Chip label={connection.connectedUser.industry} onClick={() => handleIndustryFilter(connection.connectedUser.industry)} />
    </ListItem>
  );

  if (isLoading) {
    return <Typography>Loading connections...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <TextField
          placeholder="Search connections"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: <SearchIcon />,
          }}
        />
        <Box>
          <Button
            startIcon={<SortIcon />}
            onClick={() => handleSort('connectionValue')}
            variant={sortOption === 'connectionValue' ? 'contained' : 'outlined'}
            size="small"
            sx={{ mr: 1 }}
          >
            Value
          </Button>
          <Button
            startIcon={<SortIcon />}
            onClick={() => handleSort('connectedAt')}
            variant={sortOption === 'connectedAt' ? 'contained' : 'outlined'}
            size="small"
            sx={{ mr: 1 }}
          >
            Date
          </Button>
          <Button
            startIcon={<SortIcon />}
            onClick={() => handleSort('industry')}
            variant={sortOption === 'industry' ? 'contained' : 'outlined'}
            size="small"
          >
            Industry
          </Button>
        </Box>
      </Box>
      {industryFilter && (
        <Chip
          label={`Industry: ${industryFilter}`}
          onDelete={() => handleIndustryFilter(null)}
          sx={{ mb: 2 }}
        />
      )}
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {filteredConnections.map(renderConnectionItem)}
      </List>
      {filteredConnections.length === 0 && (
        <Typography align="center" sx={{ mt: 2 }}>No connections found.</Typography>
      )}
    </Box>
  );
};

export default ConnectionList;