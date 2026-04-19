'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { createTask, updateTask } from './actions'

export function TaskFormModal({ 
  isOpen, 
  onClose, 
  customers,
  task = null 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  customers: any[],
  task?: any 
}) {
  const [loading, setLoading] = useState(false)
  
  const isEditing = !!task

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      due_date: formData.get('due_date'),
      status: formData.get('status') || 'todo',
      customer_id: formData.get('customer_id') || null,
    }

    try {
      if (isEditing) {
        await updateTask(task.id, data)
        toast.success('Task updated successfully')
      } else {
        await createTask(data)
        toast.success('Task created successfully')
      }
      onClose()
    } catch (error: any) {
      toast.error(error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Task' : 'Add New Task'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={task?.title || ''} required placeholder="Follow up with client" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <textarea 
              id="description" 
              name="description" 
              defaultValue={task?.description || ''} 
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Brief details about the task..."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="due_date">Due Date</Label>
            <Input id="due_date" name="due_date" type="datetime-local" defaultValue={task?.due_date ? new Date(task.due_date).toISOString().slice(0, 16) : ''} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="customer_id">Related Customer</Label>
            <Select name="customer_id" defaultValue={task?.customer_id || ''}>
              <SelectTrigger>
                <SelectValue placeholder="Select customer (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {customers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Save Changes' : 'Create Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
