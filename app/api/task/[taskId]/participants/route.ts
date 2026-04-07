import { NextRequest, NextResponse } from 'next/server';
import { taskDb } from '@/lib/db/task';
import { createLogger } from '@/lib/logger';

const log = createLogger('TaskParticipantsAPI');

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;

  const task = await taskDb.getById(taskId);
  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  // Return workspace members as participants
  const participants = task.workspace.members.map((m) => ({
    id: m.user.id,
    name: m.user.name ?? m.user.email,
    avatarUrl: m.user.avatarUrl,
    role: m.role,
  }));

  return NextResponse.json({ participants });
}