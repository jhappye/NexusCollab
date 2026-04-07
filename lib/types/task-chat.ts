// Participant in a chat room
export interface Participant {
  id: string;
  name: string | null;
  avatarUrl: string | null;
  role: string;
}

// Agent configuration stored in Task.agentConfig (JSON)
export interface AgentEvaluatorConfig {
  evaluatorId: string;
  evaluatorName: string;
  evaluatorPrompt: string;
  coachingEnabled: boolean;
  peerAgents: Array<{
    id: string;
    name: string;
    persona: string;
  }>;
}

// Evaluation dimension
export interface EvalDimension {
  name: string;
  score: number; // 0-100
  comment: string;
}

// Reaction stored as JSON in Message.reactions
export interface Reaction {
  emoji: string;
  userIds: string[];
}

// Message with relations for API responses
export interface MessageWithAuthor {
  id: string;
  roomId: string;
  authorId: string;
  authorType: 'HUMAN' | 'AGENT';
  agentRole?: 'EVALUATOR' | 'COACH' | 'PEER' | null;
  content: string;
  contentType: 'TEXT' | 'MARKDOWN' | 'EVALUATION_CARD' | 'FILE';
  parentId?: string | null;
  reactions: Reaction[];
  isEdited: boolean;
  createdAt: Date;
  author: {
    id: string;
    name: string | null;
    avatarUrl: string | null;
  };
  replies?: MessageWithAuthor[];
}

// SSE event types for chat room
export type RoomEvent =
  | { type: 'message'; data: MessageWithAuthor }
  | { type: 'typing_start'; data: { agentId: string; agentName: string } }
  | { type: 'typing_stop'; data: { agentId: string } }
  | { type: 'presence'; data: { userId: string; status: 'online' | 'offline' } }
  | { type: 'evaluation_ready'; data: { evaluationId: string } }
  | { type: 'reaction_update'; data: { messageId: string; reactions: Reaction[] } };
