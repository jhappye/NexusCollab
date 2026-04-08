import { taskDb } from '@/lib/db/task';
import { messageDb } from '@/lib/db/message';
import { evaluationDb } from '@/lib/db/evaluation';
import ChatRoomClient from './ChatRoomClient';
import type { MessageWithAuthor, Reaction } from '@/lib/types/task-chat';

interface ChatRoomPageProps {
  params: Promise<{ wsId: string; taskId: string }>;
}

export default async function ChatRoomPage({ params }: ChatRoomPageProps) {
  const { wsId, taskId } = await params;

  const task = await taskDb.getById(taskId);
  if (!task || !task.chatRoom) {
    return <div>Task or chat room not found</div>;
  }

  const messagesResult = await messageDb.getMessages(task.chatRoom.id, undefined, 50);

  // Transform Prisma messages to match MessageWithAuthor type
  const transformMessage = (msg: typeof messagesResult.messages[number]): MessageWithAuthor => ({
    ...msg,
    reactions: (msg.reactions as unknown as Reaction[]) ?? [],
    replies: msg.replies?.map((reply) => ({
      ...reply,
      reactions: (reply.reactions as unknown as Reaction[]) ?? [],
    })),
  });

  const messages = messagesResult.messages.map(transformMessage);
  const evaluations = await evaluationDb.getByTask(taskId);

  const participants = task.workspace.members.map((m) => ({
    id: m.user.id,
    name: m.user.name ?? m.user.email,
    avatarUrl: m.user.avatarUrl,
    role: m.role,
  }));

  return (
    <ChatRoomClient
      task={{
        id: task.id,
        title: task.title,
        status: task.status,
      }}
      initialMessages={messages}
      evaluations={evaluations}
      participants={participants}
    />
  );
}