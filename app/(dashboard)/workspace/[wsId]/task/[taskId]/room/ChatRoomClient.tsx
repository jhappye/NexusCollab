'use client';

import { useState } from 'react';
import { MessageStream } from '@/components/chat/MessageStream';
import { ChatInput } from '@/components/chat/ChatInput';
import { EvaluatorSidebar } from '@/components/chat/EvaluatorSidebar';
import { ParticipantList } from '@/components/chat/ParticipantList';
import type { MessageWithAuthor, Participant } from '@/lib/types/task-chat';
import type { Evaluation } from '@prisma/client';

interface ChatRoomClientProps {
  task: {
    id: string;
    title: string;
    status: string;
  };
  initialMessages: MessageWithAuthor[];
  evaluations: Evaluation[];
  participants: Participant[];
}

export default function ChatRoomClient({
  task,
  initialMessages,
  evaluations,
  participants,
}: ChatRoomClientProps) {
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleSend = async (content: string, parentId?: string) => {
    const res = await fetch(`/api/task/${task.id}/room/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, parentId }),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.error ?? 'Failed to send message');
    }
    setReplyTo(null);
  };

  const handleReply = (parentId: string) => {
    setReplyTo(parentId);
  };

  const handleReact = async (messageId: string, emoji: string) => {
    await fetch(`/api/task/${task.id}/room/messages/${messageId}/reactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emoji }),
    });
  };

  const handleRunEvaluation = async () => {
    setIsEvaluating(true);
    try {
      const res = await fetch('/api/evaluation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: task.id }),
      });
      const data = await res.json();
      if (!res.ok) alert(data.error ?? 'Evaluation failed');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
      <EvaluatorSidebar
        taskId={task.id}
        evaluations={evaluations}
        onRunEvaluation={handleRunEvaluation}
        isEvaluating={isEvaluating}
      />

      <div className="flex flex-1 flex-col min-w-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
          <h1 className="text-sm font-semibold text-slate-200 truncate">{task.title}</h1>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              task.status === 'ACTIVE'
                ? 'bg-indigo-500/20 text-indigo-400'
                : task.status === 'COMPLETED'
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-slate-700 text-slate-400'
            }`}
          >
            {task.status}
          </span>
        </div>

        <MessageStream
          initialMessages={initialMessages}
          onReply={handleReply}
          onReact={handleReact}
        />

        <ChatInput
          onSend={handleSend}
          replyTo={replyTo}
          onCancelReply={() => setReplyTo(null)}
          disabled={task.status !== 'ACTIVE'}
        />
      </div>

      <ParticipantList participants={participants} />
    </div>
  );
}