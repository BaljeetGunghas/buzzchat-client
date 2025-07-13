// src/app/api/conversations/chat-list/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getUserChatList } from '@/controllers/conversation.controller'
import { requireAuth } from '@/middleware/auth'

export const runtime = 'nodejs'

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    // 1) Auth check
    const authResult = await requireAuth(req)
    if (authResult instanceof NextResponse) return authResult

    // 2) Await and extract userId
    const { userId } = await params
    // 3) Delegate to controller
    return await getUserChatList(userId)
}
