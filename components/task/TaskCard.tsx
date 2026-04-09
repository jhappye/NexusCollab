'use client';

import Link from 'next/link';
import { TaskStatusBadge } from './TaskStatusBadge';
import { TaskMenuButton } from './TaskMenuButton';
import { MessageSquare, Pencil, Trash2 } from 'lucide-react';
import { Task, TaskStatus } from '@/lib/types/task';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  workspaceId: string;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export function TaskCard({ task, workspaceId, onEdit, onDelete }: TaskCardProps) {
  const menuItems = [];
  if (onEdit) {
    menuItems.push({ label: '编辑', icon: <Pencil className="h-4 w-4" />, onClick: () => onEdit(task) });
  }
  if (onDelete) {
    menuItems.push({ label: '删除', icon: <Trash2 className="h-4 w-4" />, onClick: () => onDelete(task.id), variant: 'danger' as const });
  }

  return (
    <Link
      href={`/workspace/${workspaceId}/task/${task.id}`}
      className={cn(
        'group block rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:bg-slate-800/60 transition-colors',
        onEdit || onDelete ? 'pl-9' : 'pl-4'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <TaskStatusBadge status={task.status} />
            {task.status === 'ACTIVE' && (
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <MessageSquare className="h-3 w-3" />
                {task._count?.evaluations ?? 0} evals
              </span>
            )}
          </div>
          <h3 className="text-sm font-medium text-slate-200 group-hover:text-white truncate">
            {task.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{task.description}</p>
        </div>
        {menuItems.length > 0 && (
          <TaskMenuButton
            items={menuItems}
            onOpenChat={() => {
              window.location.href = `/workspace/${workspaceId}/task/${task.id}/room`;
            }}
          />
        )}
      </div>
      <p className="text-[10px] text-muted-foreground mt-2">
        更新于 {new Date(task.updatedAt).toLocaleDateString('zh-CN')}
      </p>
    </Link>
  );
}
