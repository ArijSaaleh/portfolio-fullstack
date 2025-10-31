import { Router, Request, Response } from 'express';
import { authenticate, optionalAuth, AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = Router();

// Get all blogs (public or all for admin)
router.get('/', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    // Check if user is authenticated (admin)
    const isAdmin = req.userId !== undefined;
    
    const blogs = await prisma.blog.findMany({
      where: isAdmin ? {} : { published: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// Get single blog (public)
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const blog = await prisma.blog.findUnique({
      where: { id: parseInt(id) },
    });
    
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
});

// Create blog (protected)
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const blog = await prisma.blog.create({
      data: req.body,
    });
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create blog' });
  }
});

// Update blog (protected)
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const blog = await prisma.blog.update({
      where: { id: parseInt(id) },
      data: req.body,
    });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update blog' });
  }
});

// Delete blog (protected)
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.blog.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete blog' });
  }
});

export default router;
