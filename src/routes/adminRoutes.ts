import express from 'express';
import { auth } from '../middlewares/auth.middleware.js';
import { 
  addContribution, 
  runDraw, 
  updateMemberStatus, 
  getAllUsers, 
  deleteUser,
  getAdminStats
} from '../controllers/admin.controller.js';

const router = express.Router();

router.get('/stats', auth('admin'), getAdminStats);
router.get('/users', auth('admin'), getAllUsers);
router.post('/contribution', auth('admin'), addContribution);
router.post('/run-draw', auth('admin'), runDraw);
router.put('/update-status', auth('admin'), updateMemberStatus);
router.delete('/delete-user/:userId', auth('admin'), deleteUser);

export const adminRoutes = router;
