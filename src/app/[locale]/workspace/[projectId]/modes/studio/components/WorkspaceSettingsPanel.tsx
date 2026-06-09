'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import {
    ART_STYLES,
    VIDEO_RATIOS,
} from '@/lib/constants'
import type {
    CapabilitySelections,
    CapabilityValue,
    ModelCapabilities,
} from '@/lib/model-config-contract'
import { filterNormalVideoModelOptions } from '@/lib/model-capabilities/video-model-options'
import { RatioSelector, StyleSelector } from '@/components/ui/config-modals/config-modal-selectors'
import { ModelCapabilityDropdown } from '@/components/ui/config-modals/ModelCapabilityDropdown'
import { AppIcon } from '@/components/ui/icons'

interface ModelOption {
    value: string
    label: string
    provider?: string
    providerName?: string
    capabilities?: ModelCapabilities
}

interface UserModels {
    llm: ModelOption[]
    image: ModelOption[]
    video: ModelOption[]
    audio: ModelOption[]
}

interface CapabilityFieldDefinition {
    field: string
    options: CapabilityValue[]
    label: string
}

interface WorkspaceSettingsPanelProps {
    availableModels?: Partial<UserModels>
    modelsLoaded?: boolean
    artStyle?: string | null
    analysisModel?: string | null
    characterModel?: string | null
    locationModel?: string | null
    storyboardModel?: string | null
    editModel?: string | null
    videoModel?: string | null
    audioModel?: string | null
    videoRatio?: string | null
    capabilityOverrides?: CapabilitySelections
    ttsRate?: string | null
    onUpdateConfig?: (key: string, value: unknown) => Promise<void>
    globalAssetText?: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return !!value && typeof value === 'object' && !Array.isArray(value)
}

function isCapabilityValue(value: unknown): value is CapabilityValue {
    return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
}

function toFieldLabel(field: string): string {
    return field.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase())
}

function parseBySample(input: string, sample: CapabilityValue): CapabilityValue {
    if (typeof sample === 'number') return Number(input)
    if (typeof sample === 'boolean') return input === 'true'
    return input
}

function extractCapabilityFields(
    capabilities: ModelCapabilities | undefined,
    namespace: 'llm' | 'image' | 'video' | 'audio',
): CapabilityFieldDefinition[] {
    const rawNamespace = capabilities?.[namespace]
    if (!isRecord(rawNamespace)) return []

    return Object.entries(rawNamespace)
        .filter(([key, value]) => key.endsWith('Options') && Array.isArray(value) && value.every(isCapabilityValue) && value.length > 0)
        .map(([key, value]) => {
            const field = key.slice(0, -'Options'.length)
            return {
                field,
                options: value as CapabilityValue[],
                label: toFieldLabel(field),
            }
        })
}

function readCapabilitySelectionForModel(
    overrides: CapabilitySelections | undefined,
    modelKey: string | undefined | null,
): Record<string, CapabilityValue> {
    if (!modelKey || !overrides) return {}
    const raw = overrides[modelKey]
    if (!isRecord(raw)) return {}

    const normalized: Record<string, CapabilityValue> = {}
    for (const [field, value] of Object.entries(raw)) {
        if (isCapabilityValue(value)) {
            normalized[field] = value
        }
    }
    return normalized
}

export default function WorkspaceSettingsPanel({
    availableModels,
    modelsLoaded = false,
    artStyle = 'american-comic',
    analysisModel,
    characterModel,
    locationModel,
    storyboardModel,
    editModel,
    videoModel,
    audioModel,
    videoRatio = '9:16',
    capabilityOverrides,
    onUpdateConfig,
}: WorkspaceSettingsPanelProps) {
    const t = useTranslations('configModal')
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle')
    const userModels = useMemo<UserModels>(() => ({
        llm: Array.isArray(availableModels?.llm) ? availableModels.llm : [],
        image: Array.isArray(availableModels?.image) ? availableModels.image : [],
        video: Array.isArray(availableModels?.video) ? availableModels.video : [],
        audio: Array.isArray(availableModels?.audio) ? availableModels.audio : [],
    }), [availableModels])
    
    const normalVideoModels = useMemo<ModelOption[]>(
        () => filterNormalVideoModelOptions(userModels.video),
        [userModels.video],
    )

    const selectedVideoModelOption = useMemo(
        () => normalVideoModels.find((model) => model.value === videoModel) || null,
        [normalVideoModels, videoModel],
    )
    const selectedAnalysisModelOption = useMemo(
        () => userModels.llm.find((model) => model.value === analysisModel) || null,
        [userModels.llm, analysisModel],
    )
    const selectedAudioModelOption = useMemo(
        () => userModels.audio.find((model) => model.value === audioModel) || null,
        [userModels.audio, audioModel],
    )

    const videoCapabilityFields = useMemo(
        () => extractCapabilityFields(selectedVideoModelOption?.capabilities, 'video'),
        [selectedVideoModelOption],
    )
    const analysisCapabilityFields = useMemo(
        () => extractCapabilityFields(selectedAnalysisModelOption?.capabilities, 'llm'),
        [selectedAnalysisModelOption],
    )
    const audioCapabilityFields = useMemo(
        () => extractCapabilityFields(selectedAudioModelOption?.capabilities, 'audio'),
        [selectedAudioModelOption],
    )
    const selectedCharacterModelOption = useMemo(
        () => userModels.image.find((model) => model.value === characterModel) || null,
        [userModels.image, characterModel],
    )
    const selectedLocationModelOption = useMemo(
        () => userModels.image.find((model) => model.value === locationModel) || null,
        [userModels.image, locationModel],
    )
    const selectedStoryboardModelOption = useMemo(
        () => userModels.image.find((model) => model.value === storyboardModel) || null,
        [userModels.image, storyboardModel],
    )
    const selectedEditModelOption = useMemo(
        () => userModels.image.find((model) => model.value === editModel) || null,
        [userModels.image, editModel],
    )
    const characterCapabilityFields = useMemo(
        () => extractCapabilityFields(selectedCharacterModelOption?.capabilities, 'image'),
        [selectedCharacterModelOption],
    )
    const locationCapabilityFields = useMemo(
        () => extractCapabilityFields(selectedLocationModelOption?.capabilities, 'image'),
        [selectedLocationModelOption],
    )
    const storyboardCapabilityFields = useMemo(
        () => extractCapabilityFields(selectedStoryboardModelOption?.capabilities, 'image'),
        [selectedStoryboardModelOption],
    )
    const editCapabilityFields = useMemo(
        () => extractCapabilityFields(selectedEditModelOption?.capabilities, 'image'),
        [selectedEditModelOption],
    )

    const selectedVideoOverrides = useMemo<Record<string, CapabilityValue>>(() => {
        return readCapabilitySelectionForModel(capabilityOverrides, videoModel)
    }, [capabilityOverrides, videoModel])
    const selectedAnalysisOverrides = useMemo<Record<string, CapabilityValue>>(() => {
        return readCapabilitySelectionForModel(capabilityOverrides, analysisModel)
    }, [capabilityOverrides, analysisModel])
    const selectedAudioOverrides = useMemo<Record<string, CapabilityValue>>(() => {
        return readCapabilitySelectionForModel(capabilityOverrides, audioModel)
    }, [capabilityOverrides, audioModel])
    const selectedCharacterOverrides = useMemo<Record<string, CapabilityValue>>(() => {
        return readCapabilitySelectionForModel(capabilityOverrides, characterModel)
    }, [capabilityOverrides, characterModel])
    const selectedLocationOverrides = useMemo<Record<string, CapabilityValue>>(() => {
        return readCapabilitySelectionForModel(capabilityOverrides, locationModel)
    }, [capabilityOverrides, locationModel])
    const selectedStoryboardOverrides = useMemo<Record<string, CapabilityValue>>(() => {
        return readCapabilitySelectionForModel(capabilityOverrides, storyboardModel)
    }, [capabilityOverrides, storyboardModel])
    const selectedEditOverrides = useMemo<Record<string, CapabilityValue>>(() => {
        return readCapabilitySelectionForModel(capabilityOverrides, editModel)
    }, [capabilityOverrides, editModel])

    const applyCapabilityOverride = (modelKey: string | undefined | null, field: string, value: string, sample: CapabilityValue) => {
        if (!modelKey || !onUpdateConfig) return

        const nextOverrides: CapabilitySelections = {
            ...(capabilityOverrides || {}),
        }
        const currentSelection = isRecord(nextOverrides[modelKey])
            ? { ...(nextOverrides[modelKey] as Record<string, CapabilityValue>) }
            : {}

        if (!value) {
            delete currentSelection[field]
        } else {
            currentSelection[field] = parseBySample(value, sample)
        }

        if (Object.keys(currentSelection).length === 0) {
            delete nextOverrides[modelKey]
        } else {
            nextOverrides[modelKey] = currentSelection
        }

        onUpdateConfig('capabilityOverrides', nextOverrides)
        showSaved()
    }

    const handleModelChange = (
        modelKey: string,
        modelOptions: ModelOption[],
        namespace: 'llm' | 'image' | 'video' | 'audio',
        configKey: string,
    ) => {
        onUpdateConfig?.(configKey, modelKey)
        showSaved()
        if (!onUpdateConfig) return
        
        const newModel = modelOptions.find((m) => m.value === modelKey)
        const capabilityFieldsForModel = extractCapabilityFields(newModel?.capabilities, namespace)
        if (capabilityFieldsForModel.length === 0) return
        const nextOverrides: CapabilitySelections = { ...(capabilityOverrides || {}) }
        const existing = isRecord(nextOverrides[modelKey])
            ? { ...(nextOverrides[modelKey] as Record<string, CapabilityValue>) }
            : {}
        
        let changed = false
        for (const def of capabilityFieldsForModel) {
            if (existing[def.field] === undefined && def.options.length > 0) {
                existing[def.field] = def.options[0]
                changed = true
            }
        }
        if (changed) {
            nextOverrides[modelKey] = existing
            onUpdateConfig('capabilityOverrides', nextOverrides)
        }
    }

    const showSaved = () => {
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2000)
    }

    const handleChange = (configKey: string) => (value: string) => {
        onUpdateConfig?.(configKey, value)
        showSaved()
    }

    return (
        <div className="flex flex-col h-full bg-white p-4 space-y-6">
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[#171717]">{t('visualSettings')}</h3>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-[#737373]">{t('visualStyle')}</label>
                        <StyleSelector
                            value={artStyle || ''}
                            onChange={(value) => handleChange('artStyle')(value)}
                            options={ART_STYLES}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-[#737373]">{t('aspectRatio')}</label>
                        <RatioSelector
                            value={videoRatio || ''}
                            onChange={(value) => handleChange('videoRatio')(value)}
                            options={VIDEO_RATIOS}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[#171717]">{t('modelParams')}</h3>
                {!modelsLoaded && (
                    <div className="text-xs text-[#737373]">{t('loadingModels')}</div>
                )}
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-[#737373]">{t('analysisModel')}</label>
                        <ModelCapabilityDropdown
                            models={userModels.llm}
                            value={analysisModel || ''}
                            onModelChange={(v) => handleChange('analysisModel')(v)}
                            capabilityFields={analysisCapabilityFields}
                            placementMode="downward"
                            capabilityOverrides={selectedAnalysisOverrides}
                            onCapabilityChange={(field, rawValue, sample) => {
                                applyCapabilityOverride(analysisModel, field, rawValue, sample)
                            }}
                            placeholder={t('pleaseSelect')}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-[#737373]">{t('characterModel')}</label>
                        <ModelCapabilityDropdown
                            models={userModels.image}
                            value={characterModel || ''}
                            onModelChange={(v) => handleModelChange(v, userModels.image, 'image', 'characterModel')}
                            capabilityFields={characterCapabilityFields}
                            placementMode="downward"
                            capabilityOverrides={selectedCharacterOverrides}
                            onCapabilityChange={(field, rawValue, sample) => {
                                applyCapabilityOverride(characterModel, field, rawValue, sample)
                            }}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-[#737373]">{t('locationModel')}</label>
                        <ModelCapabilityDropdown
                            models={userModels.image}
                            value={locationModel || ''}
                            onModelChange={(v) => handleModelChange(v, userModels.image, 'image', 'locationModel')}
                            capabilityFields={locationCapabilityFields}
                            placementMode="downward"
                            capabilityOverrides={selectedLocationOverrides}
                            onCapabilityChange={(field, rawValue, sample) => {
                                applyCapabilityOverride(locationModel, field, rawValue, sample)
                            }}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-[#737373]">{t('storyboardModel')}</label>
                        <ModelCapabilityDropdown
                            models={userModels.image}
                            value={storyboardModel || ''}
                            onModelChange={(v) => handleModelChange(v, userModels.image, 'image', 'storyboardModel')}
                            capabilityFields={storyboardCapabilityFields}
                            placementMode="downward"
                            capabilityOverrides={selectedStoryboardOverrides}
                            onCapabilityChange={(field, rawValue, sample) => {
                                applyCapabilityOverride(storyboardModel, field, rawValue, sample)
                            }}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-[#737373]">{t('editModel')}</label>
                        <ModelCapabilityDropdown
                            models={userModels.image}
                            value={editModel || ''}
                            onModelChange={(v) => handleModelChange(v, userModels.image, 'image', 'editModel')}
                            capabilityFields={editCapabilityFields}
                            placementMode="downward"
                            capabilityOverrides={selectedEditOverrides}
                            onCapabilityChange={(field, rawValue, sample) => {
                                applyCapabilityOverride(editModel, field, rawValue, sample)
                            }}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-[#737373]">{t('videoModel')}</label>
                        <ModelCapabilityDropdown
                            models={normalVideoModels}
                            value={videoModel || ''}
                            onModelChange={(v) => handleModelChange(v, normalVideoModels, 'video', 'videoModel')}
                            capabilityFields={videoCapabilityFields}
                            placementMode="downward"
                            capabilityOverrides={selectedVideoOverrides}
                            onCapabilityChange={(field, rawValue, sample) => {
                                applyCapabilityOverride(videoModel, field, rawValue, sample)
                            }}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-[#737373]">{t('audioModel')}</label>
                        <ModelCapabilityDropdown
                            models={userModels.audio}
                            value={audioModel || ''}
                            onModelChange={(v) => handleModelChange(v, userModels.audio, 'audio', 'audioModel')}
                            capabilityFields={audioCapabilityFields}
                            placementMode="downward"
                            capabilityOverrides={selectedAudioOverrides}
                            onCapabilityChange={(field, rawValue, sample) => {
                                applyCapabilityOverride(audioModel, field, rawValue, sample)
                            }}
                            placeholder={t('pleaseSelect')}
                        />
                    </div>
                </div>
            </div>
            
            <div className="pb-8 flex items-center justify-between text-xs text-[#737373]">
                {saveStatus === 'saved' ? (
                    <span className="text-emerald-600 flex items-center gap-1"><AppIcon name="check" className="w-3 h-3" /> {t('saved')}</span>
                ) : (
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> {t('autoSave')}</span>
                )}
            </div>
        </div>
    )
}
