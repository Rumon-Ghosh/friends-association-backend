import { type Request, type Response } from 'express';
import User from '../models/User.js';
import Contribution from '../models/Contribution.js';
import Notification from '../models/Notification.js';
import Draw from '../models/Draw.js';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const contributions = await Contribution.find({ userId: user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        user,
        contributions,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllMembersStatus = async (req: Request, res: Response) => {
  try {
    const members = await User.find({ role: 'member' }).select('name hasWon isActive coverageUntil');
    res.status(200).json({ success: true, data: members });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMemberNotifications = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const notifications = await Notification.find({ userId: user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: notifications });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDrawResults = async (req: Request, res: Response) => {
  try {
    const results = await Draw.find().populate('winnerId', 'name email').sort({ drawDate: -1 });
    res.status(200).json({ success: true, data: results });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
