import { NextRequest, NextResponse } from 'next/server';
import { taskDb } from '@/lib/db/task';
import { messageDb } from '@/lib/db/message';
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

  if (task.status !== 'ACTIVE') {
    return NextResponse.json({ error: 'Task is not active' }, { status: 400 });
  }

  // TODO: Get actual userId from auth session
  const userId = body.userId ?? 'anonymous';

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