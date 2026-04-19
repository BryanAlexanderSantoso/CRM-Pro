'use client'

import { useState } from 'react'
import { Plus, Search, MoreHorizontal, Trash2, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { CustomerFormModal } from './CustomerFormModal'
import { deleteCustomer } from './actions'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function CustomerClient({ customers }: { customers: any[] }) {
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
  )

  const handleEdit = (customer: any) => {
    setSelectedCustomer(customer)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer(id)
        toast.success('Customer deleted successfully')
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete customer')
      }
    }
  }

  const handleAddNew = () => {
    setSelectedCustomer(null)
    setIsModalOpen(true)
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>

      <div className="flex items-center space-x-2 bg-white p-4 rounded-md border">
        <Search className="h-5 w-5 text-gray-400" />
        <Input 
          placeholder="Search customers..." 
          className="border-none shadow-none focus-visible:ring-0" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="border rounded-md bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>AI Score</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                  No customers found.
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">
                    <div>{customer.name}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-tight">{customer.company || 'Personal'}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1.5">
                      {customer.email && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground group">
                          <span className="w-1 h-1 rounded-full bg-blue-400"></span>
                          {customer.email}
                        </div>
                      )}
                      {customer.phone && (
                        <a 
                          href={`https://wa.me/${customer.phone.replace(/\D/g, '')}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                        >
                          <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                          WA: {customer.phone}
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      customer.status === 'customer' ? 'default' : 
                      customer.status === 'prospect' ? 'secondary' : 'outline'
                    }>
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "h-2 w-12 rounded-full bg-muted overflow-hidden",
                      )}>
                        <div 
                          className={cn(
                            "h-full transition-all",
                            customer.lead_score > 80 ? "bg-emerald-500" : 
                            customer.lead_score > 50 ? "bg-amber-500" : "bg-rose-500"
                          )} 
                          style={{ width: `${customer.lead_score}%` }} 
                        />
                      </div>
                      <span className="text-xs font-bold">{customer.lead_score}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-muted hover:text-foreground h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(customer)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(customer.id)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CustomerFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        customer={selectedCustomer} 
      />
    </div>
  )
}
