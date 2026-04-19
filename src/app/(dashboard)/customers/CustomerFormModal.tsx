'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { createCustomer, updateCustomer } from './actions'

export function CustomerFormModal({ 
  isOpen, 
  onClose, 
  customer = null,
  employees = [],
  role = 'karyawan'
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  customer?: any,
  employees?: any[],
  role?: string
}) {
  const [loading, setLoading] = useState(false)
  
  const isEditing = !!customer
  const isAdmin = role === 'admin'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      company: formData.get('company'),
      status: formData.get('status'),
      assigned_to: formData.get('assigned_to') || null,
    }

    try {
      if (isEditing) {
        await updateCustomer(customer.id, data)
        toast.success('Customer updated successfully')
      } else {
        await createCustomer(data)
        toast.success('Customer created successfully')
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
          <DialogTitle>{isEditing ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" defaultValue={customer?.name || ''} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" name="email" type="email" defaultValue={customer?.email || ''} placeholder="example@company.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">WhatsApp Number</Label>
            <Input id="phone" name="phone" defaultValue={customer?.phone || ''} placeholder="628123456789" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="company">Company / Organization</Label>
            <Input id="company" name="company" defaultValue={customer?.company || ''} placeholder="Acme Inc." />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={customer?.status || 'lead'}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="prospect">Prospect</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isAdmin && (
              <div className="grid gap-2">
                <Label htmlFor="assigned_to">Assign To</Label>
                <Select name="assigned_to" defaultValue={customer?.assigned_to || ''}>
                  <SelectTrigger>
                    <SelectValue placeholder="Employee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Unassigned</SelectItem>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.full_name || 'Anonymous'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Save Changes' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
