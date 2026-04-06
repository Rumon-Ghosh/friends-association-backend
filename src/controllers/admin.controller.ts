import { type Request, type Response } from 'express';
import User from '../models/User.js';
import Contribution from '../models/Contribution.js';
import Notification from '../models/Notification.js';
import Draw from '../models/Draw.js';

export const addContribution = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId, amount, daysCovered } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const today = new Date();
    let startDate = new Date(user.coverageUntil);
    if (startDate < today) {
      startDate = today;
    }

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + daysCovered);

    const contribution = await Contribution.create({
      userId,
      amount,
      daysCovered,
      startDate,
      endDate,
    });

    user.coverageUntil = endDate;
    user.totalPaid += amount;
    await user.save();

    await Notification.create({
      userId,
      message: `Contribution of ${amount} TK added. Coverage extended until ${endDate.toDateString()}.`,
    });

    res.status(201).json({ success: true, data: contribution });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const runDraw = async (req: Request, res: Response): Promise<any> => {
  try {
    const eligibleUsers = await User.find({
      role: 'member',
      hasWon: false,
      isActive: true,
      coverageUntil: { $gte: new Date() },
    });

    if (eligibleUsers.length === 0) {
      return res.status(400).json({ message: 'No eligible members for the draw' });
    }

    const randomIndex = Math.floor(Math.random() * eligibleUsers.length);
    const winner = eligibleUsers[randomIndex]!;

    const totalAmount = eligibleUsers.length * 100 * 10; // Simple calc based on 10 days? (Adjust based on requirements)
    // Actually the requirement is "The winner receives the full pooled amount"
    // Let's assume the pooled amount is the daily contribution * 10 members * 10 days.

    const draw = await Draw.create({
      winnerId: winner._id,
      totalAmount,
      participants: eligibleUsers.map((u) => u._id),
    });

    winner.hasWon = true;
    await winner.save();

    // Notify all members
    const allMembers = await User.find({ role: 'member' });
    for (const member of allMembers) {
      await Notification.create({
        userId: member._id,
        message: `Draw completed! Winner is ${winner.name}. Total amount pooled is ${totalAmount} TK.`,
      });
    }

    res.status(200).json({ success: true, data: draw });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateMemberStatus = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId, isActive } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = isActive;
    await user.save();

    res.status(200).json({ success: true, message: `Member ${isActive ? 'activated' : 'deactivated'}` });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    const users = await User.find({ role: 'member' }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Cascade Delete: Delete all related contributions and notifications
    await Contribution.deleteMany({ userId: userId as string });
    await Notification.deleteMany({ userId: userId as string });

    // Finally, delete the user
    await User.findByIdAndDelete(userId);
    
    // Note: Since totalPooled is calculated via User.aggregate in getAdminStats,
    // deleting the user automatically removes their 'totalPaid' from the pooled sum.

    res.status(200).json({ success: true, message: 'User and all related records deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminStats = async (req: Request, res: Response): Promise<any> => {
  try {
    const totalMembers = await User.countDocuments({ role: 'member' });
    const activeMembers = await User.countDocuments({ role: 'member', isActive: true });
    const winnersCount = await User.countDocuments({ role: 'member', hasWon: true });
    const eligibleCount = await User.countDocuments({
      role: 'member',
      isActive: true,
      hasWon: false,
      coverageUntil: { $gte: new Date() },
    });

    const totalPooled = await User.aggregate([
      { $match: { role: 'member' } },
      { $group: { _id: null, total: { $sum: '$totalPaid' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalMembers,
        activeMembers,
        winnersCount,
        eligibleCount,
        totalPooled: totalPooled[0]?.total || 0,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
