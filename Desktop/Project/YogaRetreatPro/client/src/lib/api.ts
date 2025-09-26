import { supabase } from '@/utils/supabase'

export type FetchRetreatsParams = {
  featured?: boolean
  limit?: number
  search?: string
  categoryId?: string
  countryId?: string
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
    let query = supabase
      .from('retreats')
      .select(`
        *,
        retreat_instructors:retreat_instructors!retreat_instructors_retreat_id_fkey (
          instructor:instructors (* )
        )
      `)
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
