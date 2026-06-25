import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Fetch user details from current server-side session
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ authenticated: false, user: null })
    }

    // Return specific sanitized metadata specified in B5.2
    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || null,
        avatar: user.user_metadata?.avatar_url || null,
      }
    })
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}