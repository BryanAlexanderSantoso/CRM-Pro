import { createClient } from '@/utils/supabase/server'
import { SaleClient } from './SaleClient'

export default async function SalesPage() {
  const supabase = await createClient()
  
  // Fetch sales with customer names joined
  const { data: sales } = await supabase
    .from('sales')
    .select(`
      *,
      customers (
        name
      )
    `)
    .order('date', { ascending: false })

  // Fetch customers for the dropdown in the Add/Edit form
  const { data: customers } = await supabase
    .from('customers')
    .select('id, name')
    .order('name', { ascending: true })

  return <SaleClient sales={sales || []} customers={customers || []} />
}
