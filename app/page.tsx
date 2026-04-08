'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Clock,
  BookOpen,
  Sparkles,
  Settings,
  ChevronRight,
  Lightbulb,
  Target,
  TrendingUp,
  Calendar,
  MessageSquare,
  Bot,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/hooks/use-i18n';
import { useTheme } from '@/lib/hooks/use-theme';
import { LanguageSwitcher } from '@/components/language-switcher';

// Mock data for demonstration - in real app this would come from API
interface QuickTask {
  id: string;
  title: string;
  workspace: string;
  status: '待完成' | '进行中' | '待评审';
  dueAt: string;
  progress: number;
}

interface Stats {
  tasksCompleted: number;
  tasksPending: number;
  avgScore: number;
  studyDays: number;
}

const mockTasks: QuickTask[] = [
  { id: '1', title: '语文阅读理解练习', workspace: '三年级一班', status: '待完成', dueAt: '今天 17:00', progress: 0 },
  { id: '2', title: '数学第五单元测试', workspace: '三年级一班', status: '待评审', dueAt: '昨天', progress: 100 },
  { id: '3', title: '英语单词听写', workspace: '二年级二班', status: '进行中', dueAt: '明天 09:00', progress: 60 },
];

const mockStats: Stats = {
  tasksCompleted: 12,
  tasksPending: 5,
  avgScore: 87,
  studyDays: 21,
};

