// src/app/api/users/route.ts
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/middleware/auth'
import { getAllUsers } from '@/controllers/user.controller'

export async function GET(req: NextRequest) {
    // 1) Auth
    const auth = await requireAuth(req)
    if (auth instanceof NextResponse) return auth

    // 2) Delegate
    return await getAllUsers()
}
