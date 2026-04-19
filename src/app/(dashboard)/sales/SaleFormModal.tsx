'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { createSale, updateSale } from './actions'

export function SaleFormModal({ 
  isOpen, 
  onClose, 
  sale = null,
  customers = []
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  sale?: any,
  customers: any[]
}) {
  const [loading, setLoading] = useState(false)
  const isEditing = !!sale

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const data = {
      customer_id: formData.get('customer_id'),
      product_name: formData.get('product_name'),
      amount: Number(formData.get('amount')),
      status: formData.get('status'),
    }

    try {
      if (isEditing) {
        await updateSale(sale.id, data)
        toast.success('Sale updated successfully')
      } else {
        await createSale(data)
        toast.success('Sale created successfully')
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
          <DialogTitle>{isEditing ? 'Edit Sale' : 'Add New Sale'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="customer_id">Customer</Label>
            <Select name="customer_id" defaultValue={sale?.customer_id || ''} required>
              <SelectTrigger>
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="product_name">Product Name</Label>
            <Input id="product_name" name="product_name" defaultValue={sale?.product_name || ''} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount (Rp)</Label>
            <Input id="amount" name="amount" type="number" step="0.01" defaultValue={sale?.amount || ''} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue={sale?.status || 'pending'} required>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
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
