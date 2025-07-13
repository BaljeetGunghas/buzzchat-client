///app/api/conversations/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth }              from '@/middleware/auth'
import { getOrCreateConversation }  from '@/controllers/conversation.controller'

export const runtime = 'nodejs'    // if you need Node.js runtime for any SDKs

export async function POST(req: NextRequest) {
  // 1) Auth check
  const authResult = await requireAuth(req)
  if (authResult instanceof NextResponse) return authResult

  // 2) Delegate to controller
  return await getOrCreateConversation(req)
}
