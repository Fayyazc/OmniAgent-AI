export type UserRole = 'super_admin' | 'business_owner' | 'team_member';

export type NavigationTab = 
  | 'os_dashboard'
  | 'dashboard'
  | 'agent_builder'
  | 'workflow_builder'
  | 'ai_memory'
  | 'pc_voice_agent'
  | 'ai_chat'
  | 'document_generator'
  | 'file_manager'
  | 'email_assistant'
  | 'messaging_assistant'
  | 'voice_ai'
  | 'content_creator'
  | 'calendar'
  | 'task_management'
  | 'knowledge_base'
  | 'integrations'
  | 'downloads'
  | 'marketplace'
  | 'billing'
  | 'security'
  | 'admin_panel';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  companyName: string;
  plan: 'free' | 'starter' | 'professional' | 'business' | 'enterprise';
  twoFactorEnabled: boolean;
}

export interface MemoryItem {
  id: string;
  category: 'preference' | 'workflow' | 'prompt' | 'business_info';
  title: string;
  content: string;
  updatedAt: string;
  importance: 'high' | 'medium' | 'low';
}

export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'decision' | 'action' | 'notification';
  title: string;
  desc: string;
  icon: string;
  status?: 'pending' | 'running' | 'completed';
}

export interface IntegrationPlugin {
  id: string;
  name: string;
  category: 'Workspace' | 'Storage' | 'Communication' | 'CRM' | 'Finance' | 'Developer';
  icon: string;
  status: 'connected' | 'available' | 'configured';
  description: string;
}

export interface AIEmployee {
  id: string;
  name: string;
  title: string;
  avatar: string;
  department: string;
  status: 'online' | 'busy' | 'offline' | 'training';
  voiceProfile: string;
  model: string;
  systemPrompt: string;
  permissions: {
    canSendEmails: boolean;
    canMakeCalls: boolean;
    canAccessFiles: boolean;
    canScheduleMeetings: boolean;
    canManageTasks: boolean;
  };
  stats: {
    tasksCompleted: number;
    callsHandled: number;
    documentsCreated: number;
    messagesProcessed: number;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  content: string;
  timestamp: string;
  agentId?: string;
  reasoning?: string;
  attachments?: { name: string; type: string; url?: string }[];
}

export interface DocumentItem {
  id: string;
  title: string;
  type: 'docx' | 'xlsx' | 'pptx' | 'pdf' | 'csv' | 'markdown' | 'sop' | 'invoice' | 'contract';
  category: string;
  content: string;
  author: string;
  createdAt: string;
  size: string;
}

export interface FileItem {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
  folder: string;
  tags: string[];
  ocrStatus?: 'processed' | 'pending' | 'failed';
  indexed: boolean;
}

export interface EmailItem {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  snippet: string;
  body: string;
  date: string;
  read: boolean;
  category: 'primary' | 'support' | 'sales' | 'spam';
  suggestedReply?: string;
}

export interface CallRecord {
  id: string;
  callerName: string;
  callerPhone: string;
  direction: 'inbound' | 'outbound';
  duration: string;
  status: 'completed' | 'transferred' | 'missed';
  timestamp: string;
  transcript: { speaker: string; text: string; time: string }[];
  summary: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  aiScore: number;
  assignee: string;
  dueDate: string;
  subtasks: { id: string; title: string; done: boolean }[];
}

export interface KnowledgeSource {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'website' | 'faq';
  sizeOrUrl: string;
  status: 'indexed' | 'indexing' | 'failed';
  tokenCount: number;
  uploadedAt: string;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  author: string;
  category: 'Skill' | 'Template' | 'Automation' | 'Integration' | 'Prompt Pack';
  rating: number;
  downloads: number;
  price: string;
  description: string;
  icon: string;
  installed: boolean;
}

export interface AuditLog {
  id: string;
  action: string;
  actor: string;
  target: string;
  timestamp: string;
  ip: string;
  status: 'success' | 'warning' | 'error';
}
