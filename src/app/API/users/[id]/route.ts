// src/app/api/users/[id]/route.ts
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/middleware/auth'
import { getUserById } from '@/controllers/user.controller'

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    // 1) Auth
    const auth = await requireAuth(req)
    if (auth instanceof NextResponse) return auth

    // 2) Await params
    const { id } = await context.params

    // 3) Delegate
    return await getUserById(id)
}
