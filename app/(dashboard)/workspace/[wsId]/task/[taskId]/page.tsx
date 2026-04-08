'use client';

import { use, useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, MessageSquare, Clock, User, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  agentConfig?: {
    evaluatorName?: string;
    coachingEnabled?: boolean;
  };
}

export default function TaskDetailPage({ params }: { params: Promise<{ wsId: string; taskId: string }> }) {
  const { wsId, taskId } = use(params);
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadTask() {
      try {
        const res = await fetch(`/api/task/${taskId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.task) {
            setTask(data.task);
          } else {
            setError('任务未找到');
          }
        } else {
          setError('加载失败');
        }
      } catch {
        setError('加载失败');
      } finally {
        setLoading(false);
      }
    }
    loadTask();
  }, [taskId]);

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

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="p-6">
        <Button variant="ghost" onClick={() => router.push(`/workspace/${wsId}`)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> 返回班级
        </Button>
        <Card className="p-8 text-center">
          <p className="text-slate-500">{error || '任务未找到'}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-gradient-to-b from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/30 px-4 py-6">
      <div className="max-w-3xl mx-auto">
        {/* Back button */}
        <Button variant="ghost" onClick={() => router.push(`/workspace/${wsId}`)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> 返回班级
        </Button>

        {/* Task header */}
        <Card className="p-6 rounded-xl border border-slate-200/50 dark:border-slate-700/50 mb-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                {task.title || '未命名任务'}
              </h1>
              <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', getStatusColor(task.status))}>
                {getStatusLabel(task.status)}
              </span>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-1" /> 设置
            </Button>
          </div>

          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {task.description || '暂无描述'}
          </p>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              创建于 {new Date(task.createdAt).toLocaleDateString('zh-CN')}
            </span>
            {task.agentConfig?.evaluatorName && (
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                评价者：{task.agentConfig.evaluatorName}
              </span>
            )}
          </div>
        </Card>

        {/* Enter chat room */}
        <Card className="p-6 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">任务聊天室</h2>
              <p className="text-sm text-slate-500">进入 AI 评价聊天室开始任务</p>
            </div>
            <Button onClick={() => router.push(`/workspace/${wsId}/task/${taskId}/room`)}>
              <MessageSquare className="w-4 h-4 mr-2" /> 进入聊天
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
