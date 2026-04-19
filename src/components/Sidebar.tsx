'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, ShoppingCart, LogOut, Command, CheckSquare, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    color: 'text-primary',
  },
  {
    label: 'Customers',
    icon: Users,
    href: '/customers',
    color: 'text-primary',
  },
  {
    label: 'Sales',
    icon: ShoppingCart,
    href: '/sales',
    color: 'text-primary',
  },
  {
    label: 'Tasks',
    icon: CheckSquare,
    href: '/tasks',
    color: 'text-primary',
  },
  {
    label: 'Team',
    icon: ShieldCheck,
    href: '/team',
    color: 'text-primary',
    adminOnly: true,
  },
]

export function Sidebar({ role }: { role: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const filteredRoutes = routes.filter(route => !route.adminOnly || ['owner', 'manager'].includes(role))

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-background border-r border-border text-foreground">
      <div className="px-4 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-2 mb-10 mt-2 transition-transform hover:scale-[1.02]">
          <div className="flex items-center justify-center p-2 bg-primary/10 rounded-xl mr-3 border border-primary/20">
            <Command className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            CRM Pro
          </h1>
        </Link>
        <div className="space-y-2">
          {filteredRoutes.map((route) => (
            <Link
              href={route.href}
              key={route.href}
              className={cn(
                'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer rounded-xl transition-all duration-200',
                pathname === route.href ? 'bg-primary text-primary-foreground shadow-md hover:bg-primary/90' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn('h-5 w-5 mr-3', pathname === route.href ? 'text-primary-foreground' : route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="px-4 py-4 border-t border-border/50">
        <button
          onClick={handleLogout}
          className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-foreground hover:bg-destructive/10 hover:text-destructive rounded-xl transition-all duration-200 text-muted-foreground"
        >
          <div className="flex items-center flex-1">
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </div>
        </button>
      </div>
    </div>
  )
}
