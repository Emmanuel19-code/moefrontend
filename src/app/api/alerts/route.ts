// /api/alerts/route.ts
import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { data: alerts, error: alertsError } = await supabase
      .from('alerts')
      .select('*')
      .order('created_at', { ascending: false });

    if (alertsError) throw alertsError;

    // Fetch transformers
    const { data: transformers, error: transformersError } = await supabase
      .from('transformers')
      .select('id, location, transformer_id');

    if (transformersError) throw transformersError;

    // Merge manually
    const enriched = alerts.map((alert) => {
      const transformer = transformers.find((t) => t.id === alert.transformer_id);
      return {
        ...alert,
        transformer,
      };
    });

    return NextResponse.json(enriched);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
