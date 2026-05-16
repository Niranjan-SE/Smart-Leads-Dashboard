import { Router, Response } from 'express';
import { User } from '../models/User';
import { authenticate, authorize } from '../middleware/auth';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../types';

const router = Router();

router.use(authenticate);

// Admin only: list all users
router.get('/', authorize('admin'), async (_req: AuthRequest, res: Response) => {
  try {
    const users = await User.find().select('-password').lean();
    sendSuccess(res, users);
  } catch {
    sendError(res, 'Failed to fetch users', 500);
  }
});

// Admin only: update user role
router.patch('/:id/role', authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.body;
    if (!['admin', 'sales'].includes(role)) {
      sendError(res, 'Invalid role', 400);
      return;
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    sendSuccess(res, user, 'Role updated successfully');
  } catch {
    sendError(res, 'Failed to update role', 500);
  }
});

export default router;
