'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BookOpen,
  Users,
  Clock,
  ChevronRight,
  Filter,
  Plus,
  LayoutGrid,
  List,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  updatedAt: string;
  workspaceId: string;
  workspaceName: string;
  _count?: { evaluations: number };
}

interface Workspace {
  id: string;
  name: string;
  _count?: { tasks: number; members: number };
}

export default function WorkspacePage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [workspaceFilter, setWorkspaceFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [wsRes] = await Promise.all([
        fetch('/api/workspace'),
      ]);

      if (wsRes.ok) {
        const wsData = await wsRes.json();
        setWorkspaces(wsData.workspaces || []);

        // Load tasks from all workspaces
        const allTasks: Task[] = [];
        for (const ws of wsData.workspaces || []) {
          const taskRes = await fetch(`/api/workspaces/${ws.id}/tasks`);
          if (taskRes.ok) {
            const taskData = await taskRes.json();
            const tasksWithWs = (taskData.tasks || []).map((t: Task) => ({
              ...t,
              workspaceId: ws.id,
              workspaceName: ws.name,
            }));
            allTasks.push(...tasksWithWs);
          }
        }
        setTasks(allTasks);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'DRAFT': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
      case 'REVIEWING': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'COMPLETED': return 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE': return '进行中';
      case 'DRAFT': return '草稿';
      case 'REVIEWING': return '待评审';
      case 'COMPLETED': return '已完成';
      default: return status;
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (statusFilter && task.status !== statusFilter) return false;
    if (workspaceFilter && task.workspaceId !== workspaceFilter) return false;
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: tasks.length,
    active: tasks.filter(t => t.status === 'ACTIVE').length,
    reviewing: tasks.filter(t => t.status === 'REVIEWING').length,
    completed: tasks.filter(t => t.status === 'COMPLETED').length,
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-gradient-to-b from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/30 px-4 py-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">任务中心</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              查看和管理所有班级的任务
            </p>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Card className="p-4 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.total}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">全部任务</div>
          </Card>
          <Card className="p-4 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
            <div className="text-2xl font-bold text-emerald-600">{stats.active}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">进行中</div>
          </Card>
          <Card className="p-4 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
            <div className="text-2xl font-bold text-purple-600">{stats.reviewing}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">待评审</div>
          </Card>
          <Card className="p-4 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
            <div className="text-2xl font-bold text-slate-600">{stats.completed}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">已完成</div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4 rounded-xl border border-slate-200/50 dark:border-slate-700/50 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索任务..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            {/* Workspace filter */}
            <select
              value={workspaceFilter || ''}
              onChange={(e) => setWorkspaceFilter(e.target.value || null)}
              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">全部班级</option>
              {workspaces.map((ws) => (
                <option key={ws.id} value={ws.id}>{ws.name}</option>
              ))}
            </select>

            {/* Status filter */}
            <select
              value={statusFilter || ''}
              onChange={(e) => setStatusFilter(e.target.value || null)}
              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">全部状态</option>
              <option value="ACTIVE">进行中</option>
              <option value="DRAFT">草稿</option>
              <option value="REVIEWING">待评审</option>
              <option value="COMPLETED">已完成</option>
            </select>

            {/* View toggle */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 rounded-md transition-colors',
                  viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'hover:bg-slate-200 dark:hover:bg-slate-700'
                )}
              >
                <LayoutGrid className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 rounded-md transition-colors',
                  viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'hover:bg-slate-200 dark:hover:bg-slate-700'
                )}
              >
                <List className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              </button>
            </div>
          </div>
        </Card>

        {/* Tasks */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-5 animate-pulse">
                <Skeleton className="h-4 w-1/2 mb-3" />
                <Skeleton className="h-3 w-3/4 mb-4" />
                <Skeleton className="h-3 w-1/3" />
              </Card>
            ))}
          </div>
        ) : filteredTasks.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">
              {tasks.length === 0 ? '还没有任务' : '没有找到匹配的任务'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {tasks.length === 0 ? '创建你的第一个任务开始吧' : '尝试调整筛选条件'}
            </p>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map((task, i) => (
              <Card
                key={task.id}
                className="p-5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:border-indigo-200 dark:hover:border-indigo-700 transition-all cursor-pointer group"
                onClick={() => router.push(`/workspace/${task.workspaceId}/task/${task.id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', getStatusColor(task.status))}>
                    {getStatusLabel(task.status)}
                  </span>
                  <span className="text-xs text-slate-400">{task.workspaceName}</span>
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2 line-clamp-2">
                  {task.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                  {task.description}
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(task.updatedAt).toLocaleDateString('zh-CN')}
                  </span>
                  {task._count?.evaluations ? (
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {task._count.evaluations} 评价
                    </span>
                  ) : null}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="rounded-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/workspace/${task.workspaceId}/task/${task.id}`)}
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-slate-800 dark:text-slate-100 truncate">{task.title}</h4>
                      <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium shrink-0', getStatusColor(task.status))}>
                        {getStatusLabel(task.status)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span>{task.workspaceName}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(task.updatedAt).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
