import { NextRequest, NextResponse } from 'next/server';
import { taskDb } from '@/lib/db/task';
import { evaluationDb } from '@/lib/db/evaluation';
import { createLogger } from '@/lib/logger';

const log = createLogger('EvaluationAPI');

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.taskId) {
    return NextResponse.json({ error: 'taskId required' }, { status: 400 });
  }

  const task = await taskDb.getById(body.taskId);
  if (!task || !task.chatRoom) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  // If targetUserId provided, evaluate specific user; otherwise evaluate all members
  if (body.targetUserId) {
    const evaluation = await evaluationDb.create({
      roomId: task.chatRoom.id,
      taskId: body.taskId,
      targetUserId: body.targetUserId,
      agentId: body.agentId ?? 'manual-evaluator',
      summary: 'Manual evaluation triggered',
      dimensions: [],
    });
    return NextResponse.json({ success: true, evaluationId: evaluation.id, status: 'ready' });
  }

  // Evaluate all workspace members
  const memberIds = task.workspace?.members.map((m) => m.userId) ?? [];
  const evaluationIds: string[] = [];

  for (const memberId of memberIds) {
    const evaluation = await evaluationDb.create({
      roomId: task.chatRoom.id,
      taskId: body.taskId,
      targetUserId: memberId,
      agentId: body.agentId ?? 'manual-evaluator',
      summary: 'Manual evaluation triggered',
      dimensions: [],
    });
    evaluationIds.push(evaluation.id);
  }

  return NextResponse.json({
    success: true,
    evaluationIds,
    status: 'processing',
  });
}
