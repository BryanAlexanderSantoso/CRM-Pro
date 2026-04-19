import { createClient, getProfile } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { TeamClient } from './TeamClient'

export default async function TeamPage() {
  const supabase = await createClient()
  const profile = await getProfile()

  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard')
  }

  const { data: employees } = await supabase
    .from('profiles')
    .select('*')
    .in('role', ['karyawan', 'sales'])
    .order('created_at', { ascending: false })

  const { data: stats } = await supabase
    .from('customers')
    .select('assigned_to, status')

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Team Management</h2>
          <p className="text-muted-foreground mt-1 text-sm">Monitor and manage your employee performance and assignments.</p>
        </div>
      </div>
      <TeamClient employees={employees || []} stats={stats || []} userRole={profile.role} />
    </div>
  )
}
