import { NextRequest, NextResponse } from 'next/server';
import { taskDb } from '@/lib/db/task';
import { evaluationDb } from '@/lib/db/evaluation';
import { createLogger } from '@/lib/logger';

const log = createLogger('TaskAPI');

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;
  const task = await taskDb.getById(taskId);
  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }
  return NextResponse.json({ task });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;
  const body = await req.json();

  const existing = await taskDb.getById(taskId);
  if (!existing) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  const updated = await taskDb.update(taskId, {
    title: body.title,
    description: body.description,
    status: body.status,
    dueAt: body.dueAt ? new Date(body.dueAt) : undefined,
    agentConfig: body.agentConfig,
  });

  // Auto-trigger evaluation when task is completed
  if (existing.chatRoom && existing.status !== 'COMPLETED' && body.status === 'COMPLETED') {
    const memberIds = existing.workspace?.members.map((m) => m.userId) ?? [];
    for (const memberId of memberIds) {
      try {
        await evaluationDb.create({
          roomId: existing.chatRoom.id,
          taskId,
          targetUserId: memberId,
          agentId: 'system',
          summary: 'Auto-evaluation triggered on task completion',
          dimensions: [],
        });
      } catch (err) {
        log.warn('Auto-evaluation failed for user', memberId, err);
      }
    }
  }

  return NextResponse.json({ success: true, task: updated });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;

  try {
    await taskDb.delete(taskId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }
}
