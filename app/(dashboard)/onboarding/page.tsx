'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Provider {
  id: string;
  name: string;
}

interface Invite {
  email: string;
  id: string;
}

const STEPS = [
  { id: 1, title: 'Name your workspace' },
  { id: 2, title: 'Invite members' },
  { id: 3, title: 'Configure AI agents' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const wsId = searchParams.get('wsId');

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Workspace name and logo
  const [workspaceName, setWorkspaceName] = useState('');

  // Step 2: Invites
  const [inviteEmail, setInviteEmail] = useState('');
  const [invites, setInvites] = useState<Invite[]>([]);

  // Step 3: AI config
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [modelName, setModelName] = useState('');
  const [apiKey, setApiKey] = useState('');

  // Redirect if no wsId
  useEffect(() => {
    if (!wsId) {
      router.push('/onboarding');
    }
  }, [wsId, router]);

  // Fetch providers on mount
  useEffect(() => {
    async function loadProviders() {
      try {
        const res = await fetch('/api/config/providers');
        if (res.ok) {
          const data = await res.json();
          const providerList: Provider[] = (data.providers as string[]).map((p: string) => ({
            id: p,
            name: p.charAt(0).toUpperCase() + p.slice(1),
          }));
          setProviders(providerList);
          if (providerList.length > 0) {
            setSelectedProvider(providerList[0].id);
          }
        }
      } catch {
        // silently fail, providers remain empty
      }
    }
    loadProviders();
  }, []);

  const handleAddInvite = () => {
    const email = inviteEmail.trim();
    if (!email || invites.some((i) => i.email === email)) return;
    setInvites([...invites, { email, id: `invite-${Date.now()}` }]);
    setInviteEmail('');
  };

  const handleRemoveInvite = (id: string) => {
    setInvites(invites.filter((i) => i.id !== id));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!workspaceName.trim()) {
      setError('Workspace name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const res = await fetch(`/api/workspace/${wsId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: workspaceName,
          logoUrl: '',
          timezone,
          onboardingComplete: true,
          agentConfig: {
            provider: selectedProvider,
            model: modelName,
            apiKey,
          },
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update workspace');
      }

      router.push(`/workspace/${wsId}`);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!wsId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Workspace Onboarding</CardTitle>
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {STEPS.map((step, idx) => (
              <div key={step.id} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    currentStep >= step.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step.id}
                </div>
                <span
                  className={`text-sm hidden sm:block ${
                    currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {step.title}
                </span>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`w-8 h-px ${
                      currentStep > step.id ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <div className="text-sm text-red-500 text-center">{error}</div>
          )}

          {/* Step 1: Name workspace */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="wsName">Workspace name</Label>
                <Input
                  id="wsName"
                  placeholder="My Awesome Workspace"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wsLogo">Logo URL (optional)</Label>
                <Input
                  id="wsLogo"
                  placeholder="https://example.com/logo.png"
                  disabled
                  title="Logo upload coming soon"
                />
                <p className="text-xs text-muted-foreground">
                  Logo upload coming soon
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Invite members */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="inviteEmail">Email address</Label>
                <div className="flex gap-2">
                  <Input
                    id="inviteEmail"
                    type="email"
                    placeholder="colleague@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddInvite();
                      }
                    }}
                  />
                  <Button onClick={handleAddInvite} variant="outline">
                    Add
                  </Button>
                </div>
              </div>

              {invites.length > 0 && (
                <div className="space-y-2">
                  <Label>Pending invites</Label>
                  <ul className="space-y-2">
                    {invites.map((invite) => (
                      <li
                        key={invite.id}
                        className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/50 text-sm"
                      >
                        <span>{invite.email}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveInvite(invite.id)}
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {invites.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No invites added yet. You can skip this step.
                </p>
              )}
            </div>
          )}

          {/* Step 3: Configure AI agents */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="provider">LLM Provider</Label>
                <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                  <SelectTrigger id="provider">
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {providers.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        {provider.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="modelName">Model name</Label>
                <Input
                  id="modelName"
                  placeholder="e.g., gpt-4o, claude-3-opus"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              Back
            </Button>
            {currentStep < 3 ? (
              <Button onClick={handleNext}>Continue</Button>
            ) : (
              <Button onClick={handleComplete} disabled={loading}>
                {loading ? 'Saving...' : 'Complete Setup'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
