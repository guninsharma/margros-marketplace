import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // Validate the next redirect path to prevent open redirect vulnerabilities
  const nextParam = searchParams.get('next') ?? '/'
  const isSafeRedirect = nextParam.startsWith('/') && !nextParam.startsWith('//')
  const next = isSafeRedirect ? nextParam : '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Fallback if authentication pipeline drops a signal
  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}