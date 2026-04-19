import { createClient } from '@/utils/supabase/server'
import { TaskClient } from './TaskClient'

export default async function TasksPage() {
  const supabase = await createClient()
  
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*, customers(name)')
    .order('due_date', { ascending: true })

  const { data: customers } = await supabase
    .from('customers')
    .select('id, name')

  return (
    <div className="p-6">
      <TaskClient initialTasks={tasks || []} customers={customers || []} />
    </div>
  )
}
