import { supabase } from '@/utils/supabase'

// Generic function to get data from a table
export async function getTableData<T = any>(tableName: string): Promise<T[]> {
  const { data, error } = await supabase
    .from(tableName)
    .select('*')

  if (error) {
    console.error(`Error fetching ${tableName}:`, error)
    return []
  }
  return (data as T[]) || []
}

// Generic function to add a row to a table
export async function addTableRow<T extends Record<string, any>>(tableName: string, rowData: T): Promise<T | null> {
  const { data, error } = await supabase
    .from(tableName)
    .insert([rowData])
    .select()

  if (error) {
    console.error(`Error adding row to ${tableName}:`, error)
    return null
  }
  return (data?.[0] as T) ?? null
}
