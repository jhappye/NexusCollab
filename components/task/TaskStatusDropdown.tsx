'use client';

import { useState, useRef, useEffect } from 'react';
import { TaskStatusBadge } from './TaskStatusBadge';
import { TaskStatus, TASK_STATUS_LABELS, canTransitionTo } from '@/lib/types/task';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskStatusDropdownProps {
  status: TaskStatus;
  onStatusChange: (newStatus: TaskStatus) => void;
  disabled?: boolean;
}

export function TaskStatusDropdown({ status, onStatusChange, disabled }: TaskStatusDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const statuses: TaskStatus[] = ['DRAFT', 'ACTIVE', 'REVIEWING', 'COMPLETED'];

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <div className="flex items-center gap-1">
        <TaskStatusBadge status={status} onClick={() => !disabled && setOpen(!open)} />
        {!disabled && (
          <ChevronDown
            className={cn('h-3 w-3 text-muted-foreground transition-transform', open && 'rotate-180')}
          />
        )}
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-32 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg py-1">
          {statuses.map((s) => {
            const canTransition = canTransitionTo(status, s);
            return (
              <button
                key={s}
                onClick={() => {
                  if (canTransition) {
                    onStatusChange(s);
                    setOpen(false);
                  }
                }}
                disabled={!canTransition || s === status}
                className={cn(
                  'w-full px-3 py-1.5 text-left text-sm transition-colors',
                  canTransition && s !== status
                    ? 'hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer'
                    : 'text-muted-foreground cursor-not-allowed',
                  s === status && 'font-medium'
                )}
              >
                {TASK_STATUS_LABELS[s]}
                {!canTransition && s !== status && (
                  <span className="ml-1 text-xs text-muted-foreground/50">(不可跳转)</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
