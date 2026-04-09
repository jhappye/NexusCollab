'use client';

import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Pencil, Trash2, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskMenuItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
  disabled?: boolean;
}

interface TaskMenuButtonProps {
  items: TaskMenuItem[];
  onOpenChat?: () => void;
}

export function TaskMenuButton({ items, onOpenChat }: TaskMenuButtonProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allItems: TaskMenuItem[] = onOpenChat
    ? [...items, { label: '进入聊天', icon: <MessageSquare className="h-4 w-4" />, onClick: onOpenChat }]
    : items;

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(!open);
        }}
        className="p-1 rounded-md hover:bg-slate-700/50 transition-colors"
      >
        <MoreVertical className="h-4 w-4 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-40 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg py-1">
          {allItems.map((item, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                item.onClick();
                setOpen(false);
              }}
              disabled={item.disabled}
              className={cn(
                'w-full px-3 py-1.5 text-left text-sm flex items-center gap-2 transition-colors',
                item.variant === 'danger'
                  ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700',
                item.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
