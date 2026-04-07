import { cn } from '@/lib/utils';

interface EmptyStateProps {
  type: 'tasks' | 'messages' | 'evaluations';
  className?: string;
}

const content = {
  tasks: {
    heading: 'No tasks yet',
    subtext: 'Create your first task to get started',
  },
  messages: {
    heading: 'No messages yet',
    subtext: 'Be the first to contribute to this discussion',
  },
  evaluations: {
    heading: 'No evaluations yet',
    subtext: 'Evaluations will appear here once the AI reviews contributions',
  },
} as const;

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      <path d="M5 19l.5 1.5L7 21l-1.5.5L5 23l-.5-1.5L3 21l1.5-.5L5 19z" />
      <path d="M19 13l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5L17 15l1.5-.5-.5-1.5z" />
    </svg>
  );
}

function TasksIcon() {
  return (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Clipboard base */}
      <rect x="20" y="14" width="40" height="52" rx="4" />
      {/* Clipboard top */}
      <path d="M30 14V10a4 4 0 018 0v4" />
      <rect x="28" y="10" width="24" height="6" rx="2" />
      {/* Checkboxes */}
      <rect x="28" y="28" width="10" height="10" rx="2" />
      <path d="M30.5 33l2 2 4-4" />
      <path d="M42 33h10" />
      <rect x="28" y="44" width="10" height="10" rx="2" />
      <path d="M30.5 49l2 2 4-4" />
      <path d="M42 49h10" />
      {/* Sparkle */}
      <SparkleIcon className="absolute -top-1 -right-1 w-5 h-5 text-slate-400" />
    </svg>
  );
}

function MessagesIcon() {
  return (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Main bubble */}
      <path d="M14 20a6 6 0 016-6h36a6 6 0 016 6v24a6 6 0 01-6 6H30l-8 8V46a6 6 0 01-6-6V20z" />
      {/* Bubble tail */}
      <path d="M22 46l-6 8v-4a6 6 0 016-6" />
      {/* Lines in bubble */}
      <path d="M26 30h20" />
      <path d="M26 38h14" />
      {/* Sparkle */}
      <SparkleIcon className="absolute -top-1 -right-1 w-5 h-5 text-slate-400" />
    </svg>
  );
}

function EvaluationsIcon() {
  return (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Chart axes */}
      <path d="M16 60V20" />
      <path d="M16 60h44" />
      {/* Bars */}
      <rect x="22" y="44" width="8" height="16" rx="2" />
      <rect x="36" y="32" width="8" height="28" rx="2" />
      <rect x="50" y="22" width="8" height="38" rx="2" />
      {/* Sparkle */}
      <SparkleIcon className="absolute -top-1 -right-1 w-5 h-5 text-slate-400" />
    </svg>
  );
}

const icons = {
  tasks: TasksIcon,
  messages: MessagesIcon,
  evaluations: EvaluationsIcon,
} as const;

export function EmptyState({ type, className }: EmptyStateProps) {
  const { heading, subtext } = content[type];
  const Icon = icons[type];

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-12 text-center', className)}>
      <div className="relative w-20 h-20 text-slate-400">
        <Icon />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{heading}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{subtext}</p>
      </div>
    </div>
  );
}
