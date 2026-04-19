'use client'

import React, { useState, useMemo } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  useDroppable,
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useDraggable } from '@dnd-kit/core'
import { updateSaleStatus } from './actions'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DollarSign, Calendar, User } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

const COLUMNS = [
  { id: 'pending', title: 'Pending', color: 'bg-amber-500/10 text-amber-600 border-amber-200' },
  { id: 'completed', title: 'Completed', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200' },
  { id: 'cancelled', title: 'Cancelled', color: 'bg-rose-500/10 text-rose-600 border-rose-200' }
]

function KanbanCard({ sale, isOverlay }: { sale: any, isOverlay?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: sale.id,
    data: sale
  })

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className={cn(
        "cursor-grab active:cursor-grabbing pb-3",
        isDragging && !isOverlay ? "opacity-30" : "opacity-100"
      )}
    >
      <Card className={cn(
        "hover:shadow-md transition-shadow border-border/50 bg-card",
        isOverlay && "shadow-xl rotate-2 cursor-grabbing"
      )}>
        <CardContent className="p-4 space-y-3">
          <div className="flex justify-between items-start">
            <h4 className="font-semibold text-sm line-clamp-1" title={sale.product_name}>
              {sale.product_name}
            </h4>
            <p className="text-sm font-bold text-primary">
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(sale.amount))}
            </p>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-center text-xs text-muted-foreground">
              <User className="w-3.5 h-3.5 mr-1.5" />
              <span className="line-clamp-1">{sale.customers?.name || 'Unknown'}</span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              <span>{format(new Date(sale.date), 'MMM dd, yyyy')}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function KanbanColumn({ id, title, color, children }: { id: string, title: string, color: string, children: React.ReactNode }) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  })

  return (
    <div 
      ref={setNodeRef} 
      className={cn(
        "flex flex-col bg-muted/30 rounded-xl p-4 min-h-[500px] border transition-colors",
        isOver ? "border-primary/50 bg-primary/5" : "border-transparent"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={cn("px-3 py-1 rounded-full text-xs font-semibold border", color)}>
          {title}
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          {React.Children.count(children)}
        </span>
      </div>
      <div className="flex-1 flex flex-col gap-2">
        {children}
      </div>
    </div>
  )
}

export function SalesKanban({ initialSales }: { initialSales: any[] }) {
  const [sales, setSales] = useState(initialSales)
  const [activeId, setActiveId] = useState<string | null>(null)

  React.useEffect(() => {
    setSales(initialSales)
  }, [initialSales])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const saleId = active.id as string
    const newStatus = over.id as string

    const sale = sales.find(s => s.id === saleId)
    if (sale && sale.status !== newStatus) {
      const previousStatus = sale.status
      setSales(prev => prev.map(s => s.id === saleId ? { ...s, status: newStatus } : s))
      
      try {
        await updateSaleStatus(saleId, newStatus)
        toast.success(`Moved to ${COLUMNS.find(c => c.id === newStatus)?.title}`)
      } catch (error) {
        setSales(prev => prev.map(s => s.id === saleId ? { ...s, status: previousStatus } : s))
        toast.error('Failed to update status')
      }
    }
  }

  const activeSale = useMemo(() => sales.find(s => s.id === activeId), [activeId, sales])

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCorners} 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {COLUMNS.map(col => (
          <KanbanColumn key={col.id} id={col.id} title={col.title} color={col.color}>
            {sales.filter(s => s.status === col.id).map(sale => (
              <KanbanCard key={sale.id} sale={sale} />
            ))}
          </KanbanColumn>
        ))}
      </div>

      <DragOverlay>
        {activeSale ? <KanbanCard sale={activeSale} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  )
}
