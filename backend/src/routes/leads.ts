import { Router } from 'express';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  exportLeads,
  getLeadStats,
} from '../controllers/leadsController';
import { authenticate, authorize } from '../middleware/auth';
import { leadValidation, updateLeadValidation, validate } from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getLeads);
router.get('/export', exportLeads);
router.get('/stats', getLeadStats);
router.get('/:id', getLeadById);
router.post('/', leadValidation, validate, createLead);
router.put('/:id', updateLeadValidation, validate, updateLead);
router.patch('/:id', updateLeadValidation, validate, updateLead);
// Only admins can permanently delete
router.delete('/:id', authorize('admin', 'sales'), deleteLead);

export default router;
