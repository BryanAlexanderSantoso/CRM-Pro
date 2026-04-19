'use client'

import { useState, useEffect } from 'react'
import { Plus, CheckCircle2, Circle, Clock, Trash2, Calendar as CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { toggleTaskStatus, deleteTask } from './actions'
import { toast } from 'sonner'
import { TaskFormModal } from './TaskFormModal'
import { cn } from '@/lib/utils'

export function TaskClient({ initialTasks, customers }: { initialTasks: any[], customers: any[] }) {
  const [tasks, setTasks] = useState(initialTasks)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)

  useEffect(() => {
    setTasks(initialTasks)
  }, [initialTasks])

  const handleToggle = async (id: string, currentStatus: string) => {
    try {
      await toggleTaskStatus(id, currentStatus)
      toast.success('Task updated')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this task?')) {
      try {
        await deleteTask(id)
        toast.success('Task deleted')
      } catch (error: any) {
        toast.error(error.message)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tasks & Calendar</h2>
          <p className="text-muted-foreground mt-1">Manage your follow-ups and daily objectives.</p>
        </div>
        <Button onClick={() => { setSelectedTask(null); setIsModalOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tasks.length === 0 ? (
          <Card className="col-span-full py-10">
            <CardContent className="flex flex-col items-center justify-center text-muted-foreground">
              <Clock className="h-10 w-10 mb-4 opacity-20" />
              <p>No tasks scheduled.</p>
            </CardContent>
          </Card>
        ) : (
          tasks.map((task) => (
            <Card key={task.id} className={cn(
              "group hover:shadow-md transition-all border-border/50",
              task.status === 'done' && "opacity-60 bg-muted/30"
            )}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className={cn(
                    "text-lg font-bold leading-none",
                    task.status === 'done' && "line-through"
                  )}>
                    {task.title}
                  </CardTitle>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <CalendarIcon className="mr-1 h-3 w-3" />
                    {format(new Date(task.due_date), 'MMM dd, h:mm a')}
                  </div>
                </div>
                <button 
                  onClick={() => handleToggle(task.id, task.status)}
                  className="p-1 hover:bg-primary/10 rounded-full transition-colors"
                >
                  {task.status === 'done' ? (
                    <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                  ) : (
                    <Circle className="h-6 w-6 text-muted-foreground" />
                  )}
                </button>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {task.description || 'No description provided.'}
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                    {task.customers?.name || 'General'}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDelete(task.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <TaskFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        customers={customers}
        task={selectedTask}
      />
    </div>
  )
}
