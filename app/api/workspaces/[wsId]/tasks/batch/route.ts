import { NextRequest, NextResponse } from 'next/server';
import { taskDb } from '@/lib/db/task';
import { prisma } from '@/lib/db/client';
import { createLogger } from '@/lib/logger';
import type { TaskStatus } from '@prisma/client';

const log = createLogger('BatchTasksAPI');

async function checkWorkspacePermission(workspaceId: string, userId: string, action: 'write' | 'delete'): Promise<boolean> {
  const membership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId,
      },
    },
  });

  if (!membership) return false;

  if (action === 'write') {
    return membership.role === 'ADMIN' || membership.role === 'MANAGER';
  }
  return membership.role === 'ADMIN';
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ wsId: string }> }
) {
  const { wsId } = await params;
  const userId = req.headers.get('x-user-id') || 'anonymous';
  const body = await req.json();
  const { taskIds, action, status } = body;

  if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
    return NextResponse.json({ error: 'taskIds required' }, { status: 400 });
  }

  const hasPermission = await checkWorkspacePermission(wsId, userId, 'write');
  if (!hasPermission) {
    return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
  }

  if (action === 'updateStatus' && status) {
    for (const taskId of taskIds) {
      const task = await taskDb.getById(taskId);
      if (!task || task.workspaceId !== wsId) continue;

      const validTransitions: Record<string, string | null> = {
        DRAFT: 'ACTIVE',
        ACTIVE: 'REVIEWING',
        REVIEWING: 'COMPLETED',
        COMPLETED: null,
      };

      if (validTransitions[task.status] !== status) {
        return NextResponse.json(
          { error: `Invalid status transition from ${task.status} to ${status}` },
          { status: 400 }
        );
      }
    }

    for (const taskId of taskIds) {
      await taskDb.update(taskId, { status: status as TaskStatus });
    }

    return NextResponse.json({ success: true, updated: taskIds.length });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ wsId: string }> }
) {
  const { wsId } = await params;
  const userId = req.headers.get('x-user-id') || 'anonymous';
  const body = await req.json();
  const { taskIds } = body;

  if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
    return NextResponse.json({ error: 'taskIds required' }, { status: 400 });
  }

  const hasPermission = await checkWorkspacePermission(wsId, userId, 'delete');
  if (!hasPermission) {
    return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
  }

  let deleted = 0;
  for (const taskId of taskIds) {
    const task = await taskDb.getById(taskId);
    if (!task || task.workspaceId !== wsId) continue;

    try {
      await taskDb.delete(taskId);
      deleted++;
    } catch (err) {
      log.warn('Failed to delete task', taskId, err);
    }
  }

  return NextResponse.json({ success: true, deleted });
}
