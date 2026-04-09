'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TaskStatusDropdown } from '@/components/task/TaskStatusDropdown';
import { AIConfigPanel } from '@/components/task/AIConfigPanel';
import { TaskEditModal } from '@/components/task/TaskEditModal';
import { ArrowLeft, MessageSquare, Clock, Pencil } from 'lucide-react';
import { Task, AgentConfigData } from '@/lib/types/task';
import { toast } from 'sonner';

export default function TaskDetailPage({ params }: { params: Promise<{ wsId: string; taskId: string }> }) {
  const { wsId, taskId } = use(params);
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editOpen, setEditOpen] = useState(false);

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

  const handleStatusChange = async (status: string) => {
    try {
      const res = await fetch(`/api/task/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setTask((prev) => prev ? { ...prev, status: status as any } : null);
        toast.success('状态已更新');
      } else {
        toast.error('状态更新失败');
      }
    } catch {
      toast.error('状态更新失败');
    }
  };

  const handleAgentConfigUpdate = async (agentConfig: AgentConfigData) => {
    try {
      const res = await fetch(`/api/task/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentConfig }),
      });

      if (res.ok) {
        setTask((prev) => prev ? { ...prev, agentConfig: agentConfig as any } : null);
        toast.success('AI配置已保存');
      } else {
        toast.error('保存失败');
      }
    } catch {
      toast.error('保存失败');
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
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

  const agentConfig = (task.agentConfig as unknown as AgentConfigData) || {
    evaluatorName: '评估助手',
    promptTemplate: '',
    dimensions: [],
    coachingEnabled: true,
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-gradient-to-b from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/30 px-4 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Button variant="ghost" onClick={() => router.push(`/workspace/${wsId}`)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> 返回班级
        </Button>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left: Basic Info */}
          <Card className="p-6 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                  {task.title || '未命名任务'}
                </h1>
                <TaskStatusDropdown
                  status={task.status}
                  onStatusChange={handleStatusChange}
                />
              </div>
              <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
                <Pencil className="w-4 h-4 mr-1" /> 编辑
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
              {task.dueAt && (
                <span className="flex items-center gap-1">
                  📅 截止：{new Date(task.dueAt).toLocaleDateString('zh-CN')}
                </span>
              )}
            </div>
          </Card>

          {/* Right: AI Config */}
          <Card className="p-6 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
            <AIConfigPanel
              config={agentConfig}
              onChange={handleAgentConfigUpdate}
              expanded={true}
            />
          </Card>
        </div>

        {/* Enter chat room */}
        <Card className="p-6 rounded-xl border border-slate-200/50 dark:border-slate-700/50 mt-4">
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

      {/* Edit Modal */}
      <TaskEditModal
        workspaceId={wsId}
        open={editOpen}
        onOpenChange={setEditOpen}
        task={{
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          dueAt: task.dueAt ? new Date(task.dueAt).toISOString().split('T')[0] : null,
          agentConfig,
        }}
        onUpdated={() => {
          fetch(`/api/task/${taskId}`).then((res) => res.json()).then((data) => {
            if (data.task) setTask(data.task);
          });
        }}
      />
    </div>
  );
}
