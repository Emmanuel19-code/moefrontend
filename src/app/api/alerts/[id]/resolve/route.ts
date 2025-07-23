// app/api/alerts/[id]/resolve/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const alertId = parseInt(params.id)

    const { data: alert, error } = await supabase
      .from('alerts')
      .update({
        resolved: true,
        resolved_at: new Date().toISOString(), // use snake_case if your DB uses it
      })
      .eq('id', alertId)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to resolve alert' }, { status: 500 })
    }

    return NextResponse.json(alert)
  } catch (error) {
    console.error('Catch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
