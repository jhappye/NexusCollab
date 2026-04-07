import { MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThreadIndicatorProps {
  count: number;
  onExpand: () => void;
}

export function ThreadIndicator({ count, onExpand }: ThreadIndicatorProps) {
  return (
    <button
      onClick={onExpand}
      className={cn(
        'flex items-center gap-1 text-[10px] text-muted-foreground',
        'hover:text-foreground transition-colors',
      )}
    >
      <MessageSquare className="h-3 w-3" />
      {count} {count === 1 ? 'reply' : 'replies'}
    </button>
  );
}