import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WorkspaceHeaderProps {
  workspace: {
    name: string;
    _count?: { tasks: number; members: number };
  };
  onNewTask: () => void;
}

export function WorkspaceHeader({ workspace, onNewTask }: WorkspaceHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
      <div>
        <h1 className="text-xl font-semibold text-foreground">{workspace.name}</h1>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs text-muted-foreground">
            {workspace._count?.tasks ?? 0} 个任务
          </span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">
            {workspace._count?.members ?? 0} 位成员
          </span>
        </div>
      </div>
      <Button onClick={onNewTask}>
        <Plus className="h-4 w-4 mr-1" />
        新建任务
      </Button>
    </div>
  );
}
