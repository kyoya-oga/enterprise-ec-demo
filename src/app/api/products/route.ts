import { NextResponse } from 'next/server'
import { mockProducts, categories } from './data'

export function GET() {
  return NextResponse.json({ products: mockProducts, categories })
}
