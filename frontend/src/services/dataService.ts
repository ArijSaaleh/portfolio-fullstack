/**
 * Data Service
 * Fetches data from JSON files instead of API
 */

export interface Project {
  id: number;
  title: string;
  description: string;
  challenge?: string;
  contribution?: string;
  technologies: string[];
  thumbnail: string;
  heroImage?: string;
  videoUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  accuracy?: string;
  speed?: string;
  images?: string[];
  startDate?: string;
  endDate?: string;
  published: boolean;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail?: string;
  type: 'article' | 'video' | 'tutorial';
  readTime: string;
  videoUrl?: string;
  pdfUrl?: string;
  publishedAt: string;
  published: boolean;
}

export interface Experience {
  id: number;
  company: string;
  companyLogo?: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string | string[];
  skills: string[];
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  category: 'award' | 'participation' | 'certification' | 'social';
  date: string;
  images: string[];
  videoUrl?: string;
  link?: string;
  published: boolean;
}

export interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
}

// Cache for loaded data
let dataCache: {
  projects?: Project[];
  blogs?: Blog[];
  experiences?: Experience[];
  achievements?: Achievement[];
  messages?: Message[];
} = {};

/**
 * Generic data fetcher
 */
async function fetchData<T>(filename: string, useCache = true): Promise<T[]> {
  const cacheKey = filename.replace('.json', '') as keyof typeof dataCache;
  
  if (useCache && dataCache[cacheKey]) {
    return dataCache[cacheKey] as T[];
  }

  try {
    const response = await fetch(`/data/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${filename}`);
    }
    const data = await response.json();
    dataCache[cacheKey] = data;
    return data;
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    return [];
  }
}

/**
 * Projects
 */
export async function getProjects(publishedOnly = true): Promise<Project[]> {
  const projects = await fetchData<Project>('projects.json');
  return publishedOnly ? projects.filter(p => p.published) : projects;
}

export async function getProjectById(id: number): Promise<Project | null> {
  const projects = await getProjects(false);
  return projects.find(p => p.id === id) || null;
}

/**
 * Blogs
 */
export async function getBlogs(publishedOnly = true): Promise<Blog[]> {
  const blogs = await fetchData<Blog>('blogs.json');
  return publishedOnly ? blogs.filter(b => b.published) : blogs;
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const blogs = await getBlogs(false);
  return blogs.find(b => b.slug === slug) || null;
}

/**
 * Experiences
 */
export async function getExperiences(): Promise<Experience[]> {
  return fetchData<Experience>('experiences.json');
}

/**
 * Achievements
 */
export async function getAchievements(publishedOnly = true): Promise<Achievement[]> {
  const achievements = await fetchData<Achievement>('achievements.json');
  return publishedOnly ? achievements.filter(a => a.published) : achievements;
}

/**
 * Messages (Contact Form)
 */
export async function getMessages(): Promise<Message[]> {
  return fetchData<Message>('messages.json');
}

export async function saveMessage(message: Omit<Message, 'id' | 'createdAt' | 'read'>): Promise<void> {
  // In a real implementation, this would save to localStorage or send to a serverless function
  const messages = await getMessages();
  const newMessage: Message = {
    ...message,
    id: Math.max(0, ...messages.map(m => m.id)) + 1,
    createdAt: new Date().toISOString(),
    read: false
  };
  
  // Save to localStorage for demo purposes
  const allMessages = [...messages, newMessage];
  localStorage.setItem('portfolio_messages', JSON.stringify(allMessages));
  
  console.log('Message saved:', newMessage);
}

/**
 * Admin functions
 */
export async function saveProject(project: Project): Promise<void> {
  const projects = await getProjects(false);
  const index = projects.findIndex(p => p.id === project.id);
  
  if (index >= 0) {
    projects[index] = project;
  } else {
    project.id = Math.max(0, ...projects.map(p => p.id)) + 1;
    projects.push(project);
  }
  
  // In production, this would update the JSON file via API
  localStorage.setItem('portfolio_projects', JSON.stringify(projects));
  dataCache.projects = projects;
}

export async function deleteProject(id: number): Promise<void> {
  const projects = await getProjects(false);
  const filtered = projects.filter(p => p.id !== id);
  localStorage.setItem('portfolio_projects', JSON.stringify(filtered));
  dataCache.projects = filtered;
}

// Similar functions for other entities...
export async function saveBlog(blog: Blog): Promise<void> {
  const blogs = await getBlogs(false);
  const index = blogs.findIndex(b => b.id === blog.id);
  
  if (index >= 0) {
    blogs[index] = blog;
  } else {
    blog.id = Math.max(0, ...blogs.map(b => b.id)) + 1;
    blogs.push(blog);
  }
  
  localStorage.setItem('portfolio_blogs', JSON.stringify(blogs));
  dataCache.blogs = blogs;
}

export async function deleteBlog(id: number): Promise<void> {
  const blogs = await getBlogs(false);
  const filtered = blogs.filter(b => b.id !== id);
  localStorage.setItem('portfolio_blogs', JSON.stringify(filtered));
  dataCache.blogs = filtered;
}

/**
 * Clear cache (useful when data is updated)
 */
export function clearCache(): void {
  dataCache = {};
}
