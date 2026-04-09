// lib/types/task.ts

export type TaskStatus = 'DRAFT' | 'ACTIVE' | 'REVIEWING' | 'COMPLETED';

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  DRAFT: '草稿',
  ACTIVE: '进行中',
  REVIEWING: '待评审',
  COMPLETED: '已完成',
};

export const TASK_STATUS_COLORS: Record<TaskStatus, { bg: string; text: string }> = {
  DRAFT: { bg: 'bg-slate-500/20', text: 'text-slate-400' },
  ACTIVE: { bg: 'bg-indigo-500/20', text: 'text-indigo-400' },
  REVIEWING: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
  COMPLETED: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
};

export interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  dueAt: string | null;
  agentConfig: AgentConfigData;
}

export interface AgentConfigData {
  evaluatorName: string;
  promptTemplate: string;
  dimensions: string[];
  coachingEnabled: boolean;
  presetTemplate?: string;
}

export const PRESET_TEMPLATES = {
  'training': {
    name: '培训评估',
    evaluatorName: '培训评估助手',
    promptTemplate: '你是一名专业的培训评估助手。请根据学生的参与度、发言质量、任务完成情况来评估他们的表现。',
    dimensions: ['参与度', '发言质量', '任务完成'],
  },
  'project': {
    name: '项目评审',
    evaluatorName: '项目评审专家',
    promptTemplate: '你是一名经验丰富的项目经理。请评估团队成员在项目中的贡献度和协作能力。',
    dimensions: ['项目贡献', '团队协作', '创新能力'],
  },
  'teamwork': {
    name: '团队协作',
    evaluatorName: '团队协作顾问',
    promptTemplate: '你是一名团队协作专家。请评估成员在团队中的沟通、协作和问题解决能力。',
    dimensions: ['沟通能力', '协作精神', '问题解决'],
  },
  'performance': {
    name: '绩效评估',
    evaluatorName: '绩效评估官',
    promptTemplate: '你是一名人力资源专家。请根据既定目标评估员工的工作绩效。',
    dimensions: ['目标达成', '工作质量', '效率提升'],
  },
} as const;

export type PresetTemplateKey = keyof typeof PRESET_TEMPLATES;

// 状态流转规则：DRAFT -> ACTIVE -> REVIEWING -> COMPLETED
export const STATUS_TRANSITIONS: Record<TaskStatus, TaskStatus | null> = {
  DRAFT: 'ACTIVE',
  ACTIVE: 'REVIEWING',
  REVIEWING: 'COMPLETED',
  COMPLETED: null, // 终态，不可流转
};

export function canTransitionTo(currentStatus: TaskStatus, targetStatus: TaskStatus): boolean {
  return STATUS_TRANSITIONS[currentStatus] === targetStatus;
}
