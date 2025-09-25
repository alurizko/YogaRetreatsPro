import express from 'express'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { blogPosts, blogCategories, users } from '../db/schema.js'
import { eq, desc, asc, and, like, or, sql } from 'drizzle-orm'
import { asyncHandler, createError } from '../middleware/errorHandler.js'

const router = express.Router()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

const db = drizzle(pool)

// Generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-')
}

// Calculate reading time (words per minute = 200)
function calculateReadingTime(content) {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

// @desc    Get all blog posts
// @route   GET /api/blog
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const { 
    page = 1, 
    limit = 10, 
    category, 
    search, 
    status = 'published',
    sortBy = 'publishedAt',
    sortOrder = 'desc'
  } = req.query

  const offset = (page - 1) * limit

  let query = db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
      excerpt: blogPosts.excerpt,
      featuredImage: blogPosts.featuredImage,
      status: blogPosts.status,
      publishedAt: blogPosts.publishedAt,
      viewCount: blogPosts.viewCount,
      readingTime: blogPosts.readingTime,
      tags: blogPosts.tags,
      author: {
        firstName: users.firstName,
        lastName: users.lastName,
        avatar: users.avatar
      },
      category: {
        name: blogCategories.name,
        slug: blogCategories.slug,
        color: blogCategories.color
      }
    })
    .from(blogPosts)
    .innerJoin(users, eq(blogPosts.authorId, users.id))
    .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))

  const conditions = []

  // Status filter
  if (status) {
    conditions.push(eq(blogPosts.status, status))
  }

  // Category filter
  if (category) {
    conditions.push(eq(blogCategories.slug, category))
  }

  // Search filter
  if (search) {
    conditions.push(
      or(
        like(blogPosts.title, `%${search}%`),
        like(blogPosts.content, `%${search}%`),
        like(blogPosts.excerpt, `%${search}%`)
      )
    )
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions))
  }

  // Apply sorting
  const validSortFields = ['publishedAt', 'createdAt', 'viewCount', 'title']
  const sortField = validSortFields.includes(sortBy) ? sortBy : 'publishedAt'
  const orderBy = sortOrder === 'desc' ? desc(blogPosts[sortField]) : asc(blogPosts[sortField])

  const posts = await query
    .orderBy(orderBy)
    .limit(parseInt(limit))
    .offset(offset)

  // Get total count
  let countQuery = db
    .select({ count: sql`count(*)` })
    .from(blogPosts)
    .innerJoin(users, eq(blogPosts.authorId, users.id))
    .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))

  if (conditions.length > 0) {
    countQuery = countQuery.where(and(...conditions))
  }

  const totalCount = await countQuery

  res.json({
    success: true,
    data: posts,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: parseInt(totalCount[0].count),
      pages: Math.ceil(totalCount[0].count / limit)
    }
  })
}))

// @desc    Get single blog post
// @route   GET /api/blog/:slug
// @access  Public
router.get('/:slug', asyncHandler(async (req, res) => {
  const { slug } = req.params

  const post = await db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
      excerpt: blogPosts.excerpt,
      content: blogPosts.content,
      featuredImage: blogPosts.featuredImage,
      status: blogPosts.status,
      publishedAt: blogPosts.publishedAt,
      viewCount: blogPosts.viewCount,
      readingTime: blogPosts.readingTime,
      tags: blogPosts.tags,
      seoTitle: blogPosts.seoTitle,
      seoDescription: blogPosts.seoDescription,
      createdAt: blogPosts.createdAt,
      updatedAt: blogPosts.updatedAt,
      author: {
        firstName: users.firstName,
        lastName: users.lastName,
        avatar: users.avatar,
        bio: users.bio
      },
      category: {
        name: blogCategories.name,
        slug: blogCategories.slug,
        color: blogCategories.color
      }
    })
    .from(blogPosts)
    .innerJoin(users, eq(blogPosts.authorId, users.id))
    .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
    .where(eq(blogPosts.slug, slug))
    .limit(1)

  if (post.length === 0) {
    throw createError('Blog post not found', 404)
  }

  // Increment view count
  await db
    .update(blogPosts)
    .set({ viewCount: sql`${blogPosts.viewCount} + 1` })
    .where(eq(blogPosts.id, post[0].id))

  // Get related posts
  const relatedPosts = await db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
      excerpt: blogPosts.excerpt,
      featuredImage: blogPosts.featuredImage,
      publishedAt: blogPosts.publishedAt,
      readingTime: blogPosts.readingTime
    })
    .from(blogPosts)
    .where(and(
      eq(blogPosts.status, 'published'),
      eq(blogPosts.categoryId, post[0].category?.id || 0)
    ))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(3)

  res.json({
    success: true,
    data: {
      ...post[0],
      relatedPosts
    }
  })
}))

