import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Check authentication status
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse payload
    const body = await request.json()
    const { listing_type, listing_id } = body

    // Validation matching B5.1 specifications
    const validTypes = ['restaurant', 'staff', 'vendor']
    if (!listing_type || !validTypes.includes(listing_type)) {
      return NextResponse.json({ error: 'Invalid listing type' }, { status: 400 })
    }

    if (!listing_id) {
      return NextResponse.json({ error: 'Missing listing ID' }, { status: 400 })
    }

    // Insert log record mapping explicit public table scheme
    const { error: dbError } = await supabase
      .from('contact_logs')
      .insert({
        user_id: user.id,
        listing_type,
        listing_id
      })

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}