/**
 * @file useInvite.ts
 * @description This file contains a custom React hook that manages invite-related functionality for the Pollen8 platform,
 * providing an interface for components to interact with invite data and operations.
 * 
 * Requirements addressed:
 * 1. Invite System (Technical specification/1.1 System Objectives/Strategic Growth Tools)
 * 2. Invite Analytics (Technical specification/1.1 System Objectives/Strategic Growth Tools)
 */

import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Invite,
  CreateInviteDto,
  UpdateInviteDto,
  InviteAnalytics,
  InviteActivityVisualization,
  InviteStatus
} from '../../shared/types/invite';
import {
  createInvite,
  getInvites,
  updateInvite,
  deleteInvite,
  getInviteAnalytics,
  getInviteActivityVisualization,
  regenerateInviteLink,
  getInviteStatus,
  revokeInvite
} from '../../shared/api/inviteService';

/**
 * Custom hook for managing invite-related functionality
 * @returns An object containing invites, loading state, error state, and CRUD functions for invites
 */
export const useInvite = () => {
  const queryClient = useQueryClient();
  const [selectedInviteId, setSelectedInviteId] = useState<string | null>(null);

  // Fetch invites
  const {
    data: invites,
    isLoading: isLoadingInvites,
    error: invitesError
  } = useQuery<Invite[], Error>('invites', getInvites);

  // Create invite mutation
  const createInviteMutation = useMutation(createInvite, {
    onSuccess: (newInvite) => {
      queryClient.setQueryData<Invite[]>('invites', (oldInvites) => 
        oldInvites ? [...oldInvites, newInvite] : [newInvite]
      );
    },
  });

  // Update invite mutation
  const updateInviteMutation = useMutation(
    ({ id, data }: { id: string; data: UpdateInviteDto }) => updateInvite(id, data),
    {
      onSuccess: (updatedInvite) => {
        queryClient.setQueryData<Invite[]>('invites', (oldInvites) =>
          oldInvites?.map((invite) => invite.id === updatedInvite.id ? updatedInvite : invite)
        );
      },
    }
  );

  // Delete invite mutation
  const deleteInviteMutation = useMutation(deleteInvite, {
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<Invite[]>('invites', (oldInvites) =>
        oldInvites?.filter((invite) => invite.id !== deletedId)
      );
    },
  });

  // Fetch invite analytics
  const {
    data: inviteAnalytics,
    isLoading: isLoadingAnalytics,
    error: analyticsError
  } = useQuery<InviteAnalytics, Error>(
    ['inviteAnalytics', selectedInviteId],
    () => getInviteAnalytics(selectedInviteId!),
    { enabled: !!selectedInviteId }
  );

  // Fetch invite activity visualization
  const {
    data: inviteActivityVisualization,
    isLoading: isLoadingVisualization,
    error: visualizationError
  } = useQuery<InviteActivityVisualization, Error>(
    ['inviteActivityVisualization', selectedInviteId],
    () => getInviteActivityVisualization(selectedInviteId!),
    { enabled: !!selectedInviteId }
  );

  // Regenerate invite link mutation
  const regenerateInviteLinkMutation = useMutation(regenerateInviteLink, {
    onSuccess: (updatedInvite) => {
      queryClient.setQueryData<Invite[]>('invites', (oldInvites) =>
        oldInvites?.map((invite) => invite.id === updatedInvite.id ? updatedInvite : invite)
      );
    },
  });

  // Get invite status
  const {
    data: inviteStatus,
    isLoading: isLoadingStatus,
    error: statusError
  } = useQuery<InviteStatus, Error>(
    ['inviteStatus', selectedInviteId],
    () => getInviteStatus(selectedInviteId!),
    { enabled: !!selectedInviteId }
  );

  // Revoke invite mutation
  const revokeInviteMutation = useMutation(revokeInvite, {
    onSuccess: (_, revokedId) => {
      queryClient.setQueryData<Invite[]>('invites', (oldInvites) =>
        oldInvites?.map((invite) => invite.id === revokedId ? { ...invite, status: 'revoked' as InviteStatus } : invite)
      );
    },
  });

  // Memoized functions
  const selectInvite = useCallback((id: string) => {
    setSelectedInviteId(id);
  }, []);

  const createNewInvite = useCallback((data: CreateInviteDto) => {
    return createInviteMutation.mutateAsync(data);
  }, [createInviteMutation]);

  const updateExistingInvite = useCallback((id: string, data: UpdateInviteDto) => {
    return updateInviteMutation.mutateAsync({ id, data });
  }, [updateInviteMutation]);

  const deleteExistingInvite = useCallback((id: string) => {
    return deleteInviteMutation.mutateAsync(id);
  }, [deleteInviteMutation]);

  const regenerateLink = useCallback((id: string) => {
    return regenerateInviteLinkMutation.mutateAsync(id);
  }, [regenerateInviteLinkMutation]);

  const revokeExistingInvite = useCallback((id: string) => {
    return revokeInviteMutation.mutateAsync(id);
  }, [revokeInviteMutation]);

  // Effect to clear selected invite when invites change
  useEffect(() => {
    if (!invites?.some(invite => invite.id === selectedInviteId)) {
      setSelectedInviteId(null);
    }
  }, [invites, selectedInviteId]);

  return {
    invites,
    isLoadingInvites,
    invitesError,
    selectedInviteId,
    selectInvite,
    createNewInvite,
    updateExistingInvite,
    deleteExistingInvite,
    inviteAnalytics,
    isLoadingAnalytics,
    analyticsError,
    inviteActivityVisualization,
    isLoadingVisualization,
    visualizationError,
    regenerateLink,
    inviteStatus,
    isLoadingStatus,
    statusError,
    revokeExistingInvite,
  };
};