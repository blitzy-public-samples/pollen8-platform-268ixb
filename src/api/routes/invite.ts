import { Router } from 'express';
import { InviteController } from '../controllers/inviteController';
import { authMiddleware } from '../middleware/auth';
import { validateInvite } from '../middleware/validation';
import { INVITE_ROUTES } from '../../shared/constants/apiEndpoints';

/**
 * Configures all the invite-related routes on the provided Express router.
 * This function addresses the following requirements from the Technical Specification:
 * - Invite System (Technical specification/1.1 System Objectives/Strategic Growth Tools)
 * - Click Analytics (Technical specification/1.1 System Objectives/Strategic Growth Tools)
 * 
 * @param router - Express Router instance
 */
export const configureInviteRoutes = (router: Router): void => {
  const inviteController = new InviteController();

  // POST /invites - Create a new invite link
  router.post(
    INVITE_ROUTES.CREATE_INVITE,
    authMiddleware,
    validateInvite,
    inviteController.createInvite.bind(inviteController)
  );

  // GET /invites - Retrieve all invites for the authenticated user
  router.get(
    INVITE_ROUTES.GET_USER_INVITES,
    authMiddleware,
    inviteController.getUserInvites.bind(inviteController)
  );

  // GET /invites/:id - Retrieve a specific invite by ID
  router.get(
    INVITE_ROUTES.GET_INVITE,
    authMiddleware,
    inviteController.getInviteById.bind(inviteController)
  );

  // PUT /invites/:id - Update an invite (e.g., deactivate)
  router.put(
    INVITE_ROUTES.UPDATE_INVITE,
    authMiddleware,
    validateInvite,
    inviteController.updateInvite.bind(inviteController)
  );

  // GET /invites/:id/analytics - Retrieve analytics for a specific invite
  router.get(
    INVITE_ROUTES.GET_INVITE_ANALYTICS,
    authMiddleware,
    inviteController.getInviteAnalytics.bind(inviteController)
  );

  // PUT /invites/track/:inviteUrl - Track invite link click
  router.put(
    INVITE_ROUTES.TRACK_INVITE_CLICK,
    inviteController.trackInviteClick.bind(inviteController)
  );
};

export default configureInviteRoutes;