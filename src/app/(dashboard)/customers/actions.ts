'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createCustomer(data: any) {
  const supabase = await createClient()
  const { error } = await supabase.from('customers').insert([data])
  if (error) throw new Error(error.message)
  revalidatePath('/customers')
  revalidatePath('/dashboard')
}

export async function updateCustomer(id: string, data: any) {
  const supabase = await createClient()
  const { error } = await supabase.from('customers').update(data).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/customers')
}

export async function deleteCustomer(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('customers').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/customers')
  revalidatePath('/dashboard')
}
