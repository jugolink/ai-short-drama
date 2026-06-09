'use client'

import { useQuery } from '@tanstack/react-query'

interface Transaction {
  id: string
  type: string
  amount: string
  balanceAfter: string
  reason?: string
  description?: string
  createdAt: string
}

export function BillingHistory() {
  const { data, isLoading } = useQuery({
    queryKey: ['billingHistory'],
    queryFn: async () => {
      const res = await fetch('/api/billing/history')
      if (!res.ok) throw new Error('Failed to fetch history')
      return res.json()
    }
  })

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-[#171717]">账单与资金流水</h2>
      
      {isLoading ? (
        <div className="text-center py-8 text-[#a3a3a3]">加载中...</div>
      ) : !data?.transactions || data.transactions.length === 0 ? (
        <div className="text-center py-8 text-[#a3a3a3]">暂无流水记录</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#e5e5e5] text-[#737373]">
                <th className="pb-3 font-medium">时间</th>
                <th className="pb-3 font-medium">类型</th>
                <th className="pb-3 font-medium">金额</th>
                <th className="pb-3 font-medium">余额</th>
                <th className="pb-3 font-medium">详情</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e5e5]">
              {data.transactions.map((tx: Transaction) => (
                <tr key={tx.id} className="hover:bg-[#f8f9fa] transition-colors">
                  <td className="py-3 text-[#525252]">
                    {new Date(tx.createdAt).toLocaleString('zh-CN')}
                  </td>
                  <td className="py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      tx.type === 'add' ? 'bg-green-100 text-green-800' :
                      tx.type === 'freeze' ? 'bg-orange-100 text-orange-800' :
                      tx.type === 'confirm' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {tx.type === 'add' ? '增加' :
                       tx.type === 'freeze' ? '冻结' :
                       tx.type === 'confirm' ? '扣款' :
                       tx.type === 'rollback' ? '退款' : tx.type}
                    </span>
                  </td>
                  <td className={`py-3 font-medium ${tx.type === 'add' || tx.type === 'rollback' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'add' || tx.type === 'rollback' ? '+' : '-'}{Number(tx.amount)}
                  </td>
                  <td className="py-3 text-[#171717]">{Number(tx.balanceAfter)}</td>
                  <td className="py-3 text-[#525252] truncate max-w-[200px]" title={tx.description || tx.reason || '-'}>
                    {tx.description || tx.reason || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