// @desc    Create blog post
// @route   POST /api/blog
// @access  Private (Admin/Author)
router.post('/', asyncHandler(async (req, res) => {
  const {
    title,
    excerpt,
    content,
    featuredImage,
    categoryId,
    tags,
    status = 'draft',
    seoTitle,
    seoDescription
  } = req.body

  if (!title || !content) {
    throw createError('Title and content are required', 400)
  }

  const slug = generateSlug(title)
  const readingTime = calculateReadingTime(content)

  const newPost = await db.insert(blogPosts).values({
    title,
    slug,
    excerpt,
    content,
    featuredImage,
    authorId: req.user.id,
    categoryId: categoryId ? parseInt(categoryId) : null,
    tags,
    status,
    publishedAt: status === 'published' ? new Date() : null,
    readingTime,
    seoTitle,
    seoDescription
  }).returning()

  res.status(201).json({
    success: true,
    data: newPost[0]
  })
}))

// @desc    Update blog post
// @route   PUT /api/blog/:id
// @access  Private (Admin/Author)
router.put('/:id', asyncHandler(async (req, res) => {
  const postId = parseInt(req.params.id)

  const existingPost = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.id, postId))
    .limit(1)

  if (existingPost.length === 0) {
    throw createError('Blog post not found', 404)
  }

  // Check if user is author or admin
  if (existingPost[0].authorId !== req.user.id && req.user.role !== 'admin') {
    throw createError('Not authorized to update this post', 403)
  }

  const updateData = { ...req.body, updatedAt: new Date() }

  // Update slug if title changed
  if (req.body.title && req.body.title !== existingPost[0].title) {
    updateData.slug = generateSlug(req.body.title)
  }

  // Update reading time if content changed
  if (req.body.content && req.body.content !== existingPost[0].content) {
    updateData.readingTime = calculateReadingTime(req.body.content)
  }

  // Set published date if status changed to published
  if (req.body.status === 'published' && existingPost[0].status !== 'published') {
    updateData.publishedAt = new Date()
  }

  const updatedPost = await db
    .update(blogPosts)
    .set(updateData)
    .where(eq(blogPosts.id, postId))
    .returning()

  res.json({
    success: true,
    data: updatedPost[0]
  })
}))

// @desc    Delete blog post
// @route   DELETE /api/blog/:id
// @access  Private (Admin/Author)
router.delete('/:id', asyncHandler(async (req, res) => {
  const postId = parseInt(req.params.id)

  const existingPost = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.id, postId))
    .limit(1)

  if (existingPost.length === 0) {
    throw createError('Blog post not found', 404)
  }

  // Check if user is author or admin
  if (existingPost[0].authorId !== req.user.id && req.user.role !== 'admin') {
    throw createError('Not authorized to delete this post', 403)
  }

  await db.delete(blogPosts).where(eq(blogPosts.id, postId))

  res.json({
    success: true,
    message: 'Blog post deleted successfully'
  })
}))

// @desc    Get blog categories
// @route   GET /api/blog/categories
// @access  Public
router.get('/categories/list', asyncHandler(async (req, res) => {
  const categories = await db
    .select({
      id: blogCategories.id,
      name: blogCategories.name,
      slug: blogCategories.slug,
      description: blogCategories.description,
      color: blogCategories.color,
      postCount: sql`count(${blogPosts.id})`
    })
    .from(blogCategories)
    .leftJoin(blogPosts, and(
      eq(blogCategories.id, blogPosts.categoryId),
      eq(blogPosts.status, 'published')
    ))
    .where(eq(blogCategories.isActive, true))
    .groupBy(blogCategories.id)
    .orderBy(asc(blogCategories.sortOrder))

  res.json({
    success: true,
    data: categories
  })
}))

// @desc    Create blog category
// @route   POST /api/blog/categories
// @access  Private (Admin)
router.post('/categories', asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw createError('Admin access required', 403)
  }

  const { name, description, color, sortOrder } = req.body

  if (!name) {
    throw createError('Category name is required', 400)
  }

  const slug = generateSlug(name)

  const newCategory = await db.insert(blogCategories).values({
    name,
    slug,
    description,
    color,
    sortOrder: sortOrder || 0
  }).returning()

  res.status(201).json({
    success: true,
    data: newCategory[0]
  })
}))

// @desc    Get popular posts
// @route   GET /api/blog/popular
// @access  Public
router.get('/popular/list', asyncHandler(async (req, res) => {
  const { limit = 5 } = req.query

  const popularPosts = await db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
      featuredImage: blogPosts.featuredImage,
      viewCount: blogPosts.viewCount,
      publishedAt: blogPosts.publishedAt,
      readingTime: blogPosts.readingTime
    })
    .from(blogPosts)
    .where(eq(blogPosts.status, 'published'))
    .orderBy(desc(blogPosts.viewCount))
    .limit(parseInt(limit))

  res.json({
    success: true,
    data: popularPosts
  })
}))

export default router
