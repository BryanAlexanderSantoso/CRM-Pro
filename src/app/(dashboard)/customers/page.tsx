import { createClient, getProfile } from '@/utils/supabase/server'
import { CustomerClient } from './CustomerClient'
import { redirect } from 'next/navigation'

export default async function CustomersPage() {
  const supabase = await createClient()
  const profile = await getProfile()
  
  let query = supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false })

  if (profile?.role === 'karyawan' || !profile) {
    // If no profile, we assume karyawan for safety or use a specific fallback
    const userId = (await supabase.auth.getUser()).data.user?.id
    if (userId) query = query.eq('assigned_to', userId)
  }

  const { data: customers } = await query

  const { data: employees } = await supabase
    .from('profiles')
    .select('id, full_name, role')
    .in('role', ['sales', 'karyawan'])

  return <CustomerClient customers={customers || []} employees={employees || []} role={profile?.role || 'karyawan'} />
}
