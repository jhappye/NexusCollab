import { cn } from '@/lib/utils';

type TaskStatus = 'DRAFT' | 'ACTIVE' | 'REVIEWING' | 'COMPLETED';

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
  DRAFT: { label: 'Draft', className: 'bg-slate-500/20 text-slate-400' },
  ACTIVE: { label: 'Active', className: 'bg-indigo-500/20 text-indigo-400' },
  REVIEWING: { label: 'Reviewing', className: 'bg-amber-500/20 text-amber-400' },
  COMPLETED: { label: 'Completed', className: 'bg-emerald-500/20 text-emerald-400' },
};

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const config = statusConfig[status] ?? statusConfig.DRAFT;
  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', config.className)}>
      {config.label}
    </span>
  );
}
