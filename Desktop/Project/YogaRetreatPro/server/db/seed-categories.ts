import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { categories, blogCategories } from './schema.js'
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

const db = drizzle(pool)

const retreatCategories = [
  {
    name: 'Yoga',
    slug: 'yoga',
    description: 'Traditional and modern yoga practices for all levels',
    icon: 'yoga-pose',
    color: '#8B5CF6',
    sortOrder: 1
  },
  {
    name: 'Wellness',
    slug: 'wellness',
    description: 'Holistic wellness and health-focused retreats',
    icon: 'heart',
    color: '#10B981',
    sortOrder: 2
  },
  {
    name: 'Meditation',
    slug: 'meditation',
    description: 'Mindfulness and meditation practices',
    icon: 'brain',
    color: '#3B82F6',
    sortOrder: 3
  },
  {
    name: 'Detox',
    slug: 'detox',
    description: 'Cleansing and detoxification programs',
    icon: 'leaf',
    color: '#059669',
    sortOrder: 4
  },
  {
    name: 'Spiritual',
    slug: 'spiritual',
    description: 'Spiritual growth and enlightenment journeys',
    icon: 'sun',
    color: '#F59E0B',
    sortOrder: 5
  },
  {
    name: 'Mental Health',
    slug: 'mental-health',
    description: 'Mental wellness and stress relief programs',
    icon: 'shield-check',
    color: '#EF4444',
    sortOrder: 6
  },
  {
    name: 'Women\'s Retreats',
    slug: 'womens-retreats',
    description: 'Retreats designed specifically for women',
    icon: 'users',
    color: '#EC4899',
    sortOrder: 7
  },
  {
    name: 'Adventure',
    slug: 'adventure',
    description: 'Active retreats with outdoor adventures',
    icon: 'mountain',
    color: '#7C3AED',
    sortOrder: 8
  },
  {
    name: 'Luxury',
    slug: 'luxury',
    description: 'Premium luxury retreat experiences',
    icon: 'star',
    color: '#D97706',
    sortOrder: 9
  },
  {
    name: 'Budget-Friendly',
    slug: 'budget-friendly',
    description: 'Affordable retreat options',
    icon: 'currency-dollar',
    color: '#6B7280',
    sortOrder: 10
  }
]

const blogCategoriesData = [
  {
    name: 'Yoga Tips',
    slug: 'yoga-tips',
    description: 'Tips and techniques for yoga practice',
    color: '#8B5CF6',
    sortOrder: 1
  },
  {
    name: 'Wellness',
    slug: 'wellness',
    description: 'Health and wellness articles',
    color: '#10B981',
    sortOrder: 2
  },
  {
    name: 'Travel',
    slug: 'travel',
    description: 'Travel guides and destination insights',
    color: '#3B82F6',
    sortOrder: 3
  },
  {
    name: 'Nutrition',
    slug: 'nutrition',
    description: 'Healthy eating and nutrition advice',
    color: '#059669',
    sortOrder: 4
  },
  {
    name: 'Mindfulness',
    slug: 'mindfulness',
    description: 'Mindfulness and meditation practices',
    color: '#F59E0B',
    sortOrder: 5
  },
  {
    name: 'Retreat Stories',
    slug: 'retreat-stories',
    description: 'Personal experiences and retreat stories',
    color: '#EC4899',
    sortOrder: 6
  }
]

async function seedCategories() {
  try {
    console.log('🌱 Seeding retreat categories...')
    
    // Insert retreat categories
    for (const category of retreatCategories) {
      await db.insert(categories).values(category).onConflictDoNothing()
      console.log(`✅ Added category: ${category.name}`)
    }
    
    console.log('🌱 Seeding blog categories...')
    
    // Insert blog categories
    for (const category of blogCategoriesData) {
      await db.insert(blogCategories).values(category).onConflictDoNothing()
      console.log(`✅ Added blog category: ${category.name}`)
    }
    
    console.log('🎉 Categories seeded successfully!')
    
  } catch (error) {
    console.error('❌ Error seeding categories:', error)
  } finally {
    await pool.end()
  }
}

seedCategories()
