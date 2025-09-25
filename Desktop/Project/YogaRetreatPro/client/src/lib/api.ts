import { supabase } from '@/utils/supabase'

export type FetchRetreatsParams = {
  featured?: boolean
  limit?: number
  search?: string
  categoryId?: string
  countryId?: string
}

export async function fetchRetreats(params: FetchRetreatsParams = {}) {
  try {
    let query = supabase
      .from('retreats')
      .select('*')
      .eq('status', 'published')

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
