import { NextRequest, NextResponse } from 'next/server';
import { workspaceDb } from '@/lib/db/workspace';
import { createLogger } from '@/lib/logger';

const log = createLogger('WorkspaceAPI');

export async function GET(req: NextRequest) {
  // TODO: Get actual userId from auth session
  const userId = req.headers.get('x-user-id') ?? 'anonymous';

  const workspaces = await workspaceDb.listByUser(userId);
  return NextResponse.json({ workspaces });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.name) {
    return NextResponse.json({ error: 'name required' }, { status: 400 });
  }

  // TODO: Get actual userId from auth session
  const userId = body.userId ?? 'anonymous';

  const workspace = await workspaceDb.create({
    name: body.name,
    description: body.description,
    ownerId: userId,
  });

  return NextResponse.json({ success: true, workspace });
}