export default function HomePage() {
  const { t } = useI18n();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [themeOpen, setThemeOpen] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [newTaskInput, setNewTaskInput] = useState('');
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Set greeting based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('上午好');
    else if (hour < 18) setGreeting('下午好');
    else setGreeting('晚上好');
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    if (!themeOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setThemeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [themeOpen]);

  const handleQuickCreate = () => {
    if (!newTaskInput.trim()) return;
    // In real app, would call API to create task
    console.log('Creating task:', newTaskInput);
    setNewTaskInput('');
    setQuickCreateOpen(false);
    router.push('/workspaces');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '待完成': return 'bg-amber-100 text-amber-700';
      case '进行中': return 'bg-blue-100 text-blue-700';
      case '待评审': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/30 flex flex-col">
      {/* Top toolbar */}
      <div
        ref={toolbarRef}
        className="fixed top-4 right-4 z-50 flex items-center gap-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg shadow-black/[0.05]"
      >
        <LanguageSwitcher onOpen={() => setThemeOpen(false)} />

        <div className="w-px h-5 bg-slate-200 dark:bg-slate-600 mx-1" />

        {/* Theme Selector */}
        <div className="relative">
          <button
            onClick={() => setThemeOpen(!themeOpen)}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition-all"
          >
            {theme === 'light' && <Sun className="w-4 h-4" />}
            {theme === 'dark' && <Moon className="w-4 h-4" />}
            {theme === 'system' && <Monitor className="w-4 h-4" />}
          </button>
          {themeOpen && (
            <div className="absolute top-full mt-2 right-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 min-w-[140px]">
              <button
                onClick={() => { setTheme('light'); setThemeOpen(false); }}
                className={cn(
                  'w-full px-4 py-2.5 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-2',
                  theme === 'light' && 'text-indigo-600 dark:text-indigo-400'
                )}
              >
                <Sun className="w-4 h-4" /> 浅色
              </button>
              <button
                onClick={() => { setTheme('dark'); setThemeOpen(false); }}
                className={cn(
                  'w-full px-4 py-2.5 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-2',
                  theme === 'dark' && 'text-indigo-600 dark:text-indigo-400'
                )}
              >
                <Moon className="w-4 h-4" /> 深色
              </button>
              <button
                onClick={() => { setTheme('system'); setThemeOpen(false); }}
                className={cn(
                  'w-full px-4 py-2.5 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-2',
                  theme === 'system' && 'text-indigo-600 dark:text-indigo-400'
                )}
              >
                <Monitor className="w-4 h-4" /> 跟随系统
              </button>
            </div>
          )}
        </div>

        <div className="w-px h-5 bg-slate-200 dark:bg-slate-600 mx-1" />

        <button
          onClick={() => router.push('/settings')}
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition-all"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center px-4 pt-20 pb-8">
        {/* Hero section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl text-center mb-8"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              NexusCollab
            </span>
          </motion.div>

          {/* Greeting */}
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-3">
            {greeting}，同学 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base mb-8">
            让我们开始今天的任务吧
          </p>

          {/* Quick create */}
          <div className="relative max-w-xl mx-auto">
            <AnimatePresence mode="wait">
              {!quickCreateOpen ? (
                <motion.div
                  key="trigger"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <button
                    onClick={() => setQuickCreateOpen(true)}
                    className="w-full py-4 px-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors flex items-center justify-center gap-3 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="font-medium">创建新任务</span>
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="input"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl shadow-indigo-500/10 p-4"
                >
                  <input
                    autoFocus
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleQuickCreate()}
                    placeholder="输入任务描述，例如：完成数学练习册第15页"
                    className="w-full bg-transparent border-0 outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 text-base"
                  />
                  <div className="flex items-center justify-end gap-2 mt-3">
                    <Button variant="ghost" size="sm" onClick={() => setQuickCreateOpen(false)}>
                      取消
                    </Button>
                    <Button size="sm" onClick={handleQuickCreate}>
                      创建
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Stats cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
        >
          {[
            { label: '已完成任务', value: mockStats.tasksCompleted, icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
            { label: '待完成', value: mockStats.tasksPending, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' },
            { label: '平均得分', value: `${mockStats.avgScore}分`, icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
            { label: '连续学习', value: `${mockStats.studyDays}天`, icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/30' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
            >
              <Card className={cn('p-4 rounded-xl border-0 shadow-sm', stat.bg)}>
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className={cn('w-4 h-4', stat.color)} />
                  <span className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</span>
                </div>
                <p className={cn('text-2xl font-bold', stat.color)}>{stat.value}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="w-full max-w-4xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">最近任务</h2>
            <button
              onClick={() => router.push('/workspaces')}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1"
            >
              查看全部 <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {mockTasks.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <Card className="p-4 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors cursor-pointer group" onClick={() => router.push('/workspace/test/task/test')}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-slate-800 dark:text-slate-100 truncate">{task.title}</h3>
                        <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium shrink-0', getStatusColor(task.status))}>
                          {task.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" /> {task.workspace}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {task.dueAt}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {task.progress > 0 && task.progress < 100 && (
                        <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full transition-all"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      )}
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Helper hint */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="w-full max-w-4xl mt-8"
        >
          <Card className="p-4 rounded-xl border border-indigo-200/50 dark:border-indigo-800/50 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">AI 学习助手</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  有问题？让 AI 帮你解答作业难题、讲解知识点
                </p>
              </div>
              <Button variant="outline" className="shrink-0 border-indigo-300 dark:border-indigo-700 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                <MessageSquare className="w-4 h-4 mr-2" /> 问问 AI
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="w-full max-w-4xl mt-6"
        >
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: BookOpen, label: '我的作业', color: 'hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border-emerald-200/50 dark:border-emerald-800/50' },
              { icon: Lightbulb, label: '知识库', color: 'hover:bg-amber-50 dark:hover:bg-amber-950/30 border-amber-200/50 dark:border-amber-800/50' },
              { icon: Sparkles, label: '智能推荐', color: 'hover:bg-purple-50 dark:hover:bg-purple-950/30 border-purple-200/50 dark:border-purple-800/50' },
            ].map((action) => (
              <Card
                key={action.label}
                className={cn('p-4 rounded-xl border cursor-pointer transition-all group', action.color)}
              >
                <action.icon className="w-5 h-5 text-slate-600 dark:text-slate-300 mb-2" />
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{action.label}</p>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="text-center pb-4 text-xs text-slate-400">
        <p>NexusCollab · 智能任务评审平台</p>
      </div>
    </div>
  );
}
