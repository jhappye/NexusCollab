import { NextRequest, NextResponse } from 'next/server';
import { taskDb } from '@/lib/db/task';
import { messageDb } from '@/lib/db/message';
import { prisma } from '@/lib/db/client';
import { createLogger } from '@/lib/logger';

const log = createLogger('TaskRoomMessagesAPI');

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get('cursor') ?? undefined;
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);

  const task = await taskDb.getById(taskId);
  if (!task || !task.chatRoom) {
    return NextResponse.json({ error: 'Task or chat room not found' }, { status: 404 });
  }

  const result = await messageDb.getMessages(task.chatRoom.id, cursor, limit);
  return NextResponse.json(result);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;
  const body = await req.json();

  const task = await taskDb.getById(taskId);
  if (!task || !task.chatRoom) {
    return NextResponse.json({ error: 'Task or chat room not found' }, { status: 404 });
  }

  if (task.status === 'COMPLETED') {
    return NextResponse.json({ error: 'Task is completed, cannot send messages' }, { status: 400 });
  }

  // TODO: Get actual userId from auth session
  const userId = body.userId ?? 'anonymous';

  // Ensure user exists (anonymous user for now)
  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId, email: `${userId}@example.com`, name: userId },
  });

  const message = await messageDb.create({
    roomId: task.chatRoom.id,
    authorId: userId,
    authorType: 'HUMAN',
    content: body.content,
    contentType: body.contentType ?? 'TEXT',
    parentId: body.parentId,
  });

  return NextResponse.json({ success: true, message });
}