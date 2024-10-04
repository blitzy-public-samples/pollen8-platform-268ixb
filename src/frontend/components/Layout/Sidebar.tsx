import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Button from '../UI/Button';
import useAuth from '../../hooks/useAuth';
import useNetwork from '../../hooks/useNetwork';
import { User } from '../../../shared/types/user';
import { API_ENDPOINTS } from '../../../shared/constants/apiEndpoints';

/**
 * Sidebar component for the Pollen8 platform.
 * This component provides navigation and quick access to key features of the application.
 * 
 * Requirements addressed:
 * 1. Visual Network Management
 *    Location: Technical specification/1.1 System Objectives
 *    Description: Offer intuitive network visualization and management
 * 2. Strategic Growth Tools
 *    Location: Technical specification/1.1 System Objectives
 *    Description: Enable targeted network expansion
 */

const SidebarContainer = styled.aside`
  width: 250px;
  height: 100vh;
  background-color: ${props => props.theme.palette.background.paper};
  color: ${props => props.theme.palette.text.primary};
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  transition: width 0.3s ease;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    width: 60px;
    padding: 10px;
  }
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const UserName = styled.span`
  font-weight: bold;
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: none;
  }
`;

const NavList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li<{ active: boolean }>`
  margin-bottom: 10px;
  a {
    display: flex;
    align-items: center;
    padding: 10px;
    text-decoration: none;
    color: ${props => props.active ? props.theme.palette.primary.main : props.theme.palette.text.primary};
    background-color: ${props => props.active ? props.theme.palette.action.selected : 'transparent'};
    border-radius: 5px;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: ${props => props.theme.palette.action.hover};
    }
  }
`;

const NavIcon = styled.span`
  margin-right: 10px;
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    margin-right: 0;
  }
`;

const NavText = styled.span`
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: none;
  }
`;

const NetworkStats = styled.div`
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid ${props => props.theme.palette.divider};
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const Sidebar: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [{ connections, networkValue }, { fetchConnections }] = useNetwork();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  const navItems = useMemo(() => [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/network', label: 'Network', icon: '🌐' },
    { path: '/invites', label: 'Invites', icon: '📨' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ], []);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <SidebarContainer>
      <UserProfile>
        <Avatar src={user?.profilePicture || '/default-avatar.png'} alt="Profile" />
        <UserName>{user?.name}</UserName>
      </UserProfile>
      <NavList>
        {navItems.map((item) => (
          <NavItem key={item.path} active={router.pathname === item.path}>
            <Link href={item.path}>
              <NavIcon>{item.icon}</NavIcon>
              <NavText>{item.label}</NavText>
            </Link>
          </NavItem>
        ))}
      </NavList>
      <NetworkStats>
        <StatItem>
          <span>Connections:</span>
          <span>{connections.length}</span>
        </StatItem>
        <StatItem>
          <span>Network Value:</span>
          <span>${networkValue.toFixed(2)}</span>
        </StatItem>
      </NetworkStats>
      <Button
        variant="outline"
        fullWidth
        onClick={handleLogout}
        aria-label="Logout"
      >
        {isMobile ? '🚪' : 'Logout'}
      </Button>
    </SidebarContainer>
  );
};

export default React.memo(Sidebar);