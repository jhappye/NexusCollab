'use client';

import { useState } from 'react';
import type { MessageWithAuthor, Reaction } from '@/lib/types/task-chat';
import { cn } from '@/lib/utils';
import { MessageSquare } from 'lucide-react';

interface MessageBubbleProps {
  message: MessageWithAuthor;
  depth?: number;
  onReply?: (parentId: string) => void;
  onReact?: (messageId: string, emoji: string) => void;
}

const MAX_DEPTH_INDENT = 4;
const INDENT_PX = 16;

export function MessageBubble({ message, depth = 0, onReply, onReact }: MessageBubbleProps) {
  const isHuman = message.authorType === 'HUMAN';
  const agentRole = message.agentRole;

  const roleBorderColor = {
    EVALUATOR: 'border-l-indigo-500',
    COACH: 'border-l-emerald-500',
    PEER: 'border-l-violet-500',
  }[agentRole ?? 'EVALUATOR'] ?? '';

  const depthIndent = Math.min(depth, MAX_DEPTH_INDENT) * INDENT_PX;

  return (
    <div
      className={cn('flex flex-col', isHuman ? 'items-end' : 'items-start')}
      style={{ marginLeft: depthIndent }}
    >
      {/* Author label */}
      <div className={cn('flex items-center gap-1.5 mb-1', isHuman && 'flex-row-reverse')}>
        <span className="text-[10px] font-medium text-muted-foreground">
          {message.author.name ?? '未知用户'}
        </span>
        {agentRole && (
          <span
            className={cn(
              'text-[9px] font-medium px-1.5 py-0.5 rounded-full',
              agentRole === 'EVALUATOR' && 'bg-indigo-500/20 text-indigo-400',
              agentRole === 'COACH' && 'bg-emerald-500/20 text-emerald-400',
              agentRole === 'PEER' && 'bg-violet-500/20 text-violet-400',
            )}
          >
            {agentRole === 'EVALUATOR' ? '评价者' : agentRole === 'COACH' ? '教练' : '同伴'}
          </span>
        )}
        {message.isEdited && (
          <span className="text-[9px] text-muted-foreground">(已编辑)</span>
        )}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          'rounded-xl px-3 py-2 text-sm max-w-[85%] whitespace-pre-wrap',
          isHuman
            ? 'bg-indigo-500 text-white'
            : 'bg-slate-800 text-slate-100 border-l-[3px] ' + roleBorderColor,
        )}
      >
        {message.content}
      </div>

      {/* Reactions + reply count */}
      <div className={cn('flex items-center gap-2 mt-0.5', isHuman && 'flex-row-reverse')}>
        {message.reactions.length > 0 && (
          <div className="flex items-center gap-1">
            {message.reactions.map((r) => (
              <button
                key={r.emoji}
                onClick={() => onReact?.(message.id, r.emoji)}
                className="flex items-center gap-0.5 rounded-full bg-slate-800/60 px-1.5 py-0.5 text-xs hover:bg-slate-700"
              >
                <span>{r.emoji}</span>
                <span className="text-muted-foreground">{r.userIds.length}</span>
              </button>
            ))}
          </div>
        )}

        {(message.replies?.length ?? 0) > 0 && (
          <button
            onClick={() => onReply?.(message.id)}
            className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground"
          >
            <MessageSquare className="h-3 w-3" />
            {message.replies?.length} 条回复
          </button>
        )}

        <button
          onClick={() => onReply?.(message.id)}
          className="text-[10px] text-muted-foreground hover:text-foreground"
        >
          回复
        </button>
      </div>

      {/* Nested replies */}
      {message.replies?.map((reply) => (
        <MessageBubble
          key={reply.id}
          message={reply}
          depth={depth + 1}
          onReply={onReply}
          onReact={onReact}
        />
      ))}
    </div>
  );
}