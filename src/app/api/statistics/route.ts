import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: transformers, error } = await supabase
      .from('transformers')
      .select('physical_condition')

    if (error) {
      console.error('Error fetching transformer statistics:', error)
      return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 })
    }

    const stats = transformers.reduce(
      (acc, transformer) => {
        const condition = transformer.physical_condition?.toLowerCase()
        
        acc.total += 1
        
        if (condition === 'good') {
          acc.good += 1
        } else if (condition === 'fair') {
          acc.fair += 1
        } else if (condition === 'poor') {
          acc.poor += 1
        } else if (condition === 'critical' || condition === 'very poor') {
          acc.critical += 1
        } else {
          // Default to good if condition is not recognized
          acc.good += 1
        }
        
        return acc
      },
      { total: 0, good: 0, fair: 0, poor: 0, critical: 0 }
    )

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error in statistics API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}