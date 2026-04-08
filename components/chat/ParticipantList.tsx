'use client';

import type { Participant } from '@/lib/types/task-chat';

interface ParticipantListProps {
  participants: Participant[];
}

export function ParticipantList({ participants }: ParticipantListProps) {
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN': return '管理员';
      case 'MEMBER': return '成员';
      case 'OWNER': return '所有者';
      default: return role;
    }
  };

  return (
    <aside className="w-[240px] shrink-0 border-l border-slate-800 bg-slate-900/50 overflow-y-auto">
      <div className="p-4 space-y-3">
        <h2 className="text-sm font-semibold text-slate-200">参与者</h2>
        <div className="space-y-2">
          {participants.map((p) => (
            <div key={p.id} className="flex items-center gap-2">
              <div className="relative shrink-0">
                {p.avatarUrl ? (
                  <img src={p.avatarUrl} alt={p.name ?? ''} className="h-7 w-7 rounded-full" />
                ) : (
                  <div className="h-7 w-7 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-medium text-indigo-400">
                    {p.name?.[0] ?? '?'}
                  </div>
                )}
                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-1 ring-slate-900" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-300 truncate">{p.name ?? '未知用户'}</p>
                <p className="text-[10px] text-muted-foreground">{getRoleLabel(p.role)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}