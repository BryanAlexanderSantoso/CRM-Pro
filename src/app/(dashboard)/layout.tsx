import { Sidebar } from '@/components/Sidebar'
import { Toaster } from '@/components/ui/sonner'
import { getProfile } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await getProfile()
  
  // If no profile but user is logged in (middleware check), 
  // fallback to a basic role to avoid redirect loops with middleware.
  const userRole = profile?.role || 'karyawan'

  return (
    <div className="h-screen relative flex bg-background">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-80">
        <Sidebar role={userRole} />
      </div>
      <main className="md:pl-72 w-full h-full">
        <div className="h-full overflow-y-auto bg-muted/20 border-l border-border/40">
          <div className="p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  )
}
