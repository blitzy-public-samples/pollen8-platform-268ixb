import React from 'react';
import styled from 'styled-components';
import { User } from '../../../shared/types/user';
import Button from '../UI/Button';
import useProfile from '../../hooks/useProfile';

/**
 * This file contains a React component that displays a user's profile information
 * in a card format for the Pollen8 platform, adhering to the minimalist black and white design aesthetic.
 * 
 * Requirements addressed:
 * 1. User Profile Display (Technical specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation)
 * 2. Industry Display (Technical specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation)
 * 3. Interest Display (Technical specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation)
 * 4. Location Display (Technical specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation)
 * 5. Visual Design (Technical specification/1.2 Scope/Product Overview)
 */

interface ProfileCardProps {
  user: User;
}

const CardContainer = styled.div`
  background-color: #ffffff;
  border: 2px solid #000000;
  border-radius: 8px;
  padding: 24px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ProfileInfo = styled.div`
  margin-bottom: 16px;
`;

const ProfileSection = styled.div`
  margin-bottom: 16px;

  h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  li {
    font-size: 14px;
    margin-bottom: 4px;
  }
`;

const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  const { updateProfile } = useProfile();

  const handleEditProfile = () => {
    // Implement the logic to navigate to the profile edit page or open a modal
    console.log('Edit profile clicked');
  };

  return (
    <CardContainer>
      <ProfileInfo>
        <h2>{user.phoneNumber}</h2>
        <p>{user.city}, {user.zipCode}</p>
      </ProfileInfo>

      <ProfileSection>
        <h3>Industries</h3>
        <ul>
          {user.industries.map((industry, index) => (
            <li key={`industry-${index}`}>{industry.name}</li>
          ))}
        </ul>
      </ProfileSection>

      <ProfileSection>
        <h3>Interests</h3>
        <ul>
          {user.interests.map((interest, index) => (
            <li key={`interest-${index}`}>{interest.name}</li>
          ))}
        </ul>
      </ProfileSection>

      <Button
        variant="primary"
        size="medium"
        fullWidth
        onClick={handleEditProfile}
      >
        Edit Profile
      </Button>
    </CardContainer>
  );
};

export default ProfileCard;