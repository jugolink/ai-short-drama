'use client'

import { useState } from 'react'
import WorkspaceSidebar from './WorkspaceSidebar'
import AssetsStage from './AssetsStage'
import { AppIcon } from '@/components/ui/icons'

interface WorkspaceLeftPanelProps {
  // Sidebar props
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  episodes: any[]
  currentEpisodeId: string | null
  onEpisodeSelect: (id: string) => void
  onEpisodeCreate?: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stages: any[]
  currentStage: string
  onStageChange: (stage: string) => void
  projectName?: string
  
  // Assets props
  projectId: string
  isAnalyzingAssets: boolean
  focusCharacterId: string | null
  focusCharacterRequestId: number
  triggerGlobalAnalyze: boolean
  onGlobalAnalyzeComplete: () => void
}

export default function WorkspaceLeftPanel(props: WorkspaceLeftPanelProps) {
  const [activeTab, setActiveTab] = useState<'nav' | 'assets'>('nav')

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Tabs */}
      <div className="flex border-b border-[#e5e5e5] flex-shrink-0">
        <button
          onClick={() => setActiveTab('nav')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'nav' 
              ? 'text-[#171717] border-b-2 border-[#171717]' 
              : 'text-[#737373] hover:text-[#171717]'
          }`}
        >
          <AppIcon name="fileText" className="w-4 h-4" />
          导航
        </button>
        <button
          onClick={() => setActiveTab('assets')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'assets' 
              ? 'text-[#171717] border-b-2 border-[#171717]' 
              : 'text-[#737373] hover:text-[#171717]'
          }`}
        >
          <AppIcon name="package" className="w-4 h-4" />
          资产库
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className={activeTab === 'nav' ? 'block h-full' : 'hidden'}>
          <WorkspaceSidebar
            episodes={props.episodes}
            currentEpisodeId={props.currentEpisodeId}
            onEpisodeSelect={props.onEpisodeSelect}
            onEpisodeCreate={props.onEpisodeCreate}
            stages={props.stages}
            currentStage={props.currentStage}
            onStageChange={props.onStageChange}
            projectName={props.projectName}
          />
        </div>
        <div className={activeTab === 'assets' ? 'block h-full p-4' : 'hidden'}>
          <AssetsStage
            projectId={props.projectId}
            isAnalyzingAssets={props.isAnalyzingAssets}
            focusCharacterId={props.focusCharacterId}
            focusCharacterRequestId={props.focusCharacterRequestId}
            triggerGlobalAnalyze={props.triggerGlobalAnalyze}
            onGlobalAnalyzeComplete={props.onGlobalAnalyzeComplete}
          />
        </div>
      </div>
    </div>
  )
}
