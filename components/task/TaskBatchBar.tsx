'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TaskStatus, TASK_STATUS_LABELS } from '@/lib/types/task';
import { X, Trash2, Play } from 'lucide-react';

interface TaskBatchBarProps {
  selectedCount: number;
  onClear: () => void;
  onBatchDelete: () => void;
  onBatchStatusChange: (status: TaskStatus) => void;
  currentTaskStatuses?: Record<string, TaskStatus>;
  canManage: boolean;
}

export function TaskBatchBar({
  selectedCount,
  onClear,
  onBatchDelete,
  onBatchStatusChange,
  currentTaskStatuses = {},
  canManage,
}: TaskBatchBarProps) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  if (selectedCount === 0) return null;

  const possibleNextStatuses: TaskStatus[] = [];
  const selectedStatuses = new Set(Object.values(currentTaskStatuses));

  for (const status of selectedStatuses) {
    const next = {
      DRAFT: 'ACTIVE' as TaskStatus,
      ACTIVE: 'REVIEWING' as TaskStatus,
      REVIEWING: 'COMPLETED' as TaskStatus,
      COMPLETED: null as TaskStatus | null,
    }[status];
    if (next && !possibleNextStatuses.includes(next)) {
      possibleNextStatuses.push(next);
    }
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
        已选择 {selectedCount} 个任务
      </span>

      {canManage && possibleNextStatuses.length > 0 && (
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowStatusMenu(!showStatusMenu)}
          >
            <Play className="h-3 w-3 mr-1" />
            批量更新状态
          </Button>

          {showStatusMenu && (
            <div className="absolute bottom-full mb-2 left-0 w-36 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg py-1">
              {possibleNextStatuses.map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    onBatchStatusChange(status);
                    setShowStatusMenu(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  {TASK_STATUS_LABELS[status]}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {canManage && (
        <Button variant="outline" size="sm" onClick={onBatchDelete} className="text-red-500 hover:text-red-600">
          <Trash2 className="h-3 w-3 mr-1" />
          删除所选
        </Button>
      )}

      <button
        onClick={onClear}
        className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
      >
        <X className="h-4 w-4 text-muted-foreground" />
      </button>
    </div>
  );
}
