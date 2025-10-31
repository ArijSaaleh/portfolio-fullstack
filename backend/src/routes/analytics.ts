import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import prisma from '../lib/prisma'

const router = Router()

// Track page view (public)
router.post('/page-view', async (req, res) => {
  try {
    const { page, referrer } = req.body
    const ipAddress = req.ip || req.socket.remoteAddress || null
    const userAgent = req.get('user-agent') || null

    await prisma.pageView.create({
      data: {
        page,
        ipAddress,
        userAgent,
        referrer
      }
    })

    res.json({ success: true })
  } catch (error) {
    console.error('Error tracking page view:', error)
    res.status(500).json({ error: 'Failed to track page view' })
  }
})

// Track content view (public)
router.post('/content-view', async (req, res) => {
  try {
    const { contentType, contentId } = req.body

    await prisma.contentView.create({
      data: {
        contentType,
        contentId: parseInt(contentId)
      }
    })

    res.json({ success: true })
  } catch (error) {
    console.error('Error tracking content view:', error)
    res.status(500).json({ error: 'Failed to track content view' })
  }
})

// Get analytics dashboard data (admin only)
router.get('/dashboard', authenticate, async (req, res) => {
  try {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Total counts
    const [
      totalProjects,
      totalBlogs,
      totalExperiences,
      totalAchievements,
      totalMessages,
      unreadMessages,
      totalPageViews,
      totalContentViews
    ] = await Promise.all([
      prisma.project.count(),
      prisma.blog.count(),
      prisma.experience.count(),
      prisma.achievement.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { read: false } }),
      prisma.pageView.count(),
      prisma.contentView.count()
    ])

    // Recent page views (last 30 days)
    const recentPageViews = await prisma.pageView.count({
      where: { createdAt: { gte: thirtyDaysAgo } }
    })

    // Page views by day (last 30 days)
    const pageViewsByDay = await prisma.$queryRaw<Array<{ date: string; count: bigint }>>`
      SELECT DATE(\"createdAt\") as date, COUNT(*) as count
      FROM \"PageView\"
      WHERE \"createdAt\" >= ${thirtyDaysAgo}
      GROUP BY DATE(\"createdAt\")
      ORDER BY date DESC
    `

    // Most viewed content
    const mostViewedProjects = await prisma.contentView.groupBy({
      by: ['contentId'],
      where: { contentType: 'project' },
      _count: { contentId: true },
      orderBy: { _count: { contentId: 'desc' } },
      take: 5
    })

    const mostViewedBlogs = await prisma.contentView.groupBy({
      by: ['contentId'],
      where: { contentType: 'blog' },
      _count: { contentId: true },
      orderBy: { _count: { contentId: 'desc' } },
      take: 5
    })

    // Get project details for most viewed
    const projectIds = mostViewedProjects.map(p => p.contentId)
    const projects = await prisma.project.findMany({
      where: { id: { in: projectIds } },
      select: { id: true, title: true, thumbnail: true }
    })

    // Get blog details for most viewed
    const blogIds = mostViewedBlogs.map(b => b.contentId)
    const blogs = await prisma.blog.findMany({
      where: { id: { in: blogIds } },
      select: { id: true, title: true, thumbnail: true }
    })

    // Map views to content
    const topProjects = mostViewedProjects.map(view => {
      const project = projects.find(p => p.id === view.contentId)
      return {
        ...project,
        views: Number(view._count.contentId)
      }
    })

    const topBlogs = mostViewedBlogs.map(view => {
      const blog = blogs.find(b => b.id === view.contentId)
      return {
        ...blog,
        views: Number(view._count.contentId)
      }
    })

    // Recent messages (last 7 days)
    const recentMessages = await prisma.contactMessage.count({
      where: { createdAt: { gte: sevenDaysAgo } }
    })

    // Top pages
    const topPages = await prisma.pageView.groupBy({
      by: ['page'],
      _count: { page: true },
      orderBy: { _count: { page: 'desc' } },
      take: 10,
      where: { createdAt: { gte: thirtyDaysAgo } }
    })

    res.json({
      overview: {
        totalProjects,
        totalBlogs,
        totalExperiences,
        totalAchievements,
        totalMessages,
        unreadMessages,
        totalPageViews,
        totalContentViews,
        recentPageViews,
        recentMessages
      },
      charts: {
        pageViewsByDay: pageViewsByDay.map(item => ({
          date: item.date,
          count: Number(item.count)
        })),
        topPages: topPages.map(page => ({
          page: page.page,
          views: page._count.page
        })),
        topProjects,
        topBlogs
      }
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    res.status(500).json({ error: 'Failed to fetch analytics' })
  }
})

// Get views for specific content (admin only)
router.get('/content/:contentType/:contentId', authenticate, async (req, res) => {
  try {
    const { contentType, contentId } = req.params

    const views = await prisma.contentView.count({
      where: {
        contentType,
        contentId: parseInt(contentId)
      }
    })

    res.json({ views })
  } catch (error) {
    console.error('Error fetching content views:', error)
    res.status(500).json({ error: 'Failed to fetch content views' })
  }
})

export default router
