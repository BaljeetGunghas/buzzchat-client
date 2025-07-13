// src/middleware/auth.ts
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export async function requireAuth(req: NextRequest): Promise<string | NextResponse> {
  const authHeader = req.headers.get('authorization') || ''
  let token = ''

  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7)
  } else {
    token = req.cookies.get('token')?.value ?? ''
  }

  if (!token) {
    return NextResponse.json({ message: 'No token provided' }, { status: 401 })
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string }
    return payload.id
  } catch {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }
}
