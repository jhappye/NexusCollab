import { SettingsLayout } from '@/components/workspace/settings-layout';
import { CreditCard } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function BillingSettingsPage() {
  const { wsId } = useParams<{ wsId: string }>();

  return (
    <SettingsLayout wsId={wsId ?? ''} currentTab="billing">
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 mb-4">
          <CreditCard className="h-6 w-6 text-slate-400" />
        </div>
        <h2 className="text-lg font-semibold">Billing</h2>
        <p className="text-sm text-muted-foreground mt-1">Billing integration coming soon.</p>
      </div>
    </SettingsLayout>
  );
}
