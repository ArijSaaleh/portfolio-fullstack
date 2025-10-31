import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Submit contact form (public)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;
    
    const contactMessage = await prisma.contactMessage.create({
      data: { name, email, message },
    });
    
    res.status(201).json({ message: 'Message sent successfully', id: contactMessage.id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get all messages (protected)
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Mark message as read (protected)
router.patch('/:id/read', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const message = await prisma.contactMessage.update({
      where: { id: parseInt(id) },
      data: { read: true },
    });
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update message' });
  }
});

// Delete message (protected)
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.contactMessage.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

export default router;
