'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  MessageSquare,
  Search,
  Plus,
  MoreHorizontal,
  Send,
  Circle,
  CheckCircle,
  Clock,
  MessageCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  type: 'qa' | 'discussion' | 'lecture';
  status: 'active' | 'completed' | 'idle';
  lastMessage?: string;
  updatedAt: Date;
  messages: Message[];
}

// Mock data for demonstration
const mockSessions: ChatSession[] = [
  {
    id: '1',
    title: '关于二次函数的讨论',
    type: 'discussion',
    status: 'active',
    lastMessage: '我觉得可以从图像的特点来分析...',
    updatedAt: new Date(Date.now() - 1000 * 60 * 5),
    messages: [],
  },
  {
    id: '2',
    title: '英语语法提问',
    type: 'qa',
    status: 'completed',
    lastMessage: 'Thank you for your question!',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    messages: [],
  },
  {
    id: '3',
    title: '物理力学问题',
    type: 'qa',
    status: 'idle',
    lastMessage: '牛顿第二定律的应用...',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    messages: [],
  },
];

export default function ChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setSessions(mockSessions);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedSession?.messages]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Circle className="w-2.5 h-2.5 fill-green-500 text-green-500" />;
      case 'completed':
        return <CheckCircle className="w-2.5 h-2.5 text-gray-400" />;
      default:
        return <Circle className="w-2.5 h-2.5 text-gray-300" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'qa':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">问答</span>;
      case 'discussion':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">讨论</span>;
      case 'lecture':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">讲课</span>;
      default:
        return null;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  const filteredSessions = sessions.filter(session => {
    if (searchQuery && !session.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (typeFilter && session.type !== typeFilter) return false;
    return true;
  });

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedSession) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setSessions(prev => prev.map(s =>
      s.id === selectedSession.id
        ? { ...s, messages: [...s.messages, userMessage], lastMessage: newMessage }
        : s
    ));
    setSelectedSession(prev => prev ? { ...prev, messages: [...prev.messages, userMessage] } : null);
    setNewMessage('');
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100dvh-4rem)] bg-gradient-to-b from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/30 px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100dvh-8rem)]">
            <Card className="lg:col-span-1 p-4 animate-pulse">
              <Skeleton className="h-8 w-32 mb-4" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16" />)}
              </div>
            </Card>
            <Card className="lg:col-span-2 animate-pulse">
              <Skeleton className="h-full" />
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-gradient-to-b from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/30 px-4 py-6">
      <div className="max-w-6xl mx-auto h-[calc(100dvh-8rem)]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">消息</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              与 AI 智能助手交流
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> 新建对话
          </Button>
        </div>

        <Card className="rounded-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden h-[calc(100%-4rem)] flex">
          {/* Session list */}
          <div className="w-full lg:w-80 border-r border-slate-200/50 dark:border-slate-700/50 flex flex-col shrink-0">
            {/* Search */}
            <div className="p-3 border-b border-slate-100 dark:border-slate-800">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索对话..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-1 p-2 border-b border-slate-100 dark:border-slate-800">
              {['', 'qa', 'discussion'].map((type) => (
                <button
                  key={type || 'all'}
                  onClick={() => setTypeFilter(type || null)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                    typeFilter === (type || null)
                      ? 'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  )}
                >
                  {type === '' ? '全部' : type === 'qa' ? '问答' : '讨论'}
                </button>
              ))}
            </div>

            {/* Sessions */}
            <div className="flex-1 overflow-y-auto">
              {filteredSessions.length === 0 ? (
                <div className="p-6 text-center">
                  <MessageCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {sessions.length === 0 ? '还没有对话' : '没有找到匹配的结果'}
                  </p>
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {filteredSessions.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => setSelectedSession(session)}
                      className={cn(
                        'w-full p-3 rounded-xl text-left transition-colors',
                        selectedSession?.id === session.id
                          ? 'bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      )}
                    >
                      <div className="flex items-start gap-2 mb-1">
                        {getTypeBadge(session.type)}
                        <div className="flex items-center gap-1.5 ml-auto">
                          {getStatusIcon(session.status)}
                        </div>
                      </div>
                      <h4 className="font-medium text-slate-800 dark:text-slate-100 text-sm truncate mb-1">
                        {session.title}
                      </h4>
                      {session.lastMessage && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mb-1">
                          {session.lastMessage}
                        </p>
                      )}
                      <p className="text-[10px] text-slate-400">
                        {formatTime(session.updatedAt)}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat area */}
          <div className="hidden lg:flex flex-1 flex-col">
            {selectedSession ? (
              <>
                {/* Chat header */}
                <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getTypeBadge(selectedSession.type)}
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                        {selectedSession.title}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        {getStatusIcon(selectedSession.status)}
                        {selectedSession.status === 'active' ? '进行中' : selectedSession.status === 'completed' ? '已完成' : '空闲'}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedSession.messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                        <MessageCircle className="w-8 h-8 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">
                        开始对话
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
                        发送消息与 AI 助手开始交流
                      </p>
                    </div>
                  ) : (
                    selectedSession.messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          'flex gap-3',
                          message.sender === 'user' && 'flex-row-reverse'
                        )}
                      >
                        <div className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                          message.sender === 'user'
                            ? 'bg-indigo-500 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        )}>
                          {message.sender === 'user' ? '我' : 'AI'}
                        </div>
                        <div className={cn(
                          'max-w-[70%] rounded-2xl px-4 py-2',
                          message.sender === 'user'
                            ? 'bg-indigo-500 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100'
                        )}>
                          <p className="text-sm">{message.content}</p>
                          <p className={cn(
                            'text-[10px] mt-1',
                            message.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'
                          )}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="输入消息..."
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  欢迎使用消息助手
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
                  选择一个对话开始交流，或者创建新的对话
                </p>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" /> 新建对话
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
