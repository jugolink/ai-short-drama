'use client'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import Navbar from '@/components/Navbar'
import AppSidebar from '@/components/AppSidebar'
import { useState } from 'react'
import { ProfileSidebar } from './components/ProfileSidebar'
import { OverviewTab } from './components/OverviewTab'
import { PricingTab } from './components/PricingTab'
import { TokensTab } from './components/TokensTab'
import { UsageLogsTab } from './components/UsageLogsTab'
import { useRouter } from '@/i18n/navigation'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const tc = useTranslations('common')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (status === 'loading') return
    if (!session) { router.push({ pathname: '/auth/signin' }); return }
  }, [router, session, status])

  if (status === 'loading' || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="text-[#525252]">{tc('loading')}</div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />
      case 'topup':
      case 'pricing':
        return <PricingTab />
      case 'tokens':
        return <TokensTab />
      case 'logs':
        return <UsageLogsTab />
      default:
        return null
    }
  }

  return (
    <div className="h-screen flex flex-col bg-[#fafafa] overflow-hidden">
      <Navbar />
      <div className="flex flex-1 min-h-0">
        {/* Main Content Area: Centered max-width with 2 columns */}
        <div className="w-full max-w-7xl mx-auto px-6 py-8 flex gap-8 h-full min-h-0">
          <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <main className="flex-1 overflow-y-auto pb-12">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  )
}
