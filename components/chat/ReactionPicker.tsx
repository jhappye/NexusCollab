'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

const EMOJIS = ['👍', '👎', '😂', '😮', '❤️', '🚀', '🎉', '👀'];

interface ReactionPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

export function ReactionPicker({ onSelect, onClose }: ReactionPickerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute bottom-full mb-1 z-10 rounded-lg border border-slate-700 bg-slate-800 p-2 shadow-lg"
    >
      <div className="flex gap-1">
        {EMOJIS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => { onSelect(emoji); onClose(); }}
            className="h-7 w-7 rounded hover:bg-slate-700 flex items-center justify-center text-sm transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}