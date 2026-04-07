'use client';

import type { EvalDimension } from '@/lib/types/task-chat';

export function EvalDimensionBar({ dimension }: { dimension: EvalDimension }) {
  const pct = Math.min(100, Math.max(0, dimension.score));

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-slate-400">{dimension.name}</span>
        <span className="font-medium text-slate-300">{dimension.score}/100</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${pct}%`,
            backgroundColor: pct >= 80 ? '#10b981' : pct >= 60 ? '#f59e0b' : '#ef4444',
          }}
        />
      </div>
      {dimension.comment && (
        <p className="text-[10px] text-muted-foreground">{dimension.comment}</p>
      )}
    </div>
  );
}