import { prisma } from './client';
import type { MemberRole } from '@prisma/client';

export interface CreateWorkspaceInput {
  name: string;
  description?: string;
  ownerId: string;
}

export interface UpdateWorkspaceInput {
  name?: string;
  description?: string;
  agentConfig?: Record<string, unknown> | null;
}

export const workspaceDb = {
  async listByUser(userId: string) {
    return prisma.workspace.findMany({
      where: {
        members: { some: { userId } },
      },
      include: {
        _count: { select: { tasks: true, members: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  },

  async create(data: CreateWorkspaceInput) {
    const workspace = await prisma.workspace.create({
      data: {
        name: data.name,
        description: data.description,
        members: {
          create: {
            userId: data.ownerId,
            role: 'ADMIN',
          },
        },
      },
      include: { members: true },
    });
    return workspace;
  },

  async getById(workspaceId: string) {
    return prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        members: { include: { user: true } },
        _count: { select: { tasks: true } },
      },
    });
  },

  async update(workspaceId: string, data: UpdateWorkspaceInput) {
    return prisma.workspace.update({
      where: { id: workspaceId },
      data,
    });
  },

  async delete(workspaceId: string) {
    const exists = await prisma.workspace.findUnique({ where: { id: workspaceId }, select: { id: true } });
    if (!exists) throw new Error('Workspace not found');
    return prisma.workspace.delete({ where: { id: workspaceId } });
  },

  async addMember(workspaceId: string, userId: string, role: MemberRole = 'MEMBER') {
    return prisma.workspaceMember.create({
      data: { workspaceId, userId, role },
    });
  },

  async removeMember(workspaceId: string, userId: string) {
    return prisma.workspaceMember.delete({
      where: { workspaceId_userId: { workspaceId, userId } },
    });
  },
};
