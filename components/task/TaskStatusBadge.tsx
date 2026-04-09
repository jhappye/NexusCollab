import { cn } from '@/lib/utils';
import type { TaskStatus } from '@/lib/types/task';
import { TASK_STATUS_LABELS, TASK_STATUS_COLORS } from '@/lib/types/task';

interface TaskStatusBadgeProps {
  status: TaskStatus;
  onClick?: () => void;
  className?: string;
}

export function TaskStatusBadge({ status, onClick, className }: TaskStatusBadgeProps) {
  const colors = TASK_STATUS_COLORS[status];
  const label = TASK_STATUS_LABELS[status];

  const Component = onClick ? 'button' : 'span';

  return (
    <Component
      onClick={onClick}
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium transition-colors',
        colors.bg,
        colors.text,
        onClick && 'cursor-pointer hover:opacity-80',
        className
      )}
    >
      {label}
    </Component>
  );
}
