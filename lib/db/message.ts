import { prisma } from './client';
import type { AuthorType, AgentRole, ContentType } from '@prisma/client';
import type { Reaction } from '@/lib/types/task-chat';

export interface CreateMessageInput {
  roomId: string;
  authorId: string;
  authorType: AuthorType;
  agentRole?: AgentRole;
  content: string;
  contentType?: ContentType;
  parentId?: string;
}

export interface AddReactionInput {
  emoji: string;
  userId: string;
}

export const messageDb = {
  async getMessages(roomId: string, cursor?: string, limit = 50) {
    const messages = await prisma.message.findMany({
      where: { roomId },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
        replies: {
          include: { author: { select: { id: true, name: true, avatarUrl: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    const hasMore = messages.length > limit;
    const items = hasMore ? messages.slice(0, -1) : messages;
    return {
      messages: items.reverse(),
      nextCursor: hasMore ? items[items.length - 1]?.id : null,
      hasMore,
    };
  },

  async create(data: CreateMessageInput) {
    return prisma.message.create({
      data: {
        roomId: data.roomId,
        authorId: data.authorId,
        authorType: data.authorType,
        agentRole: data.agentRole,
        content: data.content,
        contentType: data.contentType ?? 'TEXT',
        parentId: data.parentId,
        reactions: '[]',
      },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
      },
    });
  },

  async addReaction(messageId: string, input: AddReactionInput) {
    return prisma.$transaction(async (tx) => {
      const msg = await tx.message.findUnique({ where: { id: messageId } });
      if (!msg) throw new Error('Message not found');
      const reactions = (msg.reactions as unknown as Reaction[]) ?? [];
      const existing = reactions.find((r) => r.emoji === input.emoji);
      if (existing) {
        if (!existing.userIds.includes(input.userId)) {
          existing.userIds.push(input.userId);
        }
      } else {
        reactions.push({ emoji: input.emoji, userIds: [input.userId] });
      }
      const updated = await tx.message.update({
        where: { id: messageId },
        data: { reactions: reactions as object },
      });
      return updated.reactions as unknown as Reaction[];
    });
  },

  async removeReaction(messageId: string, emoji: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const msg = await tx.message.findUnique({ where: { id: messageId } });
      if (!msg) throw new Error('Message not found');
      const reactions = (msg.reactions as unknown as Reaction[]) ?? [];
      const existing = reactions.find((r) => r.emoji === emoji);
      if (existing) {
        existing.userIds = existing.userIds.filter((id) => id !== userId);
        if (existing.userIds.length === 0) {
          const idx = reactions.indexOf(existing);
          reactions.splice(idx, 1);
        }
      }
      const updated = await tx.message.update({
        where: { id: messageId },
        data: { reactions: reactions as object },
      });
      return updated.reactions as unknown as Reaction[];
    });
  },
};
