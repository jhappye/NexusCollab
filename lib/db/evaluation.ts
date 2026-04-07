import { prisma } from './client';
import type { EvalDimension } from '@/lib/types/task-chat';

export interface CreateEvaluationInput {
  roomId: string;
  taskId: string;
  targetUserId: string;
  agentId: string;
  score?: number;
  dimensions: EvalDimension[];
  summary: string;
}

export const evaluationDb = {
  async create(data: CreateEvaluationInput) {
    return prisma.evaluation.create({
      data: {
        roomId: data.roomId,
        taskId: data.taskId,
        targetUserId: data.targetUserId,
        agentId: data.agentId,
        score: data.score,
        dimensions: data.dimensions as object,
        summary: data.summary,
      },
    });
  },

  async getByTask(taskId: string) {
    return prisma.evaluation.findMany({
      where: { taskId },
      include: { targetUser: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getByTaskAndUser(taskId: string, targetUserId: string) {
    return prisma.evaluation.findFirst({
      where: { taskId, targetUserId },
      orderBy: { createdAt: 'desc' },
      include: { targetUser: true },
    });
  },
};
