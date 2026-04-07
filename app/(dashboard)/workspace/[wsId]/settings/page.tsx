import { redirect } from 'next/navigation';
import { useParams } from 'next/navigation';

export default function SettingsPage() {
  const { wsId } = useParams<{ wsId: string }>();
  redirect(`/workspace/${wsId}/settings/general`);
}
