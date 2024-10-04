import React, { useState } from 'react';
import styled from 'styled-components';
import { NextPage } from 'next';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import ProfileCard from '../components/Profile/ProfileCard';
import ProfileEdit from '../components/Profile/ProfileEdit';
import Button from '../components/UI/Button';
import { useProfile } from '../hooks/useProfile';
import { User } from '../../shared/types/user';

/**
 * This file contains the Profile page component for the Pollen8 platform, which displays
 * and allows editing of a user's profile information.
 * 
 * Requirements addressed:
 * 1. User Profile Management (Technical specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation)
 * 2. Industry Selection (Technical specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation)
 * 3. Interest Selection (Technical specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation)
 * 4. Location Data (Technical specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation)
 * 5. Visual Design (Technical specification/1.2 Scope/Product Overview)
 */

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${props => props.theme.palette.background.default};
`;

const ProfileContainer = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const ProfilePage: NextPage = () => {
  const { user, updateProfile, loading, error } = useProfile();
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveProfile = async (updatedProfile: User) => {
    try {
      await updateProfile(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <PageContainer>
      <Header />
      <ProfileContainer>
        {isEditing ? (
          <ProfileEdit
            user={user}
            onSave={handleSaveProfile}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
            <ProfileCard user={user} />
            <Button
              variant="primary"
              size="medium"
              onClick={() => setIsEditing(true)}
              style={{ marginTop: '1rem' }}
            >
              Edit Profile
            </Button>
          </>
        )}
      </ProfileContainer>
      <Footer />
    </PageContainer>
  );
};

export default ProfilePage;