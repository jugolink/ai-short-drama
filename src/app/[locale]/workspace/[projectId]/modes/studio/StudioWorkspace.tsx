'use client'

import ProgressToast from '@/components/ProgressToast'
import ConfirmDialog from '@/components/ConfirmDialog'
import { useTranslations } from 'next-intl'
import { WorkspaceProvider } from './WorkspaceProvider'
import WorkspaceRunStreamConsoles from './components/WorkspaceRunStreamConsoles'
import WorkspaceStageContent from './components/WorkspaceStageContent'
import WorkspaceAssetLibraryModal from './components/WorkspaceAssetLibraryModal'
import WorkspaceHeaderShell from './components/WorkspaceHeaderShell'
import WorkspaceSidebar from './components/WorkspaceSidebar'
import WorkspaceLeftPanel from './components/WorkspaceLeftPanel'
import WorkspaceSettingsPanel from './components/WorkspaceSettingsPanel'
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from 'react-resizable-panels'
import { WorkspaceStageRuntimeProvider } from './WorkspaceStageRuntimeContext'
import { useStudioWorkspaceController } from './hooks/useStudioWorkspaceController'
import type { StudioWorkspaceProps } from './types'
import type { AppIconName } from '@/components/ui/icons'
import '@/styles/animations.css'

const stageIconMap: Record<string, AppIconName> = {
  config: 'fileText',
  script: 'bookOpen',
  storyboard: 'image',
  videos: 'video',
  voice: 'mic',
  editor: 'film',
}

