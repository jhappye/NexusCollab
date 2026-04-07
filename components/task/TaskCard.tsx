import Link from 'next/link';
import { TaskStatusBadge } from './TaskStatusBadge';
import { MessageSquare } from 'lucide-react';

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string;
    status: string;
    updatedAt: Date;
    _count?: { evaluations: number };
  };
  workspaceId: string;
}

export function TaskCard({ task, workspaceId }: TaskCardProps) {
  return (
    <Link
      href={`/workspace/${workspaceId}/task/${task.id}`}
      className="group block rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:bg-slate-800/60 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <TaskStatusBadge status={task.status as 'DRAFT' | 'ACTIVE' | 'REVIEWING' | 'COMPLETED'} />
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
      </div>
      <p className="text-[10px] text-muted-foreground mt-2">
        Updated {new Date(task.updatedAt).toLocaleDateString()}
      </p>
    </Link>
  );
}
