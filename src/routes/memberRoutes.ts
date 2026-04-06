import express from 'express';
import { auth } from '../middlewares/auth.middleware.js';
import { 
  getProfile, 
  getAllMembersStatus, 
  getMemberNotifications, 
  getDrawResults 
} from '../controllers/member.controller.js';

const router = express.Router();

router.get('/profile', auth('member', 'admin'), getProfile);
router.get('/members-status', auth('member', 'admin'), getAllMembersStatus);
router.get('/notifications', auth('member', 'admin'), getMemberNotifications);
router.get('/draw-results', auth('member', 'admin'), getDrawResults);

export const memberRoutes = router;