function StudioWorkspaceContent(props: StudioWorkspaceProps) {
  const vm = useStudioWorkspaceController(props)
  const tProgress = useTranslations('progress')

  const {
    project,
    projectId,
    episodeId,
    episodes = [],
    onEpisodeSelect,
    onEpisodeCreate,
    onEpisodeRename,
    onEpisodeDelete,
  } = props

  const storyToScriptStream = vm.execution.storyToScriptStream
  const scriptToStoryboardStream = vm.execution.scriptToStoryboardStream
  const storyToScriptActive =
    storyToScriptStream.isRunning ||
    storyToScriptStream.isRecoveredRunning ||
    storyToScriptStream.status === 'running'
  const scriptToStoryboardActive =
    scriptToStoryboardStream.isRunning ||
    scriptToStoryboardStream.isRecoveredRunning ||
    scriptToStoryboardStream.status === 'running'

  const showStoryToScriptMinBadge =
    storyToScriptStream.isVisible &&
    storyToScriptStream.stages.length > 0 &&
    storyToScriptActive &&
    vm.execution.storyToScriptConsoleMinimized

  const showScriptToStoryboardMinBadge =
    scriptToStoryboardStream.isVisible &&
    scriptToStoryboardStream.stages.length > 0 &&
    scriptToStoryboardActive &&
    vm.execution.scriptToStoryboardConsoleMinimized

  const runBadges: { id: string; label: string; onClick: () => void }[] = []

  if (showStoryToScriptMinBadge) {
    runBadges.push({
      id: 'story-to-script',
      label: tProgress('runConsole.storyToScriptRunning'),
      onClick: () => vm.execution.setStoryToScriptConsoleMinimized(false),
    })
  }

  if (showScriptToStoryboardMinBadge) {
    runBadges.push({
      id: 'script-to-storyboard',
      label: tProgress('runConsole.scriptToStoryboardRunning'),
      onClick: () => vm.execution.setScriptToStoryboardConsoleMinimized(false),
    })
  }

  if (!vm.project.projectData) {
    return <div className="text-center text-[#525252]">{vm.i18n.tc('loading')}</div>
  }

  const sidebarStages = vm.stageNav.capsuleNavItems
    .filter(item => item.id !== 'editor')
    .map(item => ({
      id: item.id,
      label: item.label,
      icon: stageIconMap[item.id] || 'fileText',
      disabled: item.disabled,
      status: item.status === 'processing' ? 'processing' as const : item.status === 'ready' ? 'ready' as const : 'idle' as const,
    }))

  return (
    <>
    <div className="flex h-full overflow-hidden bg-[#fafafa]">
      <PanelGroup orientation="horizontal">
        {/* Left Panel: Navigation & Asset Library */}
        <Panel defaultSize={20} minSize={15} maxSize={30} className="border-r border-[#e5e5e5] bg-white">
          <WorkspaceLeftPanel
            episodes={episodes}
            currentEpisodeId={episodeId ?? null}
            onEpisodeSelect={onEpisodeSelect ?? (() => {})}
            onEpisodeCreate={onEpisodeCreate}
            stages={sidebarStages}
            currentStage={vm.stageNav.currentStage}
            onStageChange={vm.stageNav.handleStageChange}
            projectName={project.name}
            projectId={projectId}
            isAnalyzingAssets={vm.execution.isAssetAnalysisRunning}
            focusCharacterId={vm.ui.assetLibraryFocusCharacterId}
            focusCharacterRequestId={vm.ui.assetLibraryFocusRequestId}
            triggerGlobalAnalyze={vm.ui.triggerGlobalAnalyzeOnOpen}
            onGlobalAnalyzeComplete={() => vm.ui.setTriggerGlobalAnalyzeOnOpen(false)}
          />
        </Panel>

        <PanelResizeHandle className="w-1 bg-transparent hover:bg-blue-500 cursor-col-resize transition-colors duration-200" />

        {/* Center Panel: Main Stage Content */}
        <Panel defaultSize={vm.ui.isSettingsModalOpen ? 55 : 80} minSize={40} className="relative bg-[#f5f5f5]">
          <main className="h-full overflow-y-auto p-6">
            <WorkspaceStageRuntimeProvider value={vm.runtime.stageRuntime}>
              <WorkspaceStageContent currentStage={vm.stageNav.currentStage} />
            </WorkspaceStageRuntimeProvider>
          </main>
        </Panel>

        {/* Right Panel: Settings / Properties */}
        {vm.ui.isSettingsModalOpen && (
          <>
            <PanelResizeHandle className="w-1 bg-transparent hover:bg-blue-500 cursor-col-resize transition-colors duration-200 border-l border-[#e5e5e5]" />
            <Panel defaultSize={25} minSize={20} maxSize={40} className="bg-white">
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-[#e5e5e5] flex justify-between items-center bg-white shrink-0">
                  <h3 className="font-bold text-[#171717]">属性与模型配置</h3>
                  <button 
                    onClick={() => vm.ui.setIsSettingsModalOpen(false)}
                    className="text-[#737373] hover:text-[#171717] p-1 rounded hover:bg-[#f5f5f5]"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <WorkspaceSettingsPanel
                    availableModels={vm.ui.userModelsForSettings || undefined}
                    modelsLoaded={vm.ui.userModelsLoaded}
                    artStyle={vm.project.artStyle}
                    analysisModel={vm.project.analysisModel}
                    characterModel={vm.project.characterModel}
                    locationModel={vm.project.locationModel}
                    storyboardModel={vm.project.storyboardModel}
                    editModel={vm.project.editModel}
                    videoModel={vm.project.videoModel}
                    audioModel={vm.project.audioModel}
                    capabilityOverrides={vm.project.capabilityOverrides}
                    videoRatio={vm.project.videoRatio}
                    ttsRate={vm.project.ttsRate !== undefined && vm.project.ttsRate !== null ? String(vm.project.ttsRate) : undefined}
                    onUpdateConfig={vm.actions.handleUpdateConfig}
                    globalAssetText={vm.project.globalAssetText}
                  />
                </div>
              </div>
            </Panel>
          </>
        )}
      </PanelGroup>
    </div>

    {/* Modals — outside flex layout */}
    <WorkspaceHeaderShell
        isSettingsModalOpen={false} // Managed by Right Panel now
        isWorldContextModalOpen={vm.ui.isWorldContextModalOpen}
        onCloseSettingsModal={() => vm.ui.setIsSettingsModalOpen(false)}
        onCloseWorldContextModal={() => vm.ui.setIsWorldContextModalOpen(false)}
        availableModels={vm.ui.userModelsForSettings || undefined}
        modelsLoaded={vm.ui.userModelsLoaded}
        artStyle={vm.project.artStyle}
        analysisModel={vm.project.analysisModel}
        characterModel={vm.project.characterModel}
        locationModel={vm.project.locationModel}
        storyboardModel={vm.project.storyboardModel}
        editModel={vm.project.editModel}
        videoModel={vm.project.videoModel}
        audioModel={vm.project.audioModel}
        capabilityOverrides={vm.project.capabilityOverrides}
        videoRatio={vm.project.videoRatio}
        ttsRate={vm.project.ttsRate !== undefined && vm.project.ttsRate !== null ? String(vm.project.ttsRate) : undefined}
        onUpdateConfig={vm.actions.handleUpdateConfig}
        globalAssetText={vm.project.globalAssetText}
      />

      {vm.execution.showCreatingToast && (
        <ProgressToast
          show
          message={vm.i18n.t('storyInput.creating')}
          step={vm.execution.transitionProgress.step || ''}
          runBadges={runBadges}
        />
      )}

      <ConfirmDialog
        show={vm.rebuild.showRebuildConfirm}
        type="warning"
        title={vm.rebuild.rebuildConfirmTitle}
        message={vm.rebuild.rebuildConfirmMessage}
        confirmText={vm.i18n.t('rebuildConfirm.confirm')}
        cancelText={vm.i18n.t('rebuildConfirm.cancel')}
        onConfirm={vm.rebuild.handleAcceptRebuildConfirm}
        onCancel={vm.rebuild.handleCancelRebuildConfirm}
      />

      <WorkspaceRunStreamConsoles
        storyToScriptStream={vm.execution.storyToScriptStream}
        scriptToStoryboardStream={vm.execution.scriptToStoryboardStream}
        storyToScriptConsoleMinimized={vm.execution.storyToScriptConsoleMinimized}
        scriptToStoryboardConsoleMinimized={vm.execution.scriptToStoryboardConsoleMinimized}
        onStoryToScriptMinimizedChange={vm.execution.setStoryToScriptConsoleMinimized}
        onScriptToStoryboardMinimizedChange={vm.execution.setScriptToStoryboardConsoleMinimized}
        hideMinimizedBadges={vm.execution.showCreatingToast}
      />
    </>
  )
}

export default function StudioWorkspace(props: StudioWorkspaceProps) {
  const { projectId, episodeId } = props
  return (
    <WorkspaceProvider projectId={projectId} episodeId={episodeId}>
      <StudioWorkspaceContent {...props} />
    </WorkspaceProvider>
  )
}
