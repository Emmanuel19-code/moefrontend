import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const alertId = parseInt(context.params.id)

    const { data: alert, error } = await supabase
      .from('alerts')
      .update({
        resolved: true,
        resolved_at: new Date().toISOString(),
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
