'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import Navbar from '@/components/Navbar'

const PACKAGES = [
  { id: 'basic', name: '基础版', points: 10000, price: 9.9, desc: '适合体验和偶尔使用' },
  { id: 'pro', name: '专业版', points: 50000, price: 39.9, desc: '最受欢迎，高性价比', recommended: true },
  { id: 'max', name: '尊享版', points: 200000, price: 129.9, desc: '适合重度创作者' },
]

export default function PricingPage() {
  const router = useRouter()
  const [selectedPackage, setSelectedPackage] = useState<typeof PACKAGES[0] | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleMockPay = async () => {
    if (!selectedPackage) return
    setIsProcessing(true)
    
    try {
      const res = await fetch('/api/billing/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: selectedPackage.id,
          amount: selectedPackage.points,
          price: selectedPackage.price
        })
      })
      
      if (res.ok) {
        alert('🎉 支付成功！积分已入账。')
        setSelectedPackage(null)
        // Refresh balance in Navbar via router or let SWR handle it
        router.refresh()
      } else {
        alert('支付失败，请重试')
      }
    } catch (err) {
      alert('支付遇到网络错误')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <Navbar />
      
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-[#171717] mb-4">选择适合您的算力套餐</h1>
          <p className="text-lg text-[#525252]">购买积分，解锁更强大的 AI 创作能力。100% 透明扣费，用多少扣多少。</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PACKAGES.map((pkg) => (
            <div 
              key={pkg.id} 
              className={`relative bg-white rounded-2xl p-8 border-2 transition-all ${
                pkg.recommended 
                  ? 'border-[#171717] shadow-xl scale-105 z-10' 
                  : 'border-[#e5e5e5] hover:border-[#a3a3a3]'
              }`}
            >
              {pkg.recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#171717] text-white px-4 py-1 rounded-full text-sm font-semibold">
                  最受欢迎
                </div>
              )}
              
              <h3 className="text-2xl font-bold text-[#171717] mb-2">{pkg.name}</h3>
              <p className="text-[#525252] text-sm mb-6 h-10">{pkg.desc}</p>
              
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-[#171717]">¥{pkg.price}</span>
              </div>
              
              <div className="bg-[#f8f9fa] rounded-xl p-4 mb-8 text-center border border-[#e5e5e5]">
                <div className="text-xl font-bold text-[#171717] mb-1">
                  <span className="text-yellow-500 mr-2">🪙</span>
                  {new Intl.NumberFormat('en-US').format(pkg.points)} 积分
                </div>
              </div>

              <button
                onClick={() => setSelectedPackage(pkg)}
                className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                  pkg.recommended
                    ? 'bg-[#171717] text-white hover:bg-[#262626]'
                    : 'bg-[#f5f5f5] text-[#171717] hover:bg-[#e5e5e5]'
                }`}
              >
                立即购买
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Mock Payment Modal */}
      {selectedPackage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl relative">
            <button 
              onClick={() => !isProcessing && setSelectedPackage(null)}
              className="absolute top-4 right-4 text-[#a3a3a3] hover:text-[#171717]"
            >
              ✕
            </button>
            
            <div className="text-center">
              <h3 className="text-xl font-bold text-[#171717] mb-2">微信/支付宝 扫码支付</h3>
              <p className="text-[#525252] text-sm mb-6">您正在购买：{selectedPackage.name}</p>
              
              <div className="bg-[#f5f5f5] w-48 h-48 mx-auto rounded-xl flex items-center justify-center border-2 border-dashed border-[#d4d4d4] mb-6">
                <div className="text-center text-[#a3a3a3]">
                  <span className="text-4xl block mb-2">📱</span>
                  模拟收款码
                </div>
              </div>
              
              <div className="text-3xl font-extrabold text-[#171717] mb-8">
                ¥{selectedPackage.price}
              </div>

              <button
                disabled={isProcessing}
                onClick={handleMockPay}
                className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white py-3 rounded-xl font-bold transition-colors disabled:opacity-50"
              >
                {isProcessing ? '正在处理...' : '点击这里：模拟支付成功'}
              </button>
              
              <p className="text-xs text-[#a3a3a3] mt-4">
                (沙盒环境专用，不会真实扣除任何银行卡费用)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
