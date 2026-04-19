'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { getProfile } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createTeamMember(formData: {
  email: string
  full_name: string
  role: 'manager' | 'karyawan'
}) {
  const profile = await getProfile()
  if (!profile) throw new Error('Unauthorized')

  // RBAC Check
  // Owner can create Managers and Karyawan
  // Manager can only create Karyawan
  if (profile.role === 'manager' && formData.role !== 'karyawan') {
    throw new Error('Managers can only create Karyawan accounts')
  }

  if (profile.role !== 'owner' && profile.role !== 'manager') {
    throw new Error('Only Owners and Managers can create accounts')
  }

  const adminClient = createAdminClient()

  // Create the Auth User
  const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
    email: formData.email,
    password: 'Password123!', // Default password, user should change it
    email_confirm: true,
    user_metadata: {
      full_name: formData.full_name
    }
  })

  if (authError) throw authError

  // The trigger 'on_auth_user_created' will handle inserting into 'profiles'.
  // But the trigger defaults to 'karyawan' if not first user.
  // So we need to update the role manually if it's supposed to be 'manager'.
  if (formData.role !== 'karyawan') {
    const { error: profileError } = await adminClient
      .from('profiles')
      .update({ role: formData.role })
      .eq('id', authUser.user.id)

    if (profileError) throw profileError
  }

  revalidatePath('/team')
  return { success: true }
}
