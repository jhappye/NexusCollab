import { NextResponse } from 'next/server';

export async function GET() {
  const configuredProviders: string[] = [];
  if (process.env.OPENAI_API_KEY) configuredProviders.push('openai');
  if (process.env.ANTHROPIC_API_KEY) configuredProviders.push('anthropic');
  if (process.env.GOOGLE_API_KEY) configuredProviders.push('google');
  if (process.env.DEEPSEEK_API_KEY) configuredProviders.push('deepseek');
  return NextResponse.json({ providers: configuredProviders });
}