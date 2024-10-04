import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Bar } from 'recharts';
import { Invite, InviteAnalytics } from '@/shared/types/invite';
import { Loader } from '@/components/UI/Loader';
import { ErrorMessage } from '@/components/UI/ErrorMessage';
import { formatDate } from '@/shared/utils/formatting';

// Assuming the useInvite hook provides these functionalities
const useInvite = () => {
  // Mock implementation
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invite, setInvite] = useState<Invite | null>(null);
  const [analytics, setAnalytics] = useState<InviteAnalytics | null>(null);

  const fetchInviteData = async (inviteId: string) => {
    // Simulating API call
    setTimeout(() => {
      setInvite({
        id: inviteId,
        url: `https://pollen8.com/invite/${inviteId}`,
        createdAt: new Date().toISOString(),
        totalClicks: 150,
      });
      setAnalytics({
        dailyClicks: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          clicks: Math.floor(Math.random() * 20),
        })),
      });
      setLoading(false);
    }, 1000);
  };

  return { loading, error, invite, analytics, fetchInviteData };
};

const Container = styled.div`
  background-color: #000000;
  color: #FFFFFF;
  padding: 2rem;
  border-radius: 8px;
  font-family: 'Proxima Nova', sans-serif;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 1rem;
`;

const StatItem = styled.div`
  margin-bottom: 1rem;
`;

const ChartContainer = styled.div`
  height: 300px;
  margin-top: 2rem;
`;

interface InviteStatsProps {
  inviteId: string;
}

export const InviteStats: React.FC<InviteStatsProps> = ({ inviteId }) => {
  const { loading, error, invite, analytics, fetchInviteData } = useInvite();

  useEffect(() => {
    fetchInviteData(inviteId);
  }, [inviteId]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!invite || !analytics) {
    return <ErrorMessage message="No data available" />;
  }

  const chartData = analytics.dailyClicks.slice().reverse();

  return (
    <Container>
      <Title>Invite Statistics</Title>
      <StatItem>Total Clicks: {invite.totalClicks}</StatItem>
      <StatItem>Created: {formatDate(invite.createdAt)}</StatItem>
      <StatItem>Invite URL: {invite.url}</StatItem>
      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="date" tickFormatter={(tick) => formatDate(tick, 'MMM dd')} />
            <YAxis />
            <Tooltip
              labelFormatter={(label) => formatDate(label, 'MMMM dd, yyyy')}
              formatter={(value: number) => [`${value} clicks`, 'Clicks']}
            />
            <Bar dataKey="clicks" fill="#FFFFFF" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Container>
  );
};

export default InviteStats;