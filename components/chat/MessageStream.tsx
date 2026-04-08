'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import type { MessageWithAuthor, RoomEvent } from '@/lib/types/task-chat';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';

interface MessageStreamProps {
  initialMessages: MessageWithAuthor[];
  onReply?: (parentId: string) => void;
  onReact?: (messageId: string, emoji: string) => void;
}

export function MessageStream({ initialMessages, onReply, onReact }: MessageStreamProps) {
  const params = useParams();
  const taskId = params.taskId as string;
  const [messages, setMessages] = useState<MessageWithAuthor[]>(initialMessages);
  const [typingAgents, setTypingAgents] = useState<Array<{ agentId: string; agentName: string }>>([]);
  const [threadingParent, setThreadingParent] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // SSE subscription
  useEffect(() => {
    const eventSource = new EventSource(`/api/task/${taskId}/room`);

    eventSource.onmessage = (event) => {
      const data: RoomEvent = JSON.parse(event.data);

      if (data.type === 'message') {
        setMessages((prev) => [...prev, data.data]);
      } else if (data.type === 'typing_start') {
        setTypingAgents((prev) => {
          if (prev.find((a) => a.agentId === data.data.agentId)) return prev;
          return [...prev, data.data];
        });
      } else if (data.type === 'typing_stop') {
        setTypingAgents((prev) => prev.filter((a) => a.agentId !== data.data.agentId));
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
      // In Phase 2, we could add reconnection logic here
      // For now, the connection will remain closed on error
    };

    return () => eventSource.close();
  }, [taskId]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleReply = (parentId: string) => {
    setThreadingParent((prev) => (prev === parentId ? null : parentId));
    onReply?.(parentId);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 && (
        <div className="flex justify-center">
          <span className="text-xs text-muted-foreground">
            暂无消息，开始对话吧！
          </span>
        </div>
      )}

      {messages.map((msg) => (
        <div key={msg.id}>
          <MessageBubble
            message={msg}
            depth={0}
            onReply={handleReply}
            onReact={onReact}
          />
        </div>
      ))}

      {typingAgents.map((agent) => (
        <TypingIndicator key={agent.agentId} agentName={agent.agentName} />
      ))}

      {threadingParent && (
        <div className="text-xs text-muted-foreground text-center py-1">
          回复中 — <button onClick={() => setThreadingParent(null)} className="underline">取消</button>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}