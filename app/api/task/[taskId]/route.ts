import { NextRequest, NextResponse } from 'next/server';
import { taskDb } from '@/lib/db/task';
import { evaluationDb } from '@/lib/db/evaluation';
import { prisma } from '@/lib/db/client';
import { createLogger } from '@/lib/logger';

const log = createLogger('TaskAPI');

async function checkTaskPermission(taskId: string, userId: string, action: 'read' | 'write' | 'delete') {
  const task = await taskDb.getById(taskId);
  if (!task) return { allowed: false, task: null, reason: 'Task not found' };

  const membership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId: task.workspaceId,
        userId,
      },
    },
  });

  if (!membership) {
    return { allowed: false, task, reason: 'Not a member of workspace' };
  }

  switch (action) {
    case 'read':
      return { allowed: true, task, reason: null };
    case 'write':
      return { allowed: membership.role === 'ADMIN' || membership.role === 'MANAGER', task, reason: null };
    case 'delete':
      return { allowed: membership.role === 'ADMIN', task, reason: null };
    default:
      return { allowed: false, task, reason: 'Invalid action' };
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;
  const userId = req.headers.get('x-user-id') || 'anonymous';

  const { allowed, task, reason } = await checkTaskPermission(taskId, userId, 'read');
  if (!allowed) {
    return NextResponse.json({ error: reason }, { status: 404 });
  }
  return NextResponse.json({ task });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;
  const userId = req.headers.get('x-user-id') || 'anonymous';
  const body = await req.json();

  const { allowed, task: existing, reason } = await checkTaskPermission(taskId, userId, 'write');
  if (!allowed) {
    return NextResponse.json({ error: reason || 'Permission denied' }, { status: 403 });
  }

  const updated = await taskDb.update(taskId, {
    title: body.title,
    description: body.description,
    status: body.status,
    dueAt: body.dueAt ? new Date(body.dueAt) : undefined,
    agentConfig: body.agentConfig,
  });

  // Auto-trigger evaluation when task is completed
  if (existing?.chatRoom && existing.status !== 'COMPLETED' && body.status === 'COMPLETED') {
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
  const userId = req.headers.get('x-user-id') || 'anonymous';

  const { allowed, reason } = await checkTaskPermission(taskId, userId, 'delete');
  if (!allowed) {
    return NextResponse.json({ error: reason || 'Permission denied' }, { status: 403 });
  }

  try {
    await taskDb.delete(taskId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }
}
