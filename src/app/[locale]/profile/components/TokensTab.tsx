'use client'

import { useState } from 'react'
import { AppIcon } from '@/components/ui/icons'

const MOCK_TOKENS = [
  {
    id: 1,
    name: 'BigBanana',
    status: 'enabled',
    key: 'sk-9zHP********vyaR',
    remaining: '无限额度',
    consumed: '¥0.48',
    createdAt: '2026/6/5 23:36:11',
    expiredAt: '永不过期'
  }
]

export function TokensTab() {
  const [tokens, setTokens] = useState(MOCK_TOKENS)

  const handleDisable = (id: number) => {
    setTokens(tokens.map(t => {
      if (t.id === id) {
        return { ...t, status: t.status === 'enabled' ? 'disabled' : 'enabled' }
      }
      return t
    }))
  }

  const handleDelete = (id: number) => {
    setTokens(tokens.filter(t => t.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white border border-[#e5e5e5] rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#171717] mb-2">令牌</h2>
        <p className="text-sm text-[#171717] mb-6">创建和管理项目密钥</p>
        <p className="text-xs text-[#737373]">选择左侧模块，即可完成充值、密钥管理和用量查询。</p>
      </div>

      {/* Create Token Section */}
      <div className="bg-white border border-[#e5e5e5] rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-[#171717] mb-2">创建新令牌</h3>
        <p className="text-sm text-[#737373] mb-6">先把当前项目最需要的创作密钥创建出来，再决定是否限额或设置到期时间。</p>
        
        <div className="bg-[#fafafa] border border-[#e5e5e5] rounded-lg p-6 min-h-[120px] flex items-center">
          <button className="bg-[#171717] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-black transition-colors flex items-center gap-2">
            <AppIcon name="plus" className="w-4 h-4" />
            创建新令牌
          </button>
        </div>
      </div>

      {/* Token List Section */}
      <div className="bg-white border border-[#e5e5e5] rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#e5e5e5] flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#171717] mb-1">令牌列表</h3>
            <p className="text-sm text-[#737373]">把复制、启停、删除和回填当前项目这几件事收敛到一个列表操作区。</p>
          </div>
          <button className="bg-white border border-[#e5e5e5] text-[#171717] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#fafafa] transition-colors flex items-center gap-2">
            <AppIcon name="refresh" className="w-4 h-4" />
            刷新令牌
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          {tokens.map((token) => (
            <div key={token.id} className="border border-[#e5e5e5] rounded-lg p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg font-bold text-[#171717]">{token.name}</span>
                    {token.status === 'enabled' ? (
                      <span className="px-2 py-0.5 text-xs font-medium bg-[#dcfce7] text-[#166534] border border-[#bbf7d0] rounded">已启用</span>
                    ) : (
                      <span className="px-2 py-0.5 text-xs font-medium bg-[#f3f4f6] text-[#4b5563] border border-[#e5e7eb] rounded">已禁用</span>
                    )}
                  </div>
                  <div className="text-sm text-[#737373] font-mono tracking-wider">{token.key}</div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  <button className="px-3 py-1.5 text-sm border border-[#e5e5e5] rounded text-[#525252] hover:bg-[#fafafa] flex items-center gap-1.5 transition-colors">
                    <AppIcon name="eye" className="w-3.5 h-3.5" /> 查看 KEY
                  </button>
                  <button className="px-3 py-1.5 text-sm border border-[#e5e5e5] rounded text-[#525252] hover:bg-[#fafafa] flex items-center gap-1.5 transition-colors">
                    <AppIcon name="copy" className="w-3.5 h-3.5" /> 复制 KEY
                  </button>
                  <button className="px-3 py-1.5 text-sm border border-[#e5e5e5] rounded text-[#525252] hover:bg-[#fafafa] flex items-center gap-1.5 transition-colors">
                    <AppIcon name="link" className="w-3.5 h-3.5" /> 设为项目 KEY
                  </button>
                  <button 
                    onClick={() => handleDisable(token.id)}
                    className="px-3 py-1.5 text-sm border border-[#e5e5e5] rounded text-[#525252] hover:bg-[#fafafa] transition-colors"
                  >
                    {token.status === 'enabled' ? '禁用' : '启用'}
                  </button>
                  <button 
                    onClick={() => handleDelete(token.id)}
                    className="px-3 py-1.5 text-sm border border-[#fca5a5] rounded text-[#ef4444] hover:bg-[#fef2f2] flex items-center gap-1.5 transition-colors"
                  >
                    <AppIcon name="trash" className="w-3.5 h-3.5" /> 删除
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-[#f5f5f5]">
                <div>
                  <div className="text-xs text-[#737373] mb-1">剩余额度</div>
                  <div className="text-sm font-semibold text-[#171717]">{token.remaining}</div>
                </div>
                <div>
                  <div className="text-xs text-[#737373] mb-1">累计消耗</div>
                  <div className="text-sm font-semibold text-[#171717]">{token.consumed}</div>
                </div>
                <div>
                  <div className="text-xs text-[#737373] mb-1">创建时间</div>
                  <div className="text-sm font-semibold text-[#171717]">{token.createdAt}</div>
                </div>
                <div>
                  <div className="text-xs text-[#737373] mb-1">到期时间</div>
                  <div className="text-sm font-semibold text-[#171717]">{token.expiredAt}</div>
                </div>
              </div>
            </div>
          ))}

          {tokens.length === 0 && (
            <div className="text-center py-12 text-[#737373]">
              暂无令牌，请先创建
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
