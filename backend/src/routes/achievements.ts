import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, optionalAuth, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all achievements (public or all for admin)
router.get('/', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    // Check if user is authenticated (admin)
    const isAdmin = req.userId !== undefined;
    
    const achievements = await (prisma as any).achievement.findMany({
      where: isAdmin ? {} : { published: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(achievements);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ error: 'Failed to fetch achievements', details: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Get single achievement (public)
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const achievement = await (prisma as any).achievement.findUnique({
      where: { id: parseInt(id) },
    });
    
    if (!achievement) {
      return res.status(404).json({ error: 'Achievement not found' });
    }
    
    res.json(achievement);
  } catch (error) {
    console.error('Error fetching achievement:', error);
    res.status(500).json({ error: 'Failed to fetch achievement', details: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Create achievement (protected)
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const achievement = await (prisma as any).achievement.create({
      data: req.body,
    });
    res.status(201).json(achievement);
  } catch (error) {
    console.error('Error creating achievement:', error);
    res.status(500).json({ error: 'Failed to create achievement', details: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Update achievement (protected)
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const achievement = await (prisma as any).achievement.update({
      where: { id: parseInt(id) },
      data: req.body,
    });
    res.json(achievement);
  } catch (error) {
    console.error('Error updating achievement:', error);
    res.status(500).json({ error: 'Failed to update achievement', details: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Delete achievement (protected)
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await (prisma as any).achievement.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Achievement deleted successfully' });
  } catch (error) {
    console.error('Error deleting achievement:', error);
    res.status(500).json({ error: 'Failed to delete achievement', details: error instanceof Error ? error.message : 'Unknown error' });
  }
});

export default router;
