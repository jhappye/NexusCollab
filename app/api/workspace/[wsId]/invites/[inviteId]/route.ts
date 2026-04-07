import { NextResponse } from 'next/server';

const inviteStore = new Map<string, { id: string; email: string; createdAt: Date }[]>();

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ wsId: string; inviteId: string }> }
) {
  const { wsId, inviteId } = await params;
  const existing = inviteStore.get(wsId) ?? [];
  inviteStore.set(wsId, existing.filter(i => i.id !== inviteId));
  return NextResponse.json({ success: true });
}
