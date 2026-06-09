'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

export function OverviewTab() {
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [checkInDays, setCheckInDays] = useState(2)

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

  const handleCheckIn = () => {
    setIsCheckedIn(true)
    setCheckInDays(prev => prev + 1)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#e5e5e5] rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-[#171717] mb-2">总览</h2>
        <p className="text-sm text-[#737373]">看余额、状态和下一步动作</p>
        <p className="text-sm text-[#525252] mt-4">选择左侧模块，即可完成充值、密钥管理和用量查询。</p>
      </div>

      {/* Account Overview */}
      <div className="bg-white border border-[#e5e5e5] rounded-xl shadow-sm overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-[#e5e5e5]">
          <div>
            <h3 className="text-base font-bold text-[#171717] mb-1">账号总览</h3>
            <p className="text-xs text-[#737373]">把最常用的信息和动作放在第一屏，进入页面先看到余额和下一步。</p>
          </div>
          <button className="text-sm px-4 py-2 bg-white border border-[#d4d4d4] rounded-lg hover:bg-[#f5f5f5] transition-colors flex items-center gap-2">
            <span>↻</span> 刷新账户
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#e5e5e5]">
          <div className="p-6">
            <div className="text-sm text-[#525252] mb-2">当前余额</div>
            <div className="text-2xl font-bold text-[#171717] mb-2 flex items-center gap-1">
              <span className="text-yellow-500 text-xl">🪙</span> {formattedBalance}
            </div>
            <div className="text-xs text-[#737373]">用于当前账号可用消费额度</div>
          </div>
          <div className="p-6 bg-[#fafafa]">
            <div className="text-sm text-[#525252] mb-2">累计消耗</div>
            <div className="text-2xl font-bold text-[#171717] mb-2">🪙 1,250</div>
            <div className="text-xs text-[#737373]">便于快速判断最近使用情况</div>
          </div>
          <div className="p-6">
            <div className="text-sm text-[#525252] mb-2">请求次数</div>
            <div className="text-2xl font-bold text-[#171717] mb-2">128</div>
            <div className="text-xs text-[#737373]">多维度考察累计使用记录</div>
          </div>
          <div className="p-6">
            <div className="text-sm text-[#525252] mb-2">用户组</div>
            <div className="text-2xl font-medium text-[#171717] mb-2">default</div>
            <div className="text-xs text-[#737373]">决定当前账号可用的资源池与权限范围</div>
          </div>
        </div>
      </div>

      {/* Daily Check-in */}
      <div className="bg-white border border-[#e5e5e5] rounded-xl shadow-sm">
        <div className="flex justify-between items-center p-6">
          <div>
            <h3 className="text-base font-bold text-[#171717] mb-1">每日签到</h3>
            <p className="text-xs text-[#737373]">把签到奖励放在总览页，登录后顺手就能完成。</p>
          </div>
          <button 
            onClick={handleCheckIn}
            disabled={isCheckedIn}
            className={`text-sm px-6 py-2 rounded-lg font-medium transition-colors ${
              isCheckedIn 
                ? 'bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0]' 
                : 'bg-[#171717] text-white hover:bg-[#262626]'
            }`}
          >
            {isCheckedIn ? '✅ 今日已签到' : '🎁 立即签到'}
          </button>
        </div>
        <div className="px-6 pb-6">
          <div className="bg-[#f8f9fa] border border-[#e5e5e5] rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📅</span>
              <div>
                <div className="text-sm font-bold text-[#171717]">签到概览</div>
                <div className="text-xs text-[#525252] mt-1">
                  {isCheckedIn ? '今日已签到' : '今日未签到'}，累计签到 {checkInDays} 天。
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Rewards */}
      <div className="bg-white border border-[#e5e5e5] rounded-xl shadow-sm overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-[#e5e5e5]">
          <div>
            <h3 className="text-base font-bold text-[#171717] mb-1">邀请奖励</h3>
            <p className="text-xs text-[#737373]">把邀请码、邀请链接和邀请收益放到一个面板里，方便直接分享。</p>
          </div>
          <button className="text-sm px-4 py-2 bg-white border border-[#d4d4d4] rounded-lg hover:bg-[#f5f5f5] transition-colors flex items-center gap-2">
            <span>✈️</span> 划转全部到余额
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#e5e5e5]">
          <div className="p-6">
            <div className="text-sm text-[#525252] mb-2">待使用收益</div>
            <div className="text-2xl font-light text-[#171717] mb-2">¥ 0.000000</div>
            <div className="text-xs text-[#737373]">邀请奖励先累计在这里，可一键划转到余额。</div>
          </div>
          <div className="p-6 bg-[#fafafa]">
            <div className="text-sm text-[#525252] mb-2">总收益</div>
            <div className="text-2xl font-light text-[#171717] mb-2">¥ 0.000000</div>
            <div className="text-xs text-[#737373]">展示邀请带来的累计奖励，便于判断活动效果。</div>
          </div>
          <div className="p-6">
            <div className="text-sm text-[#525252] mb-2">邀请人数</div>
            <div className="text-2xl font-light text-[#171717] mb-2">0</div>
            <div className="text-xs text-[#737373]">统计通过你的邀请码注册并产生记录的用户数量。</div>
          </div>
        </div>
        
        {/* Invitation Code & Link */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-t border-[#e5e5e5]">
          <div className="bg-[#fafafa] border border-[#e5e5e5] rounded-xl p-6">
            <div className="flex items-center gap-2 text-sm font-bold text-[#171717] mb-4">
              <span className="text-lg">🎁</span> 邀请码
            </div>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-light tracking-widest text-[#171717] flex-1">GRwE</span>
              <button className="p-2.5 bg-white border border-[#e5e5e5] rounded-lg text-[#525252] hover:bg-[#f5f5f5] transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              </button>
            </div>
            <div className="text-xs text-[#737373] mt-4">对方也可以直接在注册表单里手动填写这个邀请码。</div>
          </div>
          
          <div className="bg-[#fafafa] border border-[#e5e5e5] rounded-xl p-6">
            <div className="flex items-center gap-2 text-sm font-bold text-[#171717] mb-4">
              <span className="text-lg">🔗</span> 邀请链接
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                readOnly 
                value="https://director.tree456.com/account?auth=register&aff=GRwE" 
                className="flex-1 bg-white border border-[#e5e5e5] rounded-lg px-4 py-3 text-sm text-[#171717] outline-none"
              />
              <button className="p-3 bg-white border border-[#e5e5e5] rounded-lg text-[#525252] hover:bg-[#f5f5f5] transition-colors shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              </button>
            </div>
            <div className="text-xs text-[#737373] mt-4">链接会直达 BigBanana 的注册页，并自动带上你的邀请码。</div>
          </div>
        </div>

        {/* Reward Description */}
        <div className="p-6 border-t border-[#e5e5e5] bg-[#fafafa]/50">
          <div className="flex items-center gap-2 text-sm font-bold text-[#171717] mb-4">
            <span className="text-lg">✨</span> 奖励说明
          </div>
          <ul className="space-y-3 text-sm text-[#525252] list-disc list-inside">
            <li>邀请好友注册后，对方完成充值，奖励会累计到邀请收益里。</li>
            <li>邀请收益可以直接在这里划转到你的账户余额中。</li>
            <li>如果对方不走链接，也可以在注册页手动填写你的邀请码。</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
