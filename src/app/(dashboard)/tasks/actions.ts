'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createTask(data: any) {
  const supabase = await createClient()
  const { error } = await supabase.from('tasks').insert([data])
  if (error) throw new Error(error.message)
  
  // Log activity
  await supabase.from('activity_logs').insert([{
    action: 'created',
    entity: 'task',
    details: `Created task: ${data.title}`
  }])

  revalidatePath('/tasks')
  revalidatePath('/dashboard')
}

export async function updateTask(id: string, data: any) {
  const supabase = await createClient()
  const { error } = await supabase.from('tasks').update(data).eq('id', id)
  if (error) throw new Error(error.message)
  
  revalidatePath('/tasks')
  revalidatePath('/dashboard')
}

export async function deleteTask(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('tasks').delete().eq('id', id)
  if (error) throw new Error(error.message)
  
  revalidatePath('/tasks')
  revalidatePath('/dashboard')
}

export async function toggleTaskStatus(id: string, currentStatus: string) {
  const newStatus = currentStatus === 'done' ? 'todo' : 'done'
  const supabase = await createClient()
  const { error } = await supabase.from('tasks').update({ status: newStatus }).eq('id', id)
  if (error) throw new Error(error.message)
  
  revalidatePath('/tasks')
  revalidatePath('/dashboard')
}
