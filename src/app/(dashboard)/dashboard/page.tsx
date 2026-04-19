import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Users, DollarSign, Activity, ArrowUpRight, TrendingUp } from 'lucide-react'
import { RevenueChart } from '@/components/RevenueChart'
import { SalesFunnel } from '@/components/SalesFunnel'
import { ActivityFeed } from '@/components/ActivityFeed'
import { createClient } from '@/utils/supabase/server'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Calendar } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch counts and data
  const { data: topLead } = await supabase
    .from('customers')
    .select('name, lead_score')
    .order('lead_score', { ascending: false })
    .limit(1)

  const { count: customersCount } = await supabase
    .from('customers')
    .select('*', { count: 'exact', head: true })

  const { data: salesData } = await supabase
    .from('sales')
    .select('amount, status, date')

  const totalRevenue = salesData
    ?.filter(s => s.status === 'completed')
    ?.reduce((sum, sale) => sum + Number(sale.amount), 0) || 0

  const activeCustomers = customersCount || 0

  // Process funnel data from real customers
  const { data: funnelRaw } = await supabase
    .from('customers')
    .select('status')

  const funnelData = [
    { name: 'Leads', value: funnelRaw?.filter(c => c.status === 'lead').length || 0 },
    { name: 'Prospects', value: funnelRaw?.filter(c => c.status === 'prospect').length || 0 },
    { name: 'Closed Deals', value: salesData?.filter(s => s.status === 'completed').length || 0 },
  ]

  // Process revenue data from real sales
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const monthlyRevenue: Record<string, number> = {}
  
  // Initialize last 6 months with 0
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    monthlyRevenue[months[d.getMonth()]] = 0
  }

  salesData?.forEach(sale => {
    if (sale.status === 'completed') {
      const date = new Date(sale.date)
      const month = months[date.getMonth()]
      if (monthlyRevenue[month] !== undefined) {
        monthlyRevenue[month] += Number(sale.amount)
      }
    }
  })

  const chartData = Object.entries(monthlyRevenue).map(([date, revenue]) => ({
    date,
    revenue
  }))

  return (
    <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Enterprise Overview</h2>
          <p className="text-muted-foreground mt-1 text-sm">Real-time business intelligence and performance metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64 hidden xl:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search metrics..." className="pl-9 h-10 border-gray-200 focus:border-black rounded-none shadow-none focus-visible:ring-0" />
          </div>
          <Button variant="outline" className="h-10 border-gray-200 rounded-none gap-2 text-xs font-bold uppercase tracking-widest px-4">
            <Calendar className="h-4 w-4" />
            Last 30 Days
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:-translate-y-1 hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalRevenue)}
            </div>
            <div className="flex items-center mt-1 text-xs text-emerald-500 font-medium">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +20.1% from last month
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:-translate-y-1 hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Customers</CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{activeCustomers}</div>
            <div className="flex items-center mt-1 text-xs text-emerald-500 font-medium">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +180 new customers
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:-translate-y-1 hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Deals</CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Activity className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {salesData?.filter(s => s.status === 'pending').length || 0}
            </div>
            <div className="flex items-center mt-1 text-xs text-muted-foreground font-medium">
              Active sales in pipeline
            </div>
          </CardContent>
        </Card>

        <Card className="hover:-translate-y-1 hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue Target</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between mb-2">
              <div className="text-2xl font-bold tracking-tight">
                {Math.round((totalRevenue / 500000000) * 100)}%
              </div>
              <div className="text-xs text-muted-foreground">
                Target: Rp500.000.000
              </div>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-black transition-all duration-1000" 
                style={{ width: `${Math.min((totalRevenue / 500000000) * 100, 100)}%` }} 
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4 border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex items-center justify-between flex-row">
            <div>
              <CardTitle>Revenue Forecast</CardTitle>
              <CardDescription>Estimated revenue based on pipeline velocity.</CardDescription>
            </div>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pl-2">
            <RevenueChart data={chartData} />
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-3 border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Sales Funnel</CardTitle>
            <CardDescription>Conversion rates through deal stages.</CardDescription>
          </CardHeader>
          <CardContent>
            <SalesFunnel data={funnelData} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4 border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Global Activity</CardTitle>
            <CardDescription>Real-time event log from across the organization.</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityFeed />
          </CardContent>
        </Card>
        
        <div className="col-span-1 lg:col-span-3 space-y-6">
          <Card className="bg-black text-white shadow-xl border-none">
            <CardHeader>
              <CardTitle className="text-white">Quick Insights</CardTitle>
              <p className="text-xs text-gray-400">AI-powered suggestions</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <p className="text-sm font-medium">Focus on "{topLead?.[0]?.name || 'New Leads'}"</p>
                <p className="text-xs text-gray-400 mt-1">
                  High conversion probability ({topLead?.[0]?.lead_score || 0}%) based on interaction.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Leaderboard</CardTitle>
              <CardDescription>Top revenue contributors.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'Acme Corp', revenue: 45000000, growth: '+12%' },
                { name: 'Global Tech', revenue: 32000000, growth: '+8%' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold">
                      #{i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{item.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.growth} growth</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.revenue)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
