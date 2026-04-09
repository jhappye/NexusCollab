'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { AIConfigPanel } from './AIConfigPanel';
import { TaskFormData, AgentConfigData, TaskStatus } from '@/lib/types/task';
import { cn } from '@/lib/utils';

const DEFAULT_AGENT_CONFIG: AgentConfigData = {
  evaluatorName: '评估助手',
  promptTemplate: '你是一名专业的评估助手。请根据学生的参与度、发言质量、任务完成情况来评估他们的表现。',
  dimensions: ['参与度', '发言质量', '任务完成'],
  coachingEnabled: true,
};

const DEFAULT_FORM_DATA: TaskFormData = {
  title: '',
  description: '',
  status: 'DRAFT',
  dueAt: null,
  agentConfig: DEFAULT_AGENT_CONFIG,
};

interface TaskEditModalProps {
  workspaceId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (taskId: string) => void;
  onUpdated?: () => void;
  task?: {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    dueAt: string | null;
    agentConfig: AgentConfigData;
  };
}

export function TaskEditModal({
  workspaceId,
  open,
  onOpenChange,
  onCreated,
  onUpdated,
  task,
}: TaskEditModalProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiExpanded, setAiExpanded] = useState(false);
  const [formData, setFormData] = useState<TaskFormData>(DEFAULT_FORM_DATA);

  const isEditMode = !!task;

  useEffect(() => {
    if (open) {
      if (task) {
        setFormData({
          title: task.title,
          description: task.description,
          status: task.status,
          dueAt: task.dueAt,
          agentConfig: task.agentConfig,
        });
      } else {
        setFormData(DEFAULT_FORM_DATA);
      }
      setPrompt('');
      setError('');
    }
  }, [open, task]);

  const handleSubmit = async () => {
    if (!formData.title.trim() && !prompt.trim()) {
      setError('请输入任务标题或描述');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isEditMode) {
        const res = await fetch(`/api/task/${task.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            status: formData.status,
            dueAt: formData.dueAt,
            agentConfig: formData.agentConfig,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || '更新失败');
        }

        onUpdated?.();
        onOpenChange(false);
      } else {
        // For creation, send everything to API which handles AI generation
        const res = await fetch(`/api/workspaces/${workspaceId}/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: prompt || formData.description,
            title: formData.title,
            description: formData.description,
            agentConfig: formData.agentConfig,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || '创建任务失败');
        }

        onCreated?.(data.task.id);
        onOpenChange(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '出错了，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {isEditMode ? '编辑任务' : '创建新任务'}
          </h2>
          <button
            onClick={() => onOpenChange(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* AI Prompt Section */}
          {!isEditMode && (
            <div className="rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 p-4 border border-indigo-100 dark:border-indigo-900/50">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">AI 智能创建</span>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="描述你想要创建的任务，AI 会自动生成标题、描述和评价配置..."
                rows={2}
                className="w-full rounded-lg border border-indigo-200 dark:border-indigo-800 bg-white/80 dark:bg-slate-900/80 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
              <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-2">
                提示：输入描述后点击"创建任务"，AI 会自动生成完整信息
              </p>
            </div>
          )}

          {/* Manual Form */}
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">任务标题 *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="输入任务标题"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">任务描述</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="详细描述任务内容..."
                rows={3}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">截止日期</label>
                <input
                  type="date"
                  value={formData.dueAt || ''}
                  onChange={(e) => setFormData({ ...formData, dueAt: e.target.value || null })}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {isEditMode && (
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">状态</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="DRAFT">草稿</option>
                    <option value="ACTIVE">进行中</option>
                    <option value="REVIEWING">待评审</option>
                    <option value="COMPLETED">已完成</option>
                  </select>
                </div>
              )}
            </div>

            <AIConfigPanel
              config={formData.agentConfig}
              onChange={(agentConfig) => setFormData({ ...formData, agentConfig })}
              expanded={aiExpanded}
              onExpandedChange={setAiExpanded}
            />
          </div>

          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-slate-200 dark:border-slate-800 sticky bottom-0 bg-white dark:bg-slate-900">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                处理中...
              </>
            ) : isEditMode ? '保存更改' : '创建任务'}
          </Button>
        </div>
      </div>
    </div>
  );
}
