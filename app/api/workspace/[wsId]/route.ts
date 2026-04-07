import { NextRequest, NextResponse } from 'next/server';
import { workspaceDb } from '@/lib/db/workspace';
import { createLogger } from '@/lib/logger';

const log = createLogger('WorkspaceDetailAPI');

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ wsId: string }> }
) {
  const { wsId } = await params;
  const workspace = await workspaceDb.getById(wsId);
  if (!workspace) {
    return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
  }
  return NextResponse.json({ workspace });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ wsId: string }> }
) {
  const { wsId } = await params;
  const body = await req.json();

  try {
    const workspace = await workspaceDb.update(wsId, {
      name: body.name,
      description: body.description,
      logoUrl: body.logoUrl,
      timezone: body.timezone,
      onboardingComplete: body.onboardingComplete,
      agentConfig: body.agentConfig,
    });
    return NextResponse.json({ success: true, workspace });
  } catch {
    return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ wsId: string }> }
) {
  const { wsId } = await params;

  try {
    await workspaceDb.delete(wsId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
  }
}
