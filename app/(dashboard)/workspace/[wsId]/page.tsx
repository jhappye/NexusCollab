'use client';

import { use, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { WorkspaceHeader } from '@/components/workspace/WorkspaceHeader';
import { TaskCard } from '@/components/task/TaskCard';
import { NewTaskModal } from '@/components/task/NewTaskModal';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface Workspace {
  id: string;
  name: string;
  onboardingComplete?: boolean;
  _count?: { tasks: number; members: number };
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  updatedAt: Date;
  _count?: { evaluations: number };
}

export default function WorkspacePage({ params }: { params: Promise<{ wsId: string }> }) {
  const { wsId } = use(params);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [wsRes, tasksRes] = await Promise.all([
          fetch(`/api/workspace/${wsId}`),
          fetch(`/api/workspaces/${wsId}/tasks`),
        ]);

        if (wsRes.ok && tasksRes.ok) {
          const wsText = await wsRes.text();
          const tasksText = await tasksRes.text();

          let wsData: { workspace: Workspace | null } = { workspace: null };
          let tasksData: { tasks: Task[] } = { tasks: [] };

          try {
            const parsed = JSON.parse(wsText);
            wsData = { workspace: parsed.workspace || null };
          } catch {
            // ignore parse error
          }

          try {
            const parsed = JSON.parse(tasksText);
            tasksData = { tasks: parsed.tasks || [] };
          } catch {
            // ignore parse error
          }

          setWorkspace(wsData.workspace);
          setTasks(tasksData.tasks);
        } else {
          // API failed, use mock data for development
          setWorkspace({
            id: wsId,
            name: '新班级',
            onboardingComplete: true,
            _count: { tasks: 0, members: 1 },
          });
          setTasks([]);
        }
      } catch {
        // Network error, use mock data
        setWorkspace({
          id: wsId,
          name: '新班级',
          onboardingComplete: true,
          _count: { tasks: 0, members: 1 },
        });
        setTasks([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [wsId]);

  const handleTaskCreated = async (taskId: string) => {
    try {
      const res = await fetch(`/api/workspaces/${wsId}/tasks`);
      const data = await res.json();
      if (res.ok) {
        setTasks(data.tasks);
      }
    } catch {
      // silently fail on refresh
    }
  };

  const filteredTasks = statusFilter ? tasks.filter(t => t.status === statusFilter) : tasks;

  if (loading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-4 w-32" />
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <WorkspaceHeader
        workspace={workspace ?? { name: 'Loading...', _count: { tasks: 0, members: 0 } }}
        onNewTask={() => setNewTaskOpen(true)}
      />

      <div className="p-6">
        {/* Mobile filter bar */}
        <div className="flex md:hidden items-center justify-between px-4 py-2">
          <span className="text-xs text-slate-500">{tasks.length} 个任务</span>
          <Button variant="outline" size="sm" onClick={() => setFilterOpen(true)}>
            筛选
          </Button>
        </div>

        <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
          <SheetContent side="bottom">
            <div className="p-4 space-y-3">
              <h3 className="text-sm font-semibold">按状态筛选</h3>
              {['DRAFT', 'ACTIVE', 'REVIEWING', 'COMPLETED'].map((status) => (
                <label key={status} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={statusFilter === status}
                    onChange={(e) => setStatusFilter(e.target.checked ? status : null)}
                  />
                  {status === 'DRAFT' ? '草稿' : status === 'ACTIVE' ? '进行中' : status === 'REVIEWING' ? '待评审' : '已完成'}
                </label>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        {error && (
          <div className="text-center py-12">
            <p className="text-sm text-red-400">{error}</p>
            <button onClick={() => window.location.reload()} className="text-xs text-indigo-400 underline mt-1">重试</button>
          </div>
        )}
        {!error && tasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">还没有任务</p>
            <p className="text-xs text-muted-foreground mt-1">
              创建你的第一个任务开始吧
            </p>
          </div>
        )}
        {!error && filteredTasks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} workspaceId={wsId} />
            ))}
          </div>
        )}
      </div>

      <NewTaskModal
        workspaceId={wsId}
        open={newTaskOpen}
        onOpenChange={setNewTaskOpen}
        onCreated={handleTaskCreated}
      />
    </div>
  );
}
