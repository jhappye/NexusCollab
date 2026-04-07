'use client';

import { useParams, useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { wsId } = useParams<{ wsId: string }>();
  const router = useRouter();
  router.push(`/workspace/${wsId}/settings/general`);
  return null;
}
