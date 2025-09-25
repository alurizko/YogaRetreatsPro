import express from 'express'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { categories, retreatCategories, retreats } from '../db/schema.js'
import { eq, and, desc, asc } from 'drizzle-orm'

const router = express.Router()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

const db = drizzle(pool)

// Get all categories
router.get('/', async (req, res) => {
  try {
    const allCategories = await db
      .select()
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(asc(categories.sortOrder))

    res.json(allCategories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    res.status(500).json({ error: 'Failed to fetch categories' })
  }
})

// Get category by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params
    
    const category = await db
      .select()
      .from(categories)
      .where(and(eq(categories.slug, slug), eq(categories.isActive, true)))
      .limit(1)

    if (category.length === 0) {
      return res.status(404).json({ error: 'Category not found' })
    }

    res.json(category[0])
  } catch (error) {
    console.error('Error fetching category:', error)
    res.status(500).json({ error: 'Failed to fetch category' })
  }
})

// Get retreats by category
router.get('/:slug/retreats', async (req, res) => {
  try {
    const { slug } = req.params
    const { page = 1, limit = 12, sortBy = 'created_at', sortOrder = 'desc' } = req.query

    const offset = (page - 1) * limit

    // First get the category
    const category = await db
      .select()
      .from(categories)
      .where(and(eq(categories.slug, slug), eq(categories.isActive, true)))
      .limit(1)

    if (category.length === 0) {
      return res.status(404).json({ error: 'Category not found' })
    }

    // Get retreats in this category
    const retreatsInCategory = await db
      .select({
        id: retreats.id,
        title: retreats.title,
        slug: retreats.slug,
        shortDescription: retreats.shortDescription,
        location: retreats.location,
        country: retreats.country,
        city: retreats.city,
        price: retreats.price,
        originalPrice: retreats.originalPrice,
        currency: retreats.currency,
        duration: retreats.duration,
        startDate: retreats.startDate,
        endDate: retreats.endDate,
        images: retreats.images,
        difficulty: retreats.difficulty,
        averageRating: retreats.averageRating,
        totalReviews: retreats.totalReviews,
        isFeatured: retreats.isFeatured,
        organizer: retreats.organizer
      })
      .from(retreats)
      .innerJoin(retreatCategories, eq(retreats.id, retreatCategories.retreatId))
      .where(and(
        eq(retreatCategories.categoryId, category[0].id),
        eq(retreats.isActive, true)
      ))
      .orderBy(sortOrder === 'desc' ? desc(retreats[sortBy]) : asc(retreats[sortBy]))
      .limit(parseInt(limit))
      .offset(offset)

    // Get total count for pagination
    const totalCount = await db
      .select({ count: retreats.id })
      .from(retreats)
      .innerJoin(retreatCategories, eq(retreats.id, retreatCategories.retreatId))
      .where(and(
        eq(retreatCategories.categoryId, category[0].id),
        eq(retreats.isActive, true)
      ))

    res.json({
      retreats: retreatsInCategory,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount.length,
        totalPages: Math.ceil(totalCount.length / limit)
      },
      category: category[0]
    })
  } catch (error) {
    console.error('Error fetching retreats by category:', error)
    res.status(500).json({ error: 'Failed to fetch retreats' })
  }
})

export default router
