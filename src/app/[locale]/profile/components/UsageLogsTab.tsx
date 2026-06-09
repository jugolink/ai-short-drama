'use client'

import { useState } from 'react'
import { AppIcon } from '@/components/ui/icons'

const MOCK_LOGS = [
  { id: 1, time: '2026/6/5 23:41:46', token: 'BigBanana', model: 'gpt-5.4', input: 1007, output: 352, cost: 0.007798 },
  { id: 2, time: '2026/6/5 23:39:24', token: 'BigBanana', model: 'gpt-5.4', input: 1008, output: 280, cost: 0.006720 },
  { id: 3, time: '2026/6/5 23:39:12', token: 'BigBanana', model: 'gpt-5.4', input: 1008, output: 388, cost: 0.008340 },
  { id: 4, time: '2026/6/5 23:39:12', token: 'BigBanana', model: 'gpt-5.4', input: 1009, output: 383, cost: 0.008268 },
  { id: 5, time: '2026/6/5 23:39:03', token: 'BigBanana', model: 'gpt-5.4', input: 1613, output: 658, cost: 0.013902 },
  { id: 6, time: '2026/6/5 23:39:02', token: 'BigBanana', model: 'gpt-5.4', input: 1010, output: 310, cost: 0.007176 },
  { id: 7, time: '2026/6/5 23:39:00', token: 'BigBanana', model: 'gpt-5.4', input: 1011, output: 430, cost: 0.008978 },
  { id: 8, time: '2026/6/5 23:38:49', token: 'BigBanana', model: 'gpt-5.4', input: 2051, output: 963, cost: 0.019572 },
  { id: 9, time: '2026/6/5 23:38:31', token: 'BigBanana', model: 'gpt-5.4', input: 1044, output: 1033, cost: 0.018106 },
  { id: 10, time: '2026/6/5 23:38:12', token: 'BigBanana', model: 'gpt-5.4', input: 618, output: 1321, cost: 0.021360 },
]

export function UsageLogsTab() {
  const [activeTab, setActiveTab] = useState<'usage' | 'task'>('usage')

  return (
    <div className="space-y-6">
      {/* Top Filter Section */}
      <div className="bg-white border border-[#e5e5e5] rounded-xl p-6 shadow-sm">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#171717] mb-2">使用日志</h2>
            <p className="text-sm text-[#737373]">按时间、令牌、模型和渠道筛选后，快速确认消费来源与错误分布。</p>
          </div>
          <button className="bg-[#171717] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors flex items-center gap-2">
            <AppIcon name="search" className="w-4 h-4" />
            查询使用日志
          </button>
        </div>

        <div className="flex border-b border-[#e5e5e5] mb-6">
          <button
            onClick={() => setActiveTab('usage')}
            className={`px-6 py-2.5 text-sm font-medium transition-colors ${
              activeTab === 'usage' 
                ? 'bg-[#171717] text-white' 
                : 'text-[#525252] hover:bg-[#f5f5f5]'
            }`}
          >
            使用日志
          </button>
          <button
            onClick={() => setActiveTab('task')}
            className={`px-6 py-2.5 text-sm font-medium transition-colors ${
              activeTab === 'task' 
                ? 'bg-[#171717] text-white' 
                : 'text-[#525252] hover:bg-[#f5f5f5]'
            }`}
          >
            任务日志
          </button>
        </div>

        <div className="flex flex-wrap gap-4">
          <select className="px-4 py-2 bg-white border border-[#e5e5e5] rounded-lg text-sm text-[#171717] outline-none min-w-[120px]">
            <option>消费日志</option>
          </select>
          <div className="flex items-center gap-2">
            <input type="date" defaultValue="2026-06-02" className="px-4 py-2 bg-white border border-[#e5e5e5] rounded-lg text-sm text-[#171717] outline-none" />
            <span className="text-[#a3a3a3]">-</span>
            <input type="date" defaultValue="2026-06-09" className="px-4 py-2 bg-white border border-[#e5e5e5] rounded-lg text-sm text-[#171717] outline-none" />
          </div>
          <input type="text" placeholder="按渠道 ID 筛选" className="px-4 py-2 bg-white border border-[#e5e5e5] rounded-lg text-sm text-[#171717] outline-none placeholder-[#a3a3a3]" />
          <input type="text" placeholder="按令牌名称筛选" className="px-4 py-2 bg-white border border-[#e5e5e5] rounded-lg text-sm text-[#171717] outline-none placeholder-[#a3a3a3]" />
          <input type="text" placeholder="按模型名称筛选" className="px-4 py-2 bg-white border border-[#e5e5e5] rounded-lg text-sm text-[#171717] outline-none placeholder-[#a3a3a3]" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#e5e5e5] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-xs text-[#737373] mb-2 uppercase tracking-wider font-medium">消费额度</div>
            <div className="text-3xl font-light text-[#171717] mb-2">$0.120220</div>
          </div>
          <div className="text-xs text-[#a3a3a3]">当前筛选条件下的累计消费金额。</div>
        </div>
        <div className="bg-white border border-[#e5e5e5] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-xs text-[#737373] mb-2 uppercase tracking-wider font-medium">RPM</div>
            <div className="text-3xl font-light text-[#171717] mb-2">0</div>
          </div>
          <div className="text-xs text-[#a3a3a3]">每分钟请求速率。</div>
        </div>
        <div className="bg-white border border-[#e5e5e5] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-xs text-[#737373] mb-2 uppercase tracking-wider font-medium">TPM</div>
            <div className="text-3xl font-light text-[#171717] mb-2">0</div>
          </div>
          <div className="text-xs text-[#a3a3a3]">每分钟 Token 消耗量。</div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-[#e5e5e5] rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#e5e5e5]">
          <h3 className="text-lg font-bold text-[#171717] mb-1">日志明细</h3>
          <p className="text-sm text-[#737373]">保留时间、令牌、模型和输入输出，便于快速确认消费来源。</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#525252]">
            <thead className="bg-[#fafafa] border-b border-[#e5e5e5] text-xs font-semibold text-[#171717]">
              <tr>
                <th className="px-6 py-4 font-semibold">时间</th>
                <th className="px-6 py-4 font-semibold">令牌</th>
                <th className="px-6 py-4 font-semibold">模型</th>
                <th className="px-6 py-4 font-semibold">输入 / 输出</th>
                <th className="px-6 py-4 font-semibold">花费</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e5e5]">
              {MOCK_LOGS.map((log) => (
                <tr key={log.id} className="hover:bg-[#fafafa] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">{log.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{log.token}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{log.model}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{log.input} / {log.output}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${log.cost.toFixed(6)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
