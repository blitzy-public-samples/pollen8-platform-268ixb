import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Button from '../UI/Button';
import useAuth from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import theme from '../../../shared/styles/theme';

/**
 * This file defines the Header component for the Pollen8 platform, which is a crucial part of the layout structure.
 * It provides navigation, user authentication status, and maintains the platform's minimalist black and white aesthetic.
 *
 * Requirements addressed:
 * 1. Visual Network Management
 *    Location: Technical specification/1.1 System Objectives/Visual Network Management
 *    Description: Provides consistent UI elements for navigation
 * 
 * 2. Black and White Aesthetic
 *    Location: Technical specification/1.2 Scope/Product Overview
 *    Description: Implements the minimalist design theme
 * 
 * 3. User Authentication
 *    Location: Technical specification/1.2 Scope/Core Functionalities/User Authentication and Profile Creation
 *    Description: Displays user authentication status
 */

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing(2)} ${theme.spacing(4)};
  background-color: ${theme.palette.background.paper};
  color: ${theme.palette.text.primary};
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: ${theme.typography.fontFamily};
`;

const Logo = styled.div`
  font-size: ${theme.typography.h4.fontSize};
  font-weight: ${theme.typography.h4.fontWeight};
  cursor: pointer;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: ${theme.spacing(3)};

  @media (max-width: ${theme.breakpoints.md}) {
    display: none;
  }
`;

const NavLink = styled(Link)<{ active: boolean }>`
  color: ${props => props.active ? theme.palette.primary.main : theme.palette.text.primary};
  text-decoration: none;
  font-weight: ${props => props.active ? 600 : 400};
  transition: color 0.3s ease;

  &:hover {
    color: ${theme.palette.primary.main};
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${theme.palette.text.primary};
  font-size: 24px;
  cursor: pointer;

  @media (max-width: ${theme.breakpoints.md}) {
    display: block;
  }
`;

const MobileMenu = styled.div<{ isOpen: boolean }>`
  display: ${props => props.isOpen ? 'flex' : 'none'};
  flex-direction: column;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: ${theme.palette.background.paper};
  padding: ${theme.spacing(2)};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (min-width: ${theme.breakpoints.md}) {
    display: none;
  }
`;

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const { theme: currentTheme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => router.pathname === path;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > parseInt(theme.breakpoints.md)) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <HeaderContainer>
      <Logo>
        <Link href="/" passHref>
          <span>Pollen8</span>
        </Link>
      </Logo>
      <NavLinks>
        {isAuthenticated && (
          <>
            <NavLink href="/dashboard" active={isActive('/dashboard')}>
              Dashboard
            </NavLink>
            <NavLink href="/network" active={isActive('/network')}>
              Network
            </NavLink>
            <NavLink href="/invites" active={isActive('/invites')}>
              Invites
            </NavLink>
            <NavLink href="/profile" active={isActive('/profile')}>
              Profile
            </NavLink>
          </>
        )}
        <Button
          variant="outline"
          size="small"
          onClick={isAuthenticated ? handleLogout : () => router.push('/auth/verify')}
        >
          {isAuthenticated ? 'Logout' : 'Login'}
        </Button>
        <Button variant="secondary" size="small" onClick={toggleTheme}>
          {currentTheme.palette.mode === 'light' ? '🌙' : '☀️'}
        </Button>
      </NavLinks>
      <MobileMenuButton onClick={toggleMobileMenu}>
        ☰
      </MobileMenuButton>
      <MobileMenu isOpen={isMobileMenuOpen}>
        {isAuthenticated && (
          <>
            <NavLink href="/dashboard" active={isActive('/dashboard')}>
              Dashboard
            </NavLink>
            <NavLink href="/network" active={isActive('/network')}>
              Network
            </NavLink>
            <NavLink href="/invites" active={isActive('/invites')}>
              Invites
            </NavLink>
            <NavLink href="/profile" active={isActive('/profile')}>
              Profile
            </NavLink>
          </>
        )}
        <Button
          variant="outline"
          size="small"
          onClick={isAuthenticated ? handleLogout : () => router.push('/auth/verify')}
        >
          {isAuthenticated ? 'Logout' : 'Login'}
        </Button>
        <Button variant="secondary" size="small" onClick={toggleTheme}>
          {currentTheme.palette.mode === 'light' ? '🌙' : '☀️'}
        </Button>
      </MobileMenu>
    </HeaderContainer>
  );
};

export default React.memo(Header);