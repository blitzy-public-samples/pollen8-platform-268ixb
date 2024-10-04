import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import styled from 'styled-components';
import Layout from '@/components/Layout';
import InviteGenerator from '@/components/Invite/InviteGenerator';
import InviteStats from '@/components/Invite/InviteStats';
import NetworkGraph from '@/shared/components/NetworkGraph';
import { useInvite } from '@/hooks/useInvite';
import { Invite } from '@/shared/types/invite';
import { Connection } from '@/shared/types/connection';

/**
 * InvitesPage component
 * This component serves as the main interface for users to manage and generate invite links on the Pollen8 platform.
 * 
 * Requirements addressed:
 * - Strategic Growth Tools (1.1 System Objectives/Strategic Growth Tools)
 * - Invite System (1.1 System Objectives/Strategic Growth Tools)
 * - Click Analytics (1.1 System Objectives/Strategic Growth Tools)
 * - 30-day activity visualization (1.1 System Objectives/Strategic Growth Tools)
 */
const InvitesPage: NextPage = () => {
  const { invites, loading, error, fetchInvites, createInvite, deleteInvite } = useInvite();
  const [connections, setConnections] = useState<Connection[]>([]);

  useEffect(() => {
    fetchInvites();
    // Fetch connections data for the NetworkGraph
    // This is a placeholder and should be replaced with actual API call
    setConnections([
      { connectedUserId: '1', connectionValue: 3.14 },
      { connectedUserId: '2', connectionValue: 6.28 },
      // Add more connections as needed
    ]);
  }, [fetchInvites]);

  const handleCreateInvite = async (name: string) => {
    await createInvite({ name });
    fetchInvites(); // Refresh the invites list
  };

  const handleDeleteInvite = async (id: string) => {
    await deleteInvite(id);
    fetchInvites(); // Refresh the invites list
  };

  const handleNodeClick = (userId: string) => {
    console.log(`Clicked on user: ${userId}`);
    // Implement any additional functionality when a node is clicked
  };

  if (loading) return <PageContainer><Title>Loading...</Title></PageContainer>;
  if (error) return <PageContainer><Title>Error: {error}</Title></PageContainer>;

  return (
    <Layout>
      <PageContainer>
        <Title>Invite Management</Title>
        
        <Section>
          <InviteGenerator onCreateInvite={handleCreateInvite} />
        </Section>
        
        <Section>
          <InviteStats invites={invites} onDeleteInvite={handleDeleteInvite} />
        </Section>
        
        <Section>
          <NetworkGraph connections={connections} onNodeClick={handleNodeClick} />
        </Section>
      </PageContainer>
    </Layout>
  );
};

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  background-color: #000000;
  min-height: 100vh;
`;

const Title = styled.h1`
  color: #FFFFFF;
  font-family: 'Proxima Nova', sans-serif;
  font-size: 36px;
  margin-bottom: 2rem;
`;

const Section = styled.div`
  margin-bottom: 3rem;
`;

export default InvitesPage;