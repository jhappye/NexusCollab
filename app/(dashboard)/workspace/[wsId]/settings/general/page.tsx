'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SettingsLayout } from '@/components/workspace/settings-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const TIMEZONES = [
  'UTC', 'America/New_York', 'America/Los_Angeles', 'America/Chicago',
  'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Asia/Tokyo',
  'Asia/Shanghai', 'Asia/Singapore', 'Australia/Sydney',
];

interface Workspace {
  id: string;
  name: string;
  logoUrl: string | null;
  timezone: string;
}

export default function GeneralSettingsPage() {
  const { wsId } = useParams<{ wsId: string }>();
  const router = useRouter();
  const [name, setName] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/workspace/${wsId}`)
      .then(r => r.json())
      .then(d => {
        setName(d.workspace?.name ?? '');
        setTimezone(d.workspace?.timezone ?? 'UTC');
      });
  }, [wsId]);

  const handleSave = async () => {
    setSaving(true);
    await fetch(`/api/workspace/${wsId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, timezone }),
    });
    setSaving(false);
    router.refresh();
  };

  return (
    <SettingsLayout wsId={wsId} currentTab="general">
      <div className="space-y-6 max-w-lg">
        <div>
          <h2 className="text-lg font-semibold">通用设置</h2>
          <p className="text-sm text-muted-foreground">管理班级名称和偏好设置</p>
        </div>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">班级名称</label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="我的班级"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">时区</label>
            <select
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200"
              value={timezone}
              onChange={e => setTimezone(e.target.value)}
            >
              {TIMEZONES.map(tz => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>
          <Button onClick={handleSave} disabled={saving} size="sm">
            {saving ? '保存中...' : '保存更改'}
          </Button>
        </div>
      </div>
    </SettingsLayout>
  );
}