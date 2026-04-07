import { prisma } from './client';
import type { TaskStatus } from '@prisma/client';
import type { AgentEvaluatorConfig } from '@/lib/types/task-chat';

export interface CreateTaskInput {
  workspaceId: string;
  title: string;
  description: string;
  createdBy: string;
  agentConfig: AgentEvaluatorConfig;
  dueAt?: Date;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  dueAt?: Date | null;
  agentConfig?: AgentEvaluatorConfig;
}

export const taskDb = {
  async listByWorkspace(workspaceId: string, status?: TaskStatus) {
    return prisma.task.findMany({
      where: { workspaceId, ...(status ? { status } : {}) },
      include: {
        chatRoom: true,
        _count: { select: { evaluations: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  },

  async getById(taskId: string) {
    return prisma.task.findUnique({
      where: { id: taskId },
      include: {
        chatRoom: true,
        workspace: { include: { members: { include: { user: true } } } },
      },
    });
  },

  async create(data: CreateTaskInput) {
    const task = await prisma.task.create({
      data: {
        workspaceId: data.workspaceId,
        title: data.title,
        description: data.description,
        createdBy: data.createdBy,
        agentConfig: data.agentConfig as object,
        dueAt: data.dueAt,
        chatRoom: { create: {} },
      },
      include: { chatRoom: true },
    });
    return task;
  },

  async update(taskId: string, data: UpdateTaskInput) {
    const { agentConfig, ...rest } = data;
    return prisma.task.update({
      where: { id: taskId },
      data: {
        ...rest,
        ...(agentConfig ? { agentConfig: agentConfig as unknown as object } : {}),
      },
    });
  },

  async delete(taskId: string) {
    const exists = await prisma.task.findUnique({ where: { id: taskId }, select: { id: true } });
    if (!exists) throw new Error('Task not found');
    return prisma.task.delete({ where: { id: taskId } });
  },

  async getTaskWithEvaluation(taskId: string) {
    return prisma.task.findUnique({
      where: { id: taskId },
      include: {
        evaluations: {
          include: { targetUser: true },
          orderBy: { createdAt: 'desc' },
        },
        chatRoom: true,
      },
    });
  },
};
