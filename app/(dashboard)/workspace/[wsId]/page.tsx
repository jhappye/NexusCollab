'use client';

import { use, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { WorkspaceHeader } from '@/components/workspace/WorkspaceHeader';
import { TaskCard } from '@/components/task/TaskCard';
import { NewTaskModal } from '@/components/task/NewTaskModal';
import { Skeleton } from '@/components/ui/skeleton';

interface Workspace {
  id: string;
  name: string;
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

  useEffect(() => {
    async function load() {
      try {
        const [wsRes, tasksRes] = await Promise.all([
          fetch(`/api/workspace/${wsId}`),
          fetch(`/api/workspaces/${wsId}/tasks`),
        ]);

        if (!wsRes.ok || !tasksRes.ok) {
          setError('Failed to load workspace data');
          return;
        }

        const [wsData, tasksData] = await Promise.all([wsRes.json(), tasksRes.json()]);
        setWorkspace(wsData.workspace);
        setTasks(tasksData.tasks);
      } catch {
        setError('Something went wrong');
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
        {error && (
          <div className="text-center py-12">
            <p className="text-sm text-red-400">{error}</p>
            <button onClick={() => window.location.reload()} className="text-xs text-indigo-400 underline mt-1">Retry</button>
          </div>
        )}
        {!error && tasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">No tasks yet.</p>
            <p className="text-xs text-muted-foreground mt-1">
              Create your first task to get started.
            </p>
          </div>
        )}
        {!error && tasks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
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
