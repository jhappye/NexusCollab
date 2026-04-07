import { NextRequest } from 'next/server';
import { taskDb } from '@/lib/db/task';
import { createLogger } from '@/lib/logger';

const log = createLogger('TaskRoomAPI');

// Allow streaming up to 120 seconds
export const maxDuration = 120;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;
  const encoder = new TextEncoder();

  // Verify task exists
  const task = await taskDb.getById(taskId);
  if (!task || !task.chatRoom) {
    return new Response('Task or chat room not found', { status: 404 });
  }

  const roomId = task.chatRoom.id;
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  // SSE heartbeat: 15s interval to prevent connection timeout
  const HEARTBEAT_INTERVAL_MS = 15_000;
  let heartbeatTimer: ReturnType<typeof setInterval> | null = null;

  const startHeartbeat = () => {
    stopHeartbeat();
    heartbeatTimer = setInterval(() => {
      try {
        writer.write(encoder.encode(`:heartbeat\n\n`)).catch(() => stopHeartbeat());
      } catch {
        stopHeartbeat();
      }
    }, HEARTBEAT_INTERVAL_MS);
  };

  const stopHeartbeat = () => {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
      heartbeatTimer = null;
    }
  };

  startHeartbeat();

  req.signal.addEventListener('abort', () => {
    stopHeartbeat();
    writer.close().catch(() => {});
  });

  try {
    // Send initial presence event
    const initEvent = { type: 'presence' as const, data: { userId: 'system', status: 'online' as const } };
    await writer.write(encoder.encode(`data: ${JSON.stringify(initEvent)}\n\n`));
  } catch {
    // Connection already closed
  }

  let writerClosed = false;
  writer.closed.then(() => { writerClosed = true; stopHeartbeat(); });

  // Keep-alive loop
  (async () => {
    try {
      while (true) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (writerClosed) break;
      }
    } catch {
      // Writer closed
    } finally {
      stopHeartbeat();
    }
  })();

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}