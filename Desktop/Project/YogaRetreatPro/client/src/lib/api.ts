import { supabase } from '@/utils/supabase'

export type FetchRetreatsParams = {
  featured?: boolean
  limit?: number
  search?: string
  categoryId?: string
  countryId?: string
  location?: string
  priceMin?: number
  priceMax?: number
  sort?: 'relevance' | 'price_asc' | 'price_desc' | 'created_desc'
  instructorName?: string
}

export async function fetchRetreatById(id: string) {
  try {
    // Load retreat with related instructors and reviews via foreign tables
    // Adjust relation names if your schema differs
    const { data, error } = await supabase
      .from('retreats')
      .select(`
        *,
        retreat_instructors:retreat_instructors!retreat_instructors_retreat_id_fkey (
          instructor:instructors (* )
        ),
        reviews:reviews(* )
      `)
      .eq('id', id)
      .single()

    return { data, error }
  } catch (error: any) {
    return { data: null, error }
  }
}

export async function fetchRetreats(params: FetchRetreatsParams = {}) {
  try {
    // If filtering by instructorName, force inner joins so only retreats with matching instructors are returned
    const selecting = params.instructorName && params.instructorName.trim().length > 0
      ? `*,
         retreat_instructors:retreat_instructors!inner(
           instructor:instructors!inner(*)
         )`
      : `*,
         retreat_instructors:retreat_instructors!retreat_instructors_retreat_id_fkey (
           instructor:instructors (* )
         )`

    let query = supabase
      .from('retreats')
      .select(selecting)
      .order('created_at', { ascending: false })

    if (params.featured === true) {
      query = query.eq('featured', true)
    }

    if (params.search && params.search.trim().length > 0) {
      const s = params.search.trim()
      query = query.or(`title.ilike.%${s}%,description.ilike.%${s}%`)
    }

    if (params.categoryId) {
      query = query.eq('category_id', params.categoryId)
    }

    if (params.countryId) {
      query = query.eq('country_id', params.countryId)
    }

    if (params.location && params.location.trim().length > 0) {
      const loc = params.location.trim()
      query = query.ilike('location', `%${loc}%`)
    }

    if (typeof params.priceMin === 'number') {
      query = query.gte('price_from', params.priceMin)
    }

    if (typeof params.priceMax === 'number') {
      query = query.lte('price_from', params.priceMax)
    }

    // Instructor filter via joined tables
    if (params.instructorName && params.instructorName.trim().length > 0) {
      const q = params.instructorName.trim()
      // Filter on joined instructor name fields (first_name / last_name)
      query = query.or(
        `retreat_instructors.instructor.first_name.ilike.%${q}%,retreat_instructors.instructor.last_name.ilike.%${q}%`
      )
    }

    // Sorting overrides
    if (params.sort === 'price_asc') {
      query = query.order('price_from', { ascending: true, nullsFirst: true })
    } else if (params.sort === 'price_desc') {
      query = query.order('price_from', { ascending: false, nullsFirst: false })
    } else if (params.sort === 'created_desc') {
      query = query.order('created_at', { ascending: false })
    }

    if (params.limit && params.limit > 0) {
      query = query.limit(params.limit)
    }

    const { data, error } = await query
    return { data: data ?? [], error: error ?? null }
  } catch (error: any) {
    return { data: [], error }
  }
}

export async function createReview(payload: {
  retreat_id: string,
  rating: number,
  comment: string,
  author_name?: string | null
}) {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert([{ ...payload }])
      .select('*')
      .single()
    return { data, error }
  } catch (error: any) {
    return { data: null, error }
  }
}

