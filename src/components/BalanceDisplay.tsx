'use client'

import { useQuery } from '@tanstack/react-query'
import { Link } from '@/i18n/navigation'

export function BalanceDisplay() {
  const { data, isLoading } = useQuery({
    queryKey: ['userBalance'],
    queryFn: async () => {
      const res = await fetch('/api/user/balance')
      if (!res.ok) throw new Error('Failed to fetch balance')
      return res.json()
    },
    staleTime: 1000 * 60, // 1 minute
  })

  if (isLoading) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f5f5f5] rounded-full animate-pulse">
        <div className="w-4 h-4 bg-[#e5e5e5] rounded-full" />
        <div className="w-8 h-4 bg-[#e5e5e5] rounded" />
      </div>
    )
  }

  if (!data?.success) {
    return null
  }

  // Format balance (e.g. 1000.00 -> 1,000)
  const formattedBalance = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0
  }).format(data.balance || 0)

  return (
    <Link href="/pricing" className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f5f5f5] text-[#171717] rounded-full text-sm font-medium hover:bg-[#e5e5e5] transition-colors cursor-pointer" title="点击充值积分">
      <span className="text-yellow-500">🪙</span>
      <span>{formattedBalance}</span>
    </Link>
  )
}
