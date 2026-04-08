'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (content: string, parentId?: string) => void;
  disabled?: boolean;
  replyTo?: string | null;
  onCancelReply?: () => void;
}

export function ChatInput({ onSend, disabled, replyTo, onCancelReply }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (!input.trim()) return;
    onSend(input.trim(), replyTo ?? undefined);
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-slate-800 p-3">
      {replyTo && (
        <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
          <span>回复中</span>
          <button onClick={onCancelReply} className="underline hover:text-foreground">
            取消
          </button>
        </div>
      )}

      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入消息..."
          disabled={disabled}
          rows={1}
          className={cn(
            'flex-1 resize-none rounded-lg border border-slate-700 bg-slate-800/50',
            'px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500/50',
            'disabled:opacity-50',
          )}
        />
        <button
          onClick={handleSubmit}
          disabled={!input.trim() || disabled}
          className={cn(
            'shrink-0 h-9 w-9 rounded-lg flex items-center justify-center transition-all',
            'bg-indigo-500 text-white hover:bg-indigo-400',
            'disabled:opacity-40 disabled:cursor-not-allowed',
          )}
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}