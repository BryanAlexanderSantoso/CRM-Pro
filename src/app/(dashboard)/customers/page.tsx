import { createClient } from '@/utils/supabase/server'
import { CustomerClient } from './CustomerClient'

export default async function CustomersPage() {
  const supabase = await createClient()
  
  const { data: customers } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false })

  return <CustomerClient customers={customers || []} />
}
