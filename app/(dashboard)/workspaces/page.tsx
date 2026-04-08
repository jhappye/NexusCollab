'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  BookOpen,
  Users,
  Clock,
  ChevronRight,
  Settings,
  Trash2,
  MoreHorizontal,
  FolderKanban,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/hooks/use-i18n';

interface Workspace {
  id: string;
  name: string;
  description?: string;
  _count?: { tasks: number; members: number };
}

interface Task {
  id: string;
  title: string;
  status: string;
  updatedAt: string;
}

export default function WorkspacesPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [newWsName, setNewWsName] = useState('');
  const [newWsDesc, setNewWsDesc] = useState('');
  const [creating, setCreating] = useState(false);

  // Load workspaces
  useEffect(() => {
    loadWorkspaces();
  }, []);

  const loadWorkspaces = async () => {
    try {
      const res = await fetch('/api/workspace');
      if (res.ok) {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          setWorkspaces(data.workspaces || []);
        } catch {
          // API returned non-JSON, use mock data
          setWorkspaces(mockWorkspaces);
        }
      } else {
        // API error, use mock data for development
        setWorkspaces(mockWorkspaces);
      }
    } catch {
      // Network error, use mock data for development
      setWorkspaces(mockWorkspaces);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newWsName.trim()) return;
    setCreating(true);

    // Create mock workspace immediately for development
    const mockWorkspace: Workspace = {
      id: `ws-${Date.now()}`,
      name: newWsName,
      description: newWsDesc,
      _count: { tasks: 0, members: 1 },
    };

    try {
      const res = await fetch('/api/workspace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newWsName, description: newWsDesc }),
      });

      if (res.ok) {
        const data = await res.json();
        setWorkspaces(prev => [...prev, mockWorkspace]);
        router.push(`/workspace/${data.workspace.id}`);
      } else {
        // API failed, use mock workspace for development
        setWorkspaces(prev => [...prev, mockWorkspace]);
        router.push(`/workspace/${mockWorkspace.id}`);
      }
    } catch {
      // Network error, use mock workspace for development
      setWorkspaces(prev => [...prev, mockWorkspace]);
      router.push(`/workspace/${mockWorkspace.id}`);
    } finally {
      setCreating(false);
      setCreateOpen(false);
      setNewWsName('');
      setNewWsDesc('');
    }
  };

  // Mock data for development when database is not available
  const mockWorkspaces: Workspace[] = [
    {
      id: 'ws-demo-1',
      name: '三年级一班',
      description: '三年级一班语文和数学课程',
      _count: { tasks: 5, members: 32 },
    },
    {
      id: 'ws-demo-2',
      name: '二年级二班',
      description: '二年级二班综合课程',
      _count: { tasks: 3, members: 28 },
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-100 text-emerald-700';
      case 'DRAFT': return 'bg-amber-100 text-amber-700';
      case 'REVIEWING': return 'bg-purple-100 text-purple-700';
      case 'COMPLETED': return 'bg-slate-100 text-slate-700';
      default: return 'bg-gray-100 text-gray-700';
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

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-gradient-to-b from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/30 px-4 py-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">我的班级</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              管理和查看你的所有班级
            </p>
          </div>
          <Button onClick={() => setCreateOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" /> 新建班级
          </Button>
        </div>

        {/* Workspaces grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-4" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
              </Card>
            ))}
          </div>
        ) : workspaces.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <FolderKanban className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">
              还没有班级
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              创建一个新班级，开始使用 AI 辅助教学
            </p>
            <Button onClick={() => setCreateOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" /> 创建第一个班级
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workspaces.map((ws, i) => (
              <motion.div
                key={ws.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card
                  className="p-5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 hover:border-indigo-200 dark:hover:border-indigo-700 transition-all cursor-pointer group"
                  onClick={() => router.push(`/workspace/${ws.id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: show workspace menu
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-1 truncate">
                    {ws.name}
                  </h3>
                  {ws.description && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                      {ws.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      {ws._count?.tasks || 0} 个任务
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {ws._count?.members || 0} 人
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button className="flex items-center justify-between w-full text-sm text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300">
                      进入班级
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Recent tasks section */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">最近任务</h2>
          <Card className="rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
            {loading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 animate-pulse">
                    <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                <TaskRow
                  title="语文阅读理解练习"
                  workspace="三年级一班"
                  status="进行中"
                  time="10分钟前"
                  onClick={() => router.push('/workspace/test/task/test')}
                />
                <TaskRow
                  title="数学第五单元测试"
                  workspace="三年级一班"
                  status="已完成"
                  time="昨天"
                  onClick={() => router.push('/workspace/test/task/test2')}
                />
                <TaskRow
                  title="英语单词听写"
                  workspace="二年级二班"
                  status="待评审"
                  time="2天前"
                  onClick={() => router.push('/workspace/test/task/test3')}
                />
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Create workspace dialog */}
      <AnimatePresence>
        {createOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setCreateOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-black/20 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">
                创建新班级
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    班级名称
                  </label>
                  <input
                    type="text"
                    value={newWsName}
                    onChange={(e) => setNewWsName(e.target.value)}
                    placeholder="例如：三年级一班"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    班级描述 <span className="text-slate-400 font-normal">(可选)</span>
                  </label>
                  <textarea
                    value={newWsDesc}
                    onChange={(e) => setNewWsDesc(e.target.value)}
                    placeholder="简单描述这个班级的特点..."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6">
                <Button variant="ghost" onClick={() => setCreateOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleCreate} disabled={!newWsName.trim() || creating}>
                  {creating ? '创建中...' : '创建班级'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TaskRow({
  title,
  workspace,
  status,
  time,
  onClick,
}: {
  title: string;
  workspace: string;
  status: string;
  time: string;
  onClick: () => void;
}) {
  const getStatusColor = (s: string) => {
    switch (s) {
      case '进行中': return 'bg-blue-100 text-blue-700';
      case '已完成': return 'bg-emerald-100 text-emerald-700';
      case '待评审': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div
      className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center shrink-0">
        <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium text-slate-800 dark:text-slate-100 truncate">{title}</h4>
          <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium shrink-0', getStatusColor(status))}>
            {status}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span>{workspace}</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {time}
          </span>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
    </div>
  );
}
