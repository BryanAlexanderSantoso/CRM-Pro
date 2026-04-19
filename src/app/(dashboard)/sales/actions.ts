'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createSale(data: any) {
  const supabase = await createClient()
  const { error } = await supabase.from('sales').insert([data])
  if (error) throw new Error(error.message)
  revalidatePath('/sales')
  revalidatePath('/dashboard')
}

export async function updateSale(id: string, data: any) {
  const supabase = await createClient()
  const { error } = await supabase.from('sales').update(data).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/sales')
  revalidatePath('/dashboard')
}

export async function deleteSale(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('sales').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/sales')
  revalidatePath('/dashboard')
}

export async function updateSaleStatus(id: string, status: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('sales').update({ status }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/sales')
  revalidatePath('/dashboard')
}
