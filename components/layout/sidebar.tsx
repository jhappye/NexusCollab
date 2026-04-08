'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutGrid,
  BookOpen,
  MessageSquare,
  Settings,
  ChevronLeft,
  Bell,
  HelpCircle,
  Users,
} from 'lucide-react';

const COLLAPSED_KEY = 'sidebar-collapsed';

const navItems = [
  { href: '/workspaces', label: '我的班级', icon: LayoutGrid },
  { href: '/workspace', label: '任务中心', icon: BookOpen },
  { href: '/chat', label: '消息', icon: MessageSquare },
  { href: '/settings', label: '设置', icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [workspaces, setWorkspaces] = useState<Array<{ id: string; name: string }>>([]);

  const currentWorkspaceId = pathname.includes('/workspace/')
    ? pathname.split('/workspace/')[1]?.split('/')[0]
    : '';

  useEffect(() => {
    async function loadWorkspaces() {
      try {
        const res = await fetch('/api/workspace');
        if (res.ok) {
          const data = await res.json();
          setWorkspaces(data.workspaces ?? []);
        }
      } catch {
        // silently fail
      }
    }
    loadWorkspaces();
  }, []);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-full flex-col border-r border-slate-800 bg-sidebar transition-all duration-200',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-slate-800 px-3">
        <Link href="/workspaces" className="flex items-center gap-2.5 overflow-hidden">
          <img
            src="/brand/logo-mark.svg"
            alt="NexusCollab"
            className="h-7 w-7 shrink-0"
          />
          {!collapsed && (
            <span className="text-sm font-semibold text-sidebar-foreground whitespace-nowrap">
              NexusCollab
            </span>
          )}
        </Link>
      </div>

      {/* Workspace switcher */}
      {!collapsed && (
        <div className="px-2 pb-2">
          <select
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs text-slate-300"
            onChange={(e) => router.push(`/workspace/${e.target.value}`)}
            value={currentWorkspaceId}
          >
            {workspaces.map((ws) => (
              <option key={ws.id} value={ws.id}>{ws.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-indigo-500/15 text-indigo-400 border-l-2 border-indigo-500'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200',
                    collapsed && 'justify-center px-0',
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom row */}
      <div className="border-t border-slate-800 px-2 py-3">
        {/* Notification + avatar row */}
        <div className={cn('flex items-center gap-2', collapsed ? 'justify-center' : '')}>
          <button
            className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-indigo-500" />
          </button>
          {!collapsed && (
            <>
              <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors">
                <HelpCircle className="h-4 w-4" />
              </button>
              <div className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-500/20">
                <span className="text-xs font-medium text-indigo-400">AV</span>
              </div>
            </>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className={cn(
            'mt-2 flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-500 hover:bg-slate-800 hover:text-slate-300 transition-colors',
            collapsed && 'justify-center px-0',
          )}
        >
          <ChevronLeft
            className={cn('h-3.5 w-3.5 shrink-0 transition-transform', collapsed && 'rotate-180')}
          />
          {!collapsed && <span>收起</span>}
        </button>
      </div>
    </aside>
  );
}