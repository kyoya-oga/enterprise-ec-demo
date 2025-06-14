import { NextResponse } from 'next/server'
import { mockProducts } from '../data'

export function GET(_req: Request, { params }: { params: { id: string } }) {
  const product = mockProducts.find(p => p.id === parseInt(params.id))
  if (!product) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json(product)
}
