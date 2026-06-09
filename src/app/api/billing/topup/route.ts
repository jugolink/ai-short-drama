import { NextResponse } from 'next/server'
import { requireUserAuth, isErrorResponse } from '@/lib/api-auth'
import { apiHandler } from '@/lib/api-errors'
import { addBalance } from '@/lib/billing/ledger'

/**
 * POST /api/billing/topup
 * 模拟充值接口，增加积分
 */
export const POST = apiHandler(async (request: Request) => {
  const authResult = await requireUserAuth()
  if (isErrorResponse(authResult)) return authResult
  const { session } = authResult

  const body = await request.json()
  const { amount, price, packageId } = body

  if (!amount || typeof amount !== 'number' || amount <= 0) {
    return NextResponse.json({ success: false, error: 'Invalid amount' }, { status: 400 })
  }

  // 真实加钱
  const success = await addBalance(session.user.id, amount, { 
    reason: `SaaS Top-up: Package ${packageId} (${price} RMB)` 
  })

  return NextResponse.json({
    success
  })
})
