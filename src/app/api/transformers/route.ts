import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: transformers, error } = await supabase
      .from('transformers')
      .select('*')
      .order('id', { ascending: true })

    if (error) {
      console.error('Error fetching transformers:', error)
      return NextResponse.json({ error: 'Failed to fetch transformers' }, { status: 500 })
    }
     console.log(transformers);
     
    return NextResponse.json(transformers)
  } catch (error) {
    console.error('Error in transformers API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { data: transformer, error } = await supabase
      .from('transformers')
      .insert(body)
      .select()
      .single()
    if (error) {
      console.error('Error creating transformer:', error)
      return NextResponse.json({ error: 'Failed to create transformer' }, { status: 500 })
    }
    return NextResponse.json(transformer, { status: 201 })
  } catch (error) {
    console.error('Error in transformer creation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}