'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

interface NewTaskModalProps {
  workspaceId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (taskId: string) => void;
}

export function NewTaskModal({ workspaceId, open, onOpenChange, onCreated }: NewTaskModalProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/workspaces/${workspaceId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? '创建任务失败');
        return;
      }

      setPrompt('');
      onCreated(data.task.id);
      onOpenChange(false);
    } catch {
      setError('出错了，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">创建新任务</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            描述你想要创建的任务，AI 会自动生成标题、描述，并分配评估智能体。
          </p>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="例如：为新同学创建一个Q2销售培训任务..."
            rows={4}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-800 dark:text-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-slate-200 dark:border-slate-800">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleCreate} disabled={loading || !prompt.trim()}>
            {loading ? '创建中...' : '创建任务'}
          </Button>
        </div>
      </div>
    </div>
  );
}
