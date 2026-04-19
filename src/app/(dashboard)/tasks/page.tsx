import { createClient, getProfile } from '@/utils/supabase/server'
import { TaskClient } from './TaskClient'
import { redirect } from 'next/navigation'

export default async function TasksPage() {
  const supabase = await createClient()
  const profile = await getProfile()
  
  let taskQuery = supabase
    .from('tasks')
    .select('*, customers(name)')
    .order('due_date', { ascending: true })

  if (profile?.role === 'karyawan' || !profile) {
    const userId = (await supabase.auth.getUser()).data.user?.id
    if (userId) taskQuery = taskQuery.eq('assigned_to', userId)
  }

  const { data: tasks } = await taskQuery

  const { data: customers } = await supabase
    .from('customers')
    .select('id, name')

  return (
    <div className="p-6">
      <TaskClient initialTasks={tasks || []} customers={customers || []} />
    </div>
  )
}
