import { NextRequest, NextResponse } from 'next/server';
import { messageDb } from '@/lib/db/message';
import { createLogger } from '@/lib/logger';

const log = createLogger('MessageReactionsAPI');

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ msgId: string }> }
) {
  const { msgId } = await params;
  const body = await req.json();

  if (!body.emoji) {
    return NextResponse.json({ error: 'emoji required' }, { status: 400 });
  }

  // TODO: Get actual userId from auth session
  const userId = body.userId ?? 'anonymous';

  try {
    const reactions = await messageDb.addReaction(msgId, { emoji: body.emoji, userId });
    return NextResponse.json({ success: true, reactions });
  } catch {
    return NextResponse.json({ error: 'Message not found' }, { status: 404 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ msgId: string }> }
) {
  const { msgId } = await params;
  const { searchParams } = new URL(req.url);
  const emoji = searchParams.get('emoji');
  const body = await req.json().catch(() => ({}));

  if (!emoji) {
    return NextResponse.json({ error: 'emoji required' }, { status: 400 });
  }

  // TODO: Get actual userId from auth session
  const userId = body.userId ?? 'anonymous';

  try {
    const reactions = await messageDb.removeReaction(msgId, emoji, userId);
    return NextResponse.json({ success: true, reactions });
  } catch {
    return NextResponse.json({ error: 'Message not found' }, { status: 404 });
  }
}