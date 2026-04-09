'use client';

import { useState } from 'react';
import { AgentConfigData, PRESET_TEMPLATES, PresetTemplateKey } from '@/lib/types/task';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

const DIMENSIONS = ['参与度', '发言质量', '任务完成', '团队协作', '创新思维'] as const;

interface AIConfigPanelProps {
  config: AgentConfigData;
  onChange: (config: AgentConfigData) => void;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}

export function AIConfigPanel({ config, onChange, expanded, onExpandedChange }: AIConfigPanelProps) {
  const applyPreset = (key: PresetTemplateKey) => {
    const preset = PRESET_TEMPLATES[key];
    onChange({
      ...config,
      evaluatorName: preset.evaluatorName,
      promptTemplate: preset.promptTemplate,
      dimensions: [...preset.dimensions],
      presetTemplate: key,
    });
  };

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => onExpandedChange?.(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-500" />
          <span className="text-sm font-medium">AI 评价配置</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {expanded ? '点击收起' : '点击展开'}
        </span>
      </button>

      {expanded && (
        <div className="p-4 space-y-4 bg-white dark:bg-slate-900">
          {/* Preset Templates */}
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">预设模板</label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(PRESET_TEMPLATES) as PresetTemplateKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => applyPreset(key)}
                  className={cn(
                    'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                    config.presetTemplate === key
                      ? 'bg-indigo-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  )}
                >
                  {PRESET_TEMPLATES[key].name}
                </button>
              ))}
            </div>
          </div>

          {/* Evaluator Name */}
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">评价者名称</label>
            <input
              type="text"
              value={config.evaluatorName}
              onChange={(e) => onChange({ ...config, evaluatorName: e.target.value })}
              className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="输入评价者名称"
            />
          </div>

          {/* Prompt Template */}
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">提示词模板</label>
            <textarea
              value={config.promptTemplate}
              onChange={(e) => onChange({ ...config, promptTemplate: e.target.value })}
              rows={3}
              className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="输入 AI 评价提示词..."
            />
          </div>

          {/* Dimensions */}
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">评价维度</label>
            <div className="flex flex-wrap gap-2">
              {DIMENSIONS.map((dim) => (
                <label
                  key={dim}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs cursor-pointer transition-colors',
                    (config.dimensions || []).includes(dim)
                      ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  )}
                >
                  <input
                    type="checkbox"
                    checked={(config.dimensions || []).includes(dim)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onChange({ ...config, dimensions: [...(config.dimensions || []), dim] });
                      } else {
                        onChange({ ...config, dimensions: (config.dimensions || []).filter((d: string) => d !== dim) });
                      }
                    }}
                    className="sr-only"
                  />
                  {dim}
                </label>
              ))}
            </div>
          </div>

          {/* Coaching Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">启用辅导反馈</div>
              <div className="text-xs text-muted-foreground">AI 在评价后提供改进建议</div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={config.coachingEnabled}
              onClick={() => onChange({ ...config, coachingEnabled: !config.coachingEnabled })}
              className={cn(
                'relative w-11 h-6 rounded-full transition-colors',
                config.coachingEnabled ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform',
                  config.coachingEnabled && 'translate-x-5'
                )}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
