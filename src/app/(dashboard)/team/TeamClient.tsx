'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, Mail, Briefcase, TrendingUp } from 'lucide-react'
import { AddMemberModal } from './AddMemberModal'

export function TeamClient({ employees, stats, userRole }: { employees: any[], stats: any[], userRole: string }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <AddMemberModal userRole={userRole} />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {employees.map((employee) => {
        const assignedCustomers = stats.filter(s => s.assigned_to === employee.id)
        const closedDeals = assignedCustomers.filter(s => s.status === 'customer').length

        return (
          <Card key={employee.id} className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{employee.full_name || 'Anonymous'}</CardTitle>
                <Badge variant="outline" className="text-[10px] uppercase tracking-widest mt-1">
                  {employee.role}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Assigned</p>
                  <p className="text-xl font-bold">{assignedCustomers.length}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Closed</p>
                  <p className="text-xl font-bold">{closedDeals}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border/50 flex flex-col gap-2">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Briefcase className="w-3.5 h-3.5 mr-2" />
                  Active in pipeline
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="w-3.5 h-3.5 mr-2" />
                  Performance: {assignedCustomers.length > 0 ? Math.round((closedDeals / assignedCustomers.length) * 100) : 0}%
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
      </div>
    </div>
  )
}
