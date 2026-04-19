'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2, UserPlus } from 'lucide-react'
import { createTeamMember } from './actions'

export function AddMemberModal({ userRole }: { userRole: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const data = {
      email: formData.get('email') as string,
      full_name: formData.get('full_name') as string,
      role: formData.get('role') as 'manager' | 'karyawan',
    }

    try {
      await createTeamMember(data)
      toast.success('Member created successfully. Password: Password123!')
      setOpen(false)
    } catch (error: any) {
      toast.error(error.message || 'Failed to create member')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button className="bg-black hover:bg-gray-900 text-white rounded-none gap-2 text-xs font-bold uppercase tracking-widest px-6 h-11">
          <UserPlus className="w-4 h-4" />
          Add Team Member
        </Button>
      } />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="full_name" className="text-xs font-bold uppercase tracking-wider text-gray-400">Full Name</Label>
            <Input id="full_name" name="full_name" required className="rounded-none border-gray-200 focus:border-black" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-400">Email Address</Label>
            <Input id="email" name="email" type="email" required className="rounded-none border-gray-200 focus:border-black" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role" className="text-xs font-bold uppercase tracking-wider text-gray-400">Assign Role</Label>
            <Select name="role" defaultValue="karyawan">
              <SelectTrigger className="rounded-none border-gray-200 focus:border-black">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {userRole === 'owner' && <SelectItem value="manager">Manager</SelectItem>}
                <SelectItem value="karyawan">Karyawan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-black hover:bg-gray-900 text-white rounded-none font-bold uppercase tracking-widest h-12 mt-4">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
