import { NextRequest, NextResponse } from 'next/server';
import { taskDb } from '@/lib/db/task';
import { createLogger } from '@/lib/logger';
import type { TaskStatus } from '@prisma/client';

const log = createLogger('WorkspaceTasksAPI');

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ wsId: string }> }
) {
  const { wsId } = await params;
  const { searchParams } = new URL(req.url);
  const statusParam = searchParams.get('status');
  const status = statusParam as TaskStatus | undefined;

  const tasks = await taskDb.listByWorkspace(wsId, status);
  return NextResponse.json({ tasks });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ wsId: string }> }
) {
  const { wsId } = await params;
  const body = await req.json();

  if (!body.prompt) {
    return NextResponse.json({ error: 'prompt required' }, { status: 400 });
  }

  // TODO: Get actual userId from auth session
  const userId = body.userId ?? 'anonymous';

  // AI-assisted task creation: call LLM to generate title + description + agentConfig
  // Fallback to user prompt if AI fails
  let title = body.prompt.slice(0, 80) || '新任务';
  let description = body.prompt;
  let agentConfig = {
    evaluatorId: 'default-evaluator',
    evaluatorName: 'Evaluator',
    evaluatorPrompt: 'You are an expert evaluator.',
    coachingEnabled: true,
    peerAgents: [],
  };
  let generationStatus = 'ready';

  try {
    const { resolveModel } = await import('@/lib/server/resolve-model');
    const { generateText } = await import('ai');

    const { model: languageModel } = resolveModel({} as any);

    const { text } = await generateText({
      model: languageModel as any,
      prompt: `Based on this user request: "${body.prompt}"
Generate a task JSON with fields:
- title: clear task name (max 80 chars)
- description: 2-3 sentence description
- agentConfig: { evaluatorId, evaluatorName, evaluatorPrompt, coachingEnabled, peerAgents[] }

Return only valid JSON, no markdown formatting.`,
    });

    const parsed = JSON.parse(text);
    if (parsed.title) title = parsed.title;
    if (parsed.description) description = parsed.description;
    if (parsed.agentConfig) agentConfig = { ...agentConfig, ...parsed.agentConfig };
  } catch (err) {
    log.warn('AI task generation failed, using user prompt as title:', err);
    generationStatus = 'partial';
  }

  const task = await taskDb.create({
    workspaceId: wsId,
    title,
    description,
    createdBy: userId,
    agentConfig,
  });

  return NextResponse.json({ success: true, task, generationStatus });
}
