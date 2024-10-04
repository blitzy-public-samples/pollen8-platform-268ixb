import React, { useState, useCallback } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Invite } from '../../types/invite';
import { formatInviteUrl } from '../../utils/formatting';
import useInviteAnalytics from '../../hooks/useInviteAnalytics';
import { createInvite, deleteInvite } from '../../api/inviteService';

/**
 * InviteLink component for displaying and managing invite links in the Pollen8 platform.
 * 
 * Requirements addressed:
 * 1. Trackable invite links (Technical specification/1.1 System Objectives/Strategic Growth Tools)
 * 2. Click analytics (Technical specification/1.1 System Objectives/Strategic Growth Tools)
 */

interface InviteLinkProps {
  userId: string;
}

const InviteLink: React.FC<InviteLinkProps> = ({ userId }) => {
  const [invite, setInvite] = useState<Invite | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const { analytics, loading: analyticsLoading, error: analyticsError } = useInviteAnalytics(invite?.id ?? '');

  const handleCreateInvite = useCallback(async () => {
    try {
      setIsCreating(true);
      const newInvite = await createInvite({ name: `Invite from ${userId}` });
      setInvite(newInvite);
    } catch (error) {
      console.error('Failed to create invite:', error);
      // TODO: Show error message to user
    } finally {
      setIsCreating(false);
    }
  }, [userId]);

  const handleDeleteInvite = useCallback(async () => {
    if (!invite) return;

    try {
      setIsDeleting(true);
      await deleteInvite(invite.id);
      setInvite(null);
    } catch (error) {
      console.error('Failed to delete invite:', error);
      // TODO: Show error message to user
    } finally {
      setIsDeleting(false);
    }
  }, [invite]);

  const handleCopySuccess = useCallback(() => {
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  }, []);

  if (analyticsLoading) {
    return <div>Loading invite analytics...</div>;
  }

  if (analyticsError) {
    return <div>Error loading invite analytics: {analyticsError.message}</div>;
  }

  return (
    <div className="invite-link-container">
      <h2>Your Invite Link</h2>
      {invite ? (
        <>
          <div className="invite-url">
            <span>{formatInviteUrl(invite.url)}</span>
            <CopyToClipboard text={formatInviteUrl(invite.url)} onCopy={handleCopySuccess}>
              <button className="copy-button">Copy</button>
            </CopyToClipboard>
          </div>
          {copySuccess && <p className="copy-success">Copied to clipboard!</p>}
          <div className="invite-stats">
            <p>Total Clicks: {analytics?.totalClicks ?? 0}</p>
            <p>Last 30 Days: {analytics?.dailyClicks ? Object.values(analytics.dailyClicks).reduce((a, b) => a + b, 0) : 0}</p>
          </div>
          <button onClick={handleDeleteInvite} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete Invite'}
          </button>
        </>
      ) : (
        <button onClick={handleCreateInvite} disabled={isCreating}>
          {isCreating ? 'Creating...' : 'Create Invite Link'}
        </button>
      )}
    </div>
  );
};

export default InviteLink;