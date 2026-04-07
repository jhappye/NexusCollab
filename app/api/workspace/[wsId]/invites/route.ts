import { NextResponse } from 'next/server';

const inviteStore = new Map<string, { id: string; email: string; createdAt: Date }[]>();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ wsId: string }> }
) {
  const { wsId } = await params;
  const invites = inviteStore.get(wsId) ?? [];
  return NextResponse.json({ invites });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ wsId: string }> }
) {
  const { wsId } = await params;
  const { email } = await request.json();
  const id = crypto.randomUUID();
  const invite = { id, email, createdAt: new Date() };
  const existing = inviteStore.get(wsId) ?? [];
  inviteStore.set(wsId, [...existing, invite]);
  return NextResponse.json({ invites: inviteStore.get(wsId) }, { status: 201 });
}
