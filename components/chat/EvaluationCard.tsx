import type { Evaluation } from '@prisma/client';
import type { EvalDimension } from '@/lib/types/task-chat';
import { EvalDimensionBar } from './EvalDimensionBar';
import { cn } from '@/lib/utils';

export interface EvaluationCardProps {
  evaluation: Evaluation & { dimensions: EvalDimension[] | unknown; targetUser?: { name: string | null } | null };
}

export function EvaluationCard({ evaluation }: EvaluationCardProps) {
  const score = evaluation.score ?? 0;

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-3 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-300">
          {evaluation.targetUser?.name ?? '参与者'}
        </span>
        <span className="text-[10px] text-muted-foreground">
          {new Date(evaluation.createdAt).toLocaleDateString('zh-CN')}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 shrink-0">
          <svg className="h-12 w-12 -rotate-90" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" className="text-slate-800" strokeWidth="4" />
            <circle
              cx="24" cy="24" r="20" fill="none"
              stroke="currentColor"
              className={cn(
                score >= 80 ? 'text-emerald-500' : score >= 60 ? 'text-amber-500' : 'text-red-500',
              )}
              strokeWidth="4"
              strokeDasharray={`${(score / 100) * 125.6} 125.6`}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-slate-200">
            {score}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground">综合评分</p>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{evaluation.summary}</p>
        </div>
      </div>

      {Array.isArray(evaluation.dimensions) && evaluation.dimensions.length > 0 && (
        <div className="space-y-2">
          {(evaluation.dimensions as unknown as EvalDimension[]).map((dim, i) => (
            <EvalDimensionBar key={i} dimension={dim} />
          ))}
        </div>
      )}
    </div>
  );
}