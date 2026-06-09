'use client'

import { useSession } from 'next-auth/react'
import { AppIcon, type AppIconName } from '@/components/ui/icons'
import { useQuery } from '@tanstack/react-query'

interface SidebarItem {
  id: string
  label: string
  icon: AppIconName
}

const NAV_ITEMS: SidebarItem[] = [
  { id: 'overview', label: '总览', icon: 'settingsHex' }, // Or another appropriate icon
  { id: 'topup', label: '充值', icon: 'settingsHex' }, // need different icons
  { id: 'tokens', label: '令牌', icon: 'settingsHex' },
  { id: 'logs', label: '日志', icon: 'settingsHex' },
  { id: 'pricing', label: '模型价格', icon: 'settingsHex' },
]

export function ProfileSidebar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (id: string) => void }) {
  const { data: session } = useSession()
  const userName = session?.user?.name || 'User'
  const userInitial = userName.charAt(0).toUpperCase()

  const { data: balanceData } = useQuery({
    queryKey: ['userBalance'],
    queryFn: async () => {
      const res = await fetch('/api/user/balance')
      if (!res.ok) throw new Error('Failed to fetch balance')
      return res.json()
    },
    staleTime: 1000 * 60,
  })

  const balance = balanceData?.balance || 0
  const formattedBalance = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0
  }).format(balance)

  return (
    <aside className="w-[260px] flex-shrink-0 flex flex-col gap-4 overflow-y-auto pr-4">
      {/* User Info Card */}
      <div className="bg-white border border-[#e5e5e5] rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-[#f5f5f5] text-[#171717] flex items-center justify-center text-xl font-semibold border border-[#e5e5e5]">
            {userInitial}
          </div>
          <div className="min-w-0">
            <div className="text-base font-bold text-[#171717] truncate">{userName}</div>
            <div className="text-xs text-[#737373] mt-1">已登录，可直接管理令牌、调用与日志</div>
          </div>
        </div>

        <div className="bg-[#fafafa] rounded-lg p-3 border border-[#e5e5e5] mb-4">
          <div className="text-xs text-[#737373] mb-1">余额</div>
          <div className="text-xl font-bold text-[#171717] flex items-center gap-1">
            <span className="text-yellow-500 text-lg">🪙</span> {formattedBalance}
          </div>
        </div>

        <div className="border border-[#e5e5e5] rounded-lg p-3 mb-4 flex justify-between items-center">
          <div className="text-sm font-medium text-[#171717]">订阅额度</div>
          <button className="text-xs px-3 py-1 bg-white border border-[#d4d4d4] rounded hover:bg-[#f5f5f5] transition-colors">
            无生效
          </button>
        </div>
        <div className="text-xs text-[#737373] mb-4">购买套餐后，订阅额度会显示在这里。</div>

        <div className="border border-[#e5e5e5] rounded-lg p-3">
          <div className="text-xs text-[#737373] mb-1">用户组</div>
          <div className="text-sm font-medium text-[#171717]">default</div>
        </div>
      </div>

      {/* Navigation Card */}
      <div className="bg-white border border-[#e5e5e5] rounded-xl p-2 shadow-sm flex-1">
        <nav className="space-y-1">
          {NAV_ITEMS.map(item => {
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors text-left ${
                  isActive
                    ? 'bg-[#f8f9fa] text-[#171717] font-semibold border-l-4 border-[#171717]'
                    : 'text-[#525252] hover:bg-[#fafafa] border-l-4 border-transparent'
                }`}
              >
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
