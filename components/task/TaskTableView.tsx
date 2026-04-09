'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TaskStatusBadge } from './TaskStatusBadge';
import { TaskStatusDropdown } from './TaskStatusDropdown';
import { TaskMenuButton } from './TaskMenuButton';
import { Task, TaskStatus } from '@/lib/types/task';
import { cn } from '@/lib/utils';
import { Pencil, Trash2 } from 'lucide-react';

interface TaskTableViewProps {
  tasks: Task[];
  workspaceId: string;
  onTaskSelect: (taskId: string, selected: boolean) => void;
  selectedTaskIds: Set<string>;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  canManage: boolean;
}

export function TaskTableView({
  tasks,
  workspaceId,
  onTaskSelect,
  selectedTaskIds,
  onStatusChange,
  onDelete,
  onEdit,
  canManage,
}: TaskTableViewProps) {
  const [sortField, setSortField] = useState<'title' | 'status' | 'updatedAt'>('updatedAt');
  const [sortAsc, setSortAsc] = useState(false);

  const sortedTasks = [...tasks].sort((a, b) => {
    let cmp = 0;
    switch (sortField) {
      case 'title':
        cmp = a.title.localeCompare(b.title);
        break;
      case 'status':
        cmp = a.status.localeCompare(b.status);
        break;
      case 'updatedAt':
        cmp = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;
    }
    return sortAsc ? cmp : -cmp;
  });

  const handleSort = (field: 'title' | 'status' | 'updatedAt') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const SortIcon = ({ field }: { field: 'title' | 'status' | 'updatedAt' }) => (
    <span className={cn('ml-1 text-xs', sortField === field ? 'text-indigo-500' : 'text-muted-foreground')}>
      {sortField === field ? (sortAsc ? '↑' : '↓') : '↕'}
    </span>
  );

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800/50">
          <tr>
            <th className="w-10 px-3 py-3">
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    tasks.forEach((t) => onTaskSelect(t.id, true));
                  } else {
                    tasks.forEach((t) => onTaskSelect(t.id, false));
                  }
                }}
                checked={tasks.length > 0 && tasks.every((t) => selectedTaskIds.has(t.id))}
                className="rounded border-slate-300 dark:border-slate-600"
              />
            </th>
            <th
              className="px-3 py-3 text-left font-medium cursor-pointer hover:text-indigo-500"
              onClick={() => handleSort('title')}
            >
              标题 <SortIcon field="title" />
            </th>
            <th
              className="px-3 py-3 text-left font-medium cursor-pointer hover:text-indigo-500"
              onClick={() => handleSort('status')}
            >
              状态 <SortIcon field="status" />
            </th>
            <th className="px-3 py-3 text-left font-medium">描述</th>
            <th
              className="px-3 py-3 text-left font-medium cursor-pointer hover:text-indigo-500"
              onClick={() => handleSort('updatedAt')}
            >
              更新时间 <SortIcon field="updatedAt" />
            </th>
            <th className="px-3 py-3 w-12"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {sortedTasks.map((task) => (
            <tr
              key={task.id}
              className={cn(
                'hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors',
                selectedTaskIds.has(task.id) && 'bg-indigo-50/50 dark:bg-indigo-950/20'
              )}
            >
              <td className="px-3 py-3">
                <input
                  type="checkbox"
                  checked={selectedTaskIds.has(task.id)}
                  onChange={(e) => onTaskSelect(task.id, e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-600"
                />
              </td>
              <td className="px-3 py-3">
                <Link
                  href={`/workspace/${workspaceId}/task/${task.id}`}
                  className="font-medium text-slate-800 dark:text-slate-200 hover:text-indigo-500"
                >
                  {task.title}
                </Link>
              </td>
              <td className="px-3 py-3">
                {canManage ? (
                  <TaskStatusDropdown
                    status={task.status}
                    onStatusChange={(status) => onStatusChange(task.id, status)}
                  />
                ) : (
                  <TaskStatusBadge status={task.status} />
                )}
              </td>
              <td className="px-3 py-3 text-muted-foreground truncate max-w-xs">
                {task.description}
              </td>
              <td className="px-3 py-3 text-muted-foreground text-xs">
                {new Date(task.updatedAt).toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' })}
              </td>
              <td className="px-3 py-3">
                <TaskMenuButton
                  items={[
                    ...(canManage
                      ? [
                          { label: '编辑', icon: <Pencil className="h-4 w-4" />, onClick: () => onEdit(task) },
                          { label: '删除', icon: <Trash2 className="h-4 w-4" />, onClick: () => onDelete(task.id), variant: 'danger' as const },
                        ]
                      : []),
                  ]}
                  onOpenChat={() => {
                    window.location.href = `/workspace/${workspaceId}/task/${task.id}/room`;
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
