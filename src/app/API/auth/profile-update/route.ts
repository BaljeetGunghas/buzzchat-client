///app/api/auth/profile-update/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/middleware/auth'
import { updateProfile } from '@/controllers/auth.controller'

export async function PUT(req: NextRequest) {
    // 1) Auth check
    const authResult = await requireAuth(req)
    if (authResult instanceof NextResponse) return authResult
    const userId = authResult

    // 2) Delegate to controller with raw NextRequest + userId
    return await updateProfile(req, userId)
}
