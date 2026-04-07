'use client';

import type { Evaluation } from '@prisma/client';
import type { EvalDimension } from '@/lib/types/task-chat';
import { EvaluationCard } from './EvaluationCard';
import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';

interface EvaluatorSidebarProps {
  taskId: string;
  evaluations: (Evaluation & { targetUser?: { name: string | null } | null })[];
  onRunEvaluation: () => void;
  isEvaluating: boolean;
}

export function EvaluatorSidebar({
  evaluations,
  onRunEvaluation,
  isEvaluating,
}: EvaluatorSidebarProps) {
  const latestEval = evaluations[0];

  return (
    <aside className="w-[260px] shrink-0 border-r border-slate-800 bg-slate-900/50 overflow-y-auto">
      <div className="p-4 space-y-4">
        <h2 className="text-sm font-semibold text-slate-200">Evaluator</h2>

        {latestEval ? (
          <EvaluationCard
            evaluation={{
              ...latestEval,
              dimensions: (latestEval.dimensions as unknown as EvalDimension[] | null) ?? [],
            }}
          />
        ) : (
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-3 text-center">
            <p className="text-xs text-muted-foreground">
              No evaluations yet
            </p>
          </div>
        )}

        <Button
          onClick={onRunEvaluation}
          disabled={isEvaluating}
          className="w-full"
          variant="outline"
        >
          <PlayCircle className="h-4 w-4 mr-2" />
          {isEvaluating ? 'Running...' : 'Run Evaluation'}
        </Button>

        {evaluations.length > 1 && (
          <div className="space-y-2">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              History
            </h3>
            {evaluations.slice(1).map((eval_) => (
              <div
                key={eval_.id}
                className="rounded-lg border border-slate-800 bg-slate-900 p-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {eval_.targetUser?.name ?? 'Unknown'}
                  </span>
                  {eval_.score !== null && (
                    <span className="text-xs font-medium text-indigo-400">
                      {eval_.score}/100
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                  {new Date(eval_.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}