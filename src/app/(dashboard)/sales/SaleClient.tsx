'use client'

import { useState } from 'react'
import { Plus, MoreHorizontal, Trash2, Edit, LayoutList, KanbanSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { SaleFormModal } from './SaleFormModal'
import { deleteSale } from './actions'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { SalesKanban } from './SalesKanban'

export function SaleClient({ sales, customers }: { sales: any[], customers: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSale, setSelectedSale] = useState<any>(null)
  const [viewMode, setViewMode] = useState<'list' | 'board'>('board')

  const handleEdit = (sale: any) => {
    setSelectedSale(sale)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this sale?')) {
      try {
        await deleteSale(id)
        toast.success('Sale deleted successfully')
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete sale')
      }
    }
  }

  const handleAddNew = () => {
    setSelectedSale(null)
    setIsModalOpen(true)
  }

  return (
    <div className="flex-1 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Sales Pipeline</h2>
          <p className="text-muted-foreground mt-1">Manage and track your deals.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-muted/50 p-1 rounded-lg border">
            <Button 
              variant={viewMode === 'board' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setViewMode('board')}
              className="h-8"
            >
              <KanbanSquare className="h-4 w-4 mr-2" /> Board
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setViewMode('list')}
              className="h-8"
            >
              <LayoutList className="h-4 w-4 mr-2" /> List
            </Button>
          </div>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" /> Add Deal
          </Button>
        </div>
      </div>

      {viewMode === 'board' ? (
        <SalesKanban initialSales={sales} />
      ) : (
        <div className="border rounded-md bg-card mt-4 shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                    No sales found.
                  </TableCell>
                </TableRow>
              ) : (
                sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(sale.date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="font-medium">{sale.customers?.name}</TableCell>
                    <TableCell>{sale.product_name}</TableCell>
                    <TableCell className="font-medium">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(sale.amount))}
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        sale.status === 'completed' ? 'default' : 
                        sale.status === 'pending' ? 'secondary' : 'destructive'
                      }>
                        {sale.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-muted hover:text-foreground h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(sale)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(sale.id)}>
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
      )}

      <SaleFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        sale={selectedSale} 
        customers={customers}
      />
    </div>
  )
}
