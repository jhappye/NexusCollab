'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SettingsLayout } from '@/components/workspace/settings-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const PROVIDERS = ['OpenAI', 'Anthropic', 'DeepSeek', 'Gemini'] as const;
type Provider = (typeof PROVIDERS)[number];

interface AgentConfig {
  provider: Provider;
  model: string;
  temperature: number;
  systemPrompt: string;
}

interface Workspace {
  id: string;
  name: string;
  agentConfig: AgentConfig | null;
}

export default function AgentsSettingsPage() {
  const { wsId } = useParams<{ wsId: string }>();
  const router = useRouter();
  const [workspaceName, setWorkspaceName] = useState('');
  const [provider, setProvider] = useState<Provider>('OpenAI');
  const [model, setModel] = useState('');
  const [temperature, setTemperature] = useState([0.7]);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/workspace/${wsId}`)
      .then(r => r.json())
      .then(d => {
        const ws: Workspace = d.workspace;
        setWorkspaceName(ws?.name ?? '');
        if (ws?.agentConfig) {
          setProvider(ws.agentConfig.provider);
          setModel(ws.agentConfig.model);
          setTemperature([ws.agentConfig.temperature]);
          setSystemPrompt(ws.agentConfig.systemPrompt);
        }
      });
  }, [wsId]);

  const handleSave = async () => {
    setSaving(true);
    await fetch(`/api/workspace/${wsId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: workspaceName,
        agentConfig: {
          provider,
          model,
          temperature: temperature[0],
          systemPrompt,
        },
      }),
    });
    setSaving(false);
    router.refresh();
  };

  return (
    <SettingsLayout wsId={wsId} currentTab="agents">
      <div className="space-y-6 max-w-lg">
        <div>
          <h2 className="text-lg font-semibold">Agent Settings</h2>
          <p className="text-sm text-muted-foreground">
            Configure the AI agent provider and behavior for this workspace.
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Provider</label>
            <Select
              value={provider}
              onValueChange={(v: Provider) => setProvider(v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROVIDERS.map(p => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Model</label>
            <Input
              value={model}
              onChange={e => setModel(e.target.value)}
              placeholder="e.g., gpt-4o, claude-3-5-sonnet-20241022"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">
              Temperature: {temperature[0].toFixed(2)}
            </label>
            <Slider
              value={temperature}
              onValueChange={setTemperature}
              min={0}
              max={1}
              step={0.01}
              className="py-2"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">System Prompt</label>
            <Textarea
              value={systemPrompt}
              onChange={e => setSystemPrompt(e.target.value)}
              placeholder="You are a helpful AI teaching assistant..."
              className="min-h-32"
            />
          </div>
          <Button onClick={handleSave} disabled={saving} size="sm">
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </SettingsLayout>
  );
}