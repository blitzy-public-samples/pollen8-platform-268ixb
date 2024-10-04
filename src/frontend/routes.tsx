import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import useAuth from './hooks/useAuth';

// Lazy-loaded components
const HomePage = lazy(() => import('./pages/index'));
const VerifyPage = lazy(() => import('./pages/auth/verify'));
const OnboardingPage = lazy(() => import('./pages/auth/onboarding'));
const DashboardPage = lazy(() => import('./pages/dashboard'));
const ProfilePage = lazy(() => import('./pages/profile'));
const NetworkPage = lazy(() => import('./pages/network'));
const InvitesPage = lazy(() => import('./pages/invites'));
const NotFoundPage = lazy(() => import('./pages/404'));
const ErrorPage = lazy(() => import('./pages/500'));

/**
 * This component defines the routing configuration for the Pollen8 frontend application.
 * It uses React Router with TypeScript to handle navigation and route protection.
 * 
 * Requirements addressed:
 * 1. Frontend Routing (Technical specification/1.1 System Objectives/Visual Network Management)
 *    Description: Define routes for different pages of the application
 * 2. Authentication Flow (Technical specification/9.1 Authentication and Authorization/9.1.1 Authentication Flow)
 *    Description: Handle routes for authentication process
 */

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/" replace />;
};

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route element={<Layout />}>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/auth/verify" element={<VerifyPage />} />
            <Route path="/auth/onboarding" element={<OnboardingPage />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={<PrivateRoute element={<DashboardPage />} />} />
            <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} />
            <Route path="/network" element={<PrivateRoute element={<NetworkPage />} />} />
            <Route path="/invites" element={<PrivateRoute element={<InvitesPage />} />} />

            {/* Error routes */}
            <Route path="/500" element={<ErrorPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;

/**
 * Implementation details:
 * 1. Uses React Router v6 for routing
 * 2. Implements lazy loading for all route components to improve initial load time
 * 3. Wraps all routes with the Layout component for consistent UI
 * 4. Implements a PrivateRoute component to handle authentication-based access control
 * 5. Provides routes for authentication flow (verify and onboarding)
 * 6. Includes routes for main application pages (dashboard, profile, network, invites)
 * 7. Handles error routes (500 and 404)
 * 8. Uses TypeScript for type safety
 * 9. Implements suspense for handling lazy-loaded components
 * 
 * Note: Ensure that the useAuth hook is properly implemented to check authentication status.
 * Additional error handling and loading states should be implemented in individual components.
 */