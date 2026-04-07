import { NextRequest, NextResponse } from 'next/server';
import { evaluationDb } from '@/lib/db/evaluation';
import { createLogger } from '@/lib/logger';

const log = createLogger('EvaluationListAPI');

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;
  const evaluations = await evaluationDb.getByTask(taskId);
  return NextResponse.json({ evaluations });
}
