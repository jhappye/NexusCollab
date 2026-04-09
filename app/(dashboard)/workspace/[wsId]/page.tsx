'use client';

import { use, useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { WorkspaceHeader } from '@/components/workspace/WorkspaceHeader';
import { TaskCard } from '@/components/task/TaskCard';
import { TaskEditModal } from '@/components/task/TaskEditModal';
import { TaskTableView } from '@/components/task/TaskTableView';
import { TaskBatchBar } from '@/components/task/TaskBatchBar';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Task, TaskStatus, TASK_STATUS_LABELS } from '@/lib/types/task';
import { Grid, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Workspace {
  id: string;
  name: string;
  onboardingComplete?: boolean;
  _count?: { tasks: number; members: number };
  myRole?: 'ADMIN' | 'MANAGER' | 'MEMBER';
}

export default function WorkspacePage({ params }: { params: Promise<{ wsId: string }> }) {
  const { wsId } = use(params);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());
  const [taskStatuses, setTaskStatuses] = useState<Record<string, TaskStatus>>({});

  const canManage = workspace?.myRole === 'ADMIN' || workspace?.myRole === 'MANAGER';

  const loadTasks = useCallback(async () => {
    try {
      const statusParam = statusFilter ? `?status=${statusFilter}` : '';
      const res = await fetch(`/api/workspaces/${wsId}/tasks${statusParam}`);
      if (res.ok) {
        const data = await res.json();
        const taskList: Task[] = data.tasks || [];
        setTasks(taskList);
        const statusMap: Record<string, TaskStatus> = {};
        taskList.forEach((t) => {
          statusMap[t.id] = t.status;
        });
        setTaskStatuses(statusMap);
      }
    } catch (err) {
      console.error('Failed to load tasks:', err);
    }
  }, [wsId, statusFilter]);

  useEffect(() => {
    async function load() {
      try {
        const wsRes = await fetch(`/api/workspace/${wsId}`);

        if (wsRes.ok) {
          const data = await wsRes.json();
          setWorkspace(data.workspace);
        } else {
          setWorkspace({
            id: wsId,
            name: '新班级',
            onboardingComplete: true,
            _count: { tasks: 0, members: 1 },
            myRole: 'ADMIN',
          });
        }
      } catch {
        setWorkspace({
          id: wsId,
          name: '新班级',
          onboardingComplete: true,
          _count: { tasks: 0, members: 1 },
          myRole: 'ADMIN',
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [wsId]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleTaskCreated = (taskId: string) => {
    loadTasks();
  };

  const handleTaskUpdated = () => {
    loadTasks();
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('确定要删除这个任务吗？')) return;
    try {
      const res = await fetch(`/api/task/${taskId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('任务已删除');
        loadTasks();
      } else {
        toast.error('删除失败');
      }
    } catch {
      toast.error('删除失败');
    }
  };

  const handleBatchDelete = async () => {
    const count = selectedTaskIds.size;
    if (!confirm(`确定要删除选中的 ${count} 个任务吗？`)) return;

    try {
      const res = await fetch(`/api/workspaces/${wsId}/tasks/batch`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskIds: Array.from(selectedTaskIds) }),
      });

      if (res.ok) {
        toast.success(`已删除 ${count} 个任务`);
        setSelectedTaskIds(new Set());
        loadTasks();
      } else {
        toast.error('批量删除失败');
      }
    } catch {
      toast.error('批量删除失败');
    }
  };

  const handleBatchStatusChange = async (status: TaskStatus) => {
    try {
      const res = await fetch(`/api/workspaces/${wsId}/tasks/batch`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskIds: Array.from(selectedTaskIds),
          action: 'updateStatus',
          status,
        }),
      });

      if (res.ok) {
        toast.success(`已更新为"${TASK_STATUS_LABELS[status]}"`);
        setSelectedTaskIds(new Set());
        loadTasks();
      } else {
        toast.error('批量更新失败');
      }
    } catch {
      toast.error('批量更新失败');
    }
  };

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    try {
      const res = await fetch(`/api/task/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        toast.success(`状态已更新为"${TASK_STATUS_LABELS[status]}"`);
        loadTasks();
      } else {
        toast.error('状态更新失败');
      }
    } catch {
      toast.error('状态更新失败');
    }
  };

  const handleTaskSelect = (taskId: string, selected: boolean) => {
    setSelectedTaskIds((prev) => {
      const next = new Set(prev);
      if (selected) {
        next.add(taskId);
      } else {
        next.delete(taskId);
      }
      return next;
    });
  };

  const filteredTasks = statusFilter ? tasks.filter((t) => t.status === statusFilter) : tasks;

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
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">{tasks.length} 个任务</span>
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 transition-colors',
                  viewMode === 'grid'
                    ? 'bg-slate-100 dark:bg-slate-700 text-indigo-500'
                    : 'text-muted-foreground hover:bg-slate-50 dark:hover:bg-slate-800'
                )}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={cn(
                  'p-2 transition-colors',
                  viewMode === 'table'
                    ? 'bg-slate-100 dark:bg-slate-700 text-indigo-500'
                    : 'text-muted-foreground hover:bg-slate-50 dark:hover:bg-slate-800'
                )}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Mobile filter */}
            <Button variant="outline" size="sm" onClick={() => setFilterOpen(true)} className="md:hidden">
              筛选
            </Button>
          </div>
        </div>

        {/* Filter Sheet (mobile) */}
        <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
          <SheetContent side="bottom">
            <div className="p-4 space-y-3">
              <h3 className="text-sm font-semibold">按状态筛选</h3>
              <button
                onClick={() => { setStatusFilter(null); setFilterOpen(false); }}
                className={cn('text-sm px-3 py-1.5 rounded-md', !statusFilter && 'bg-indigo-100 text-indigo-700')}
              >
                全部
              </button>
              {(['DRAFT', 'ACTIVE', 'REVIEWING', 'COMPLETED'] as TaskStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => { setStatusFilter(status); setFilterOpen(false); }}
                  className={cn('text-sm px-3 py-1.5 rounded-md w-full text-left', statusFilter === status && 'bg-indigo-100 text-indigo-700')}
                >
                  {TASK_STATUS_LABELS[status]}
                </button>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">还没有任务</p>
            <p className="text-xs text-muted-foreground mt-1">创建你的第一个任务开始吧</p>
          </div>
        )}

        {/* Grid View */}
        {filteredTasks.length > 0 && viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map((task) => (
              <div key={task.id} className="relative">
                <TaskCard
                  task={task}
                  workspaceId={wsId}
                  onEdit={canManage ? () => setEditTask(task) : undefined}
                  onDelete={canManage ? () => handleDeleteTask(task.id) : undefined}
                />
                {/* Selection checkbox */}
                <input
                  type="checkbox"
                  checked={selectedTaskIds.has(task.id)}
                  onChange={(e) => handleTaskSelect(task.id, e.target.checked)}
                  className="absolute top-3 left-3 w-4 h-4 rounded border-slate-300 dark:border-slate-600"
                />
              </div>
            ))}
          </div>
        )}

        {/* Table View */}
        {filteredTasks.length > 0 && viewMode === 'table' && (
          <TaskTableView
            tasks={filteredTasks}
            workspaceId={wsId}
            onTaskSelect={handleTaskSelect}
            selectedTaskIds={selectedTaskIds}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteTask}
            onEdit={(task) => setEditTask(task)}
            canManage={canManage}
          />
        )}
      </div>

      {/* Batch Bar */}
      <TaskBatchBar
        selectedCount={selectedTaskIds.size}
        onClear={() => setSelectedTaskIds(new Set())}
        onBatchDelete={handleBatchDelete}
        onBatchStatusChange={handleBatchStatusChange}
        currentTaskStatuses={taskStatuses}
        canManage={canManage}
      />

      {/* New Task Modal */}
      <TaskEditModal
        workspaceId={wsId}
        open={newTaskOpen}
        onOpenChange={setNewTaskOpen}
        onCreated={handleTaskCreated}
      />

      {/* Edit Task Modal */}
      <TaskEditModal
        workspaceId={wsId}
        open={!!editTask}
        onOpenChange={(open) => !open && setEditTask(null)}
        task={editTask ? {
          id: editTask.id,
          title: editTask.title,
          description: editTask.description,
          status: editTask.status,
          dueAt: editTask.dueAt,
          agentConfig: editTask.agentConfig as import('@/lib/types/task').AgentConfigData,
        } : undefined}
        onUpdated={handleTaskUpdated}
      />
    </div>
  );
}
