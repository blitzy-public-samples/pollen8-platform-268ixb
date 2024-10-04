import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { InviteLink } from '@/shared/components/InviteLink';
import { useInviteAnalytics } from '@/shared/hooks/useInviteAnalytics';
import { createInvite, deleteInvite } from '@/shared/api/inviteService';
import { validateInviteName } from '@/shared/utils/validation';
import { Button } from '@/components/UI/Button';
import { Input } from '@/components/UI/Input';
import { Toast } from '@/components/UI/Toast';

/**
 * InviteGenerator component for generating and managing invite links on the Pollen8 platform.
 * 
 * Requirements addressed:
 * 1. Strategic Growth Tools (Technical specification/1.1 System Objectives/Strategic Growth Tools)
 * 2. Invite System (Technical specification/1.1 System Objectives/Strategic Growth Tools)
 * 3. Click Analytics (Technical specification/1.1 System Objectives/Strategic Growth Tools)
 */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #000000;
  border-radius: 8px;
`;

const Title = styled.h2`
  color: #FFFFFF;
  font-family: 'Proxima Nova', sans-serif;
  font-size: 24px;
  margin-bottom: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
`;

const ErrorMessage = styled.p`
  color: #FF0000;
  font-size: 14px;
  margin-top: 0.5rem;
`;

interface InviteGeneratorProps {
  userId: string;
}

export const InviteGenerator: React.FC<InviteGeneratorProps> = ({ userId }) => {
  const [inviteName, setInviteName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const { analytics, loading: analyticsLoading, error: analyticsError } = useInviteAnalytics(generatedLink);

  const generateInvite = useCallback(async () => {
    if (!validateInviteName(inviteName)) {
      setError('Invalid invite name. Please use alphanumeric characters and spaces only.');
      return;
    }

    try {
      const invite = await createInvite({ name: inviteName, userId });
      setGeneratedLink(invite.url);
      setError('');
      setToastMessage('Invite link generated successfully!');
      setShowToast(true);
    } catch (err) {
      setError('Failed to generate invite link. Please try again.');
      console.error('Error generating invite:', err);
    }
  }, [inviteName, userId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateInvite();
  };

  const handleDeleteInvite = async () => {
    try {
      await deleteInvite(generatedLink);
      setGeneratedLink('');
      setToastMessage('Invite link deleted successfully!');
      setShowToast(true);
    } catch (err) {
      setError('Failed to delete invite link. Please try again.');
      console.error('Error deleting invite:', err);
    }
  };

  return (
    <Container>
      <Title>Generate Invite Link</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          value={inviteName}
          onChange={(e) => setInviteName(e.target.value)}
          placeholder="Enter invite name"
          required
        />
        <Button type="submit">Generate Invite</Button>
      </Form>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {generatedLink && (
        <InviteLink
          inviteUrl={generatedLink}
          onDelete={handleDeleteInvite}
          analytics={analytics}
          loading={analyticsLoading}
          error={analyticsError}
        />
      )}
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </Container>
  );
};

export default InviteGenerator;