import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  NavigationTab, UserRole, User, AIEmployee, 
  DocumentItem, FileItem, TaskItem, EmailItem, 
  CallRecord, KnowledgeSource, MarketplaceItem, AuditLog 
} from '../types';

interface AppContextType {
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  currentUser: User;
  agents: AIEmployee[];
  selectedAgent: AIEmployee;
  setSelectedAgent: (agent: AIEmployee) => void;
  addAgent: (agent: AIEmployee) => void;
  documents: DocumentItem[];
  addDocument: (doc: DocumentItem) => void;
  files: FileItem[];
  addFile: (file: FileItem) => void;
  tasks: TaskItem[];
  updateTaskStatus: (taskId: string, status: TaskItem['status']) => void;
  addTask: (task: TaskItem) => void;
  emails: EmailItem[];
  callLogs: CallRecord[];
  knowledgeSources: KnowledgeSource[];
  addKnowledgeSource: (source: KnowledgeSource) => void;
  marketplaceItems: MarketplaceItem[];
  toggleInstallSkill: (id: string) => void;
  auditLogs: AuditLog[];
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  notifications: { id: string; title: string; time: string; read: boolean }[];
  markNotificationsRead: () => void;
}

const initialUser: User = {
  id: 'usr_001',
  name: 'Alex Vance',
  email: 'alex@omnicorp.ai',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'business_owner',
  companyName: 'OmniCorp Solutions',
  plan: 'business',
  twoFactorEnabled: true,
};

const initialAgents: AIEmployee[] = [
  {
    id: 'agent_01',
    name: 'Sarah Connor',
    title: 'Senior Executive Assistant & Ops Lead',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department: 'Operations',
    status: 'online',
    voiceProfile: 'Rachel (Professional Warm)',
    model: 'llama-3.3-70b-versatile',
    systemPrompt: 'You are Sarah, an expert AI operations manager specializing in executive scheduling, document generation, and project workflows.',
    permissions: {
      canSendEmails: true,
      canMakeCalls: true,
      canAccessFiles: true,
      canScheduleMeetings: true,
      canManageTasks: true,
    },
    stats: {
      tasksCompleted: 342,
      callsHandled: 89,
      documentsCreated: 154,
      messagesProcessed: 1240,
    }
  },
  {
    id: 'agent_02',
    name: 'David Miller',
    title: 'Head of Sales & Inbound Qualifier',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    department: 'Sales',
    status: 'online',
    voiceProfile: 'Adam (Confident Executive)',
    model: 'llama-3.3-70b-versatile',
    systemPrompt: 'You are David, a top-performing AI sales representative capable of making follow-up calls, qualifying leads, and closing software demos.',
    permissions: {
      canSendEmails: true,
      canMakeCalls: true,
      canAccessFiles: true,
      canScheduleMeetings: true,
      canManageTasks: true,
    },
    stats: {
      tasksCompleted: 215,
      callsHandled: 278,
      documentsCreated: 42,
      messagesProcessed: 890,
    }
  },
  {
    id: 'agent_03',
    name: 'Elena Rostova',
    title: 'Customer Support Lead & SLA Specialist',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    department: 'Support',
    status: 'busy',
    voiceProfile: 'Emma (Calm Empathic)',
    model: 'llama-3.3-70b-versatile',
    systemPrompt: 'You are Elena, an AI customer support specialist trained to resolve inquiries, process returns, and escalate critical issues.',
    permissions: {
      canSendEmails: true,
      canMakeCalls: false,
      canAccessFiles: true,
      canScheduleMeetings: false,
      canManageTasks: true,
    },
    stats: {
      tasksCompleted: 620,
      callsHandled: 45,
      documentsCreated: 18,
      messagesProcessed: 3410,
    }
  }
];

const initialDocuments: DocumentItem[] = [
  {
    id: 'doc_1',
    title: 'Q3 Enterprise Financial Report',
    type: 'pdf',
    category: 'Finance',
    content: '# Q3 Enterprise Financial Overview\n\nRevenue grew by 24% YoY exceeding budget targets.',
    author: 'Sarah Connor (AI)',
    createdAt: '2026-08-04',
    size: '2.4 MB'
  },
  {
    id: 'doc_2',
    title: 'Client Service Level Agreement (SLA)',
    type: 'contract',
    category: 'Legal',
    content: '# Standard Service Agreement\n\n99.9% uptime guarantee with 15 minute AI escalation window.',
    author: 'Sarah Connor (AI)',
    createdAt: '2026-08-02',
    size: '850 KB'
  },
  {
    id: 'doc_3',
    title: 'August Sales Pipeline & Projections',
    type: 'xlsx',
    category: 'Sales',
    content: 'Deal Name, Value, Stage, Forecast\nAcme Corp, $45,000, Closing, High',
    author: 'David Miller (AI)',
    createdAt: '2026-08-01',
    size: '1.1 MB'
  }
];

const initialFiles: FileItem[] = [
  {
    id: 'f_1',
    name: 'Company_Policy_Guide_2026.pdf',
    size: '4.2 MB',
    type: 'application/pdf',
    uploadedAt: '2026-08-01',
    folder: 'HR & Policies',
    tags: ['Policy', 'HR', 'Internal'],
    ocrStatus: 'processed',
    indexed: true
  },
  {
    id: 'f_2',
    name: 'Q3_Product_Roadmap_Deck.pptx',
    size: '12.8 MB',
    type: 'presentation',
    uploadedAt: '2026-08-03',
    folder: 'Product',
    tags: ['Roadmap', 'Strategy'],
    ocrStatus: 'processed',
    indexed: true
  },
  {
    id: 'f_3',
    name: 'Vendor_Invoice_INV-9042.pdf',
    size: '340 KB',
    type: 'application/pdf',
    uploadedAt: '2026-08-05',
    folder: 'Finance',
    tags: ['Invoice', 'Billing'],
    ocrStatus: 'processed',
    indexed: true
  }
];

const initialTasks: TaskItem[] = [
  {
    id: 'task_1',
    title: 'Audit AWS Cloud Spending & Optimize EC2',
    description: 'Review monthly cloud infrastructure logs and flag unused compute instances.',
    status: 'in_progress',
    priority: 'high',
    aiScore: 94,
    assignee: 'Sarah Connor',
    dueDate: '2026-08-08',
    subtasks: [
      { id: 's1', title: 'Export AWS Cost Explorer CSV', done: true },
      { id: 's2', title: 'Identify idle RDS databases', done: false },
    ]
  },
  {
    id: 'task_2',
    title: 'Draft Inbound Demo Proposals for TechCorp',
    description: 'Create customized RFP document based on uploaded client requirements.',
    status: 'todo',
    priority: 'urgent',
    aiScore: 98,
    assignee: 'David Miller',
    dueDate: '2026-08-06',
    subtasks: [
      { id: 's3', title: 'Parse client RFP doc', done: true },
      { id: 's4', title: 'Generate PDF Quotation', done: false }
    ]
  },
  {
    id: 'task_3',
    title: 'Send Monthly Customer NPS Survey Email',
    description: 'Dispatch automated email campaign to active accounts.',
    status: 'completed',
    priority: 'medium',
    aiScore: 82,
    assignee: 'Elena Rostova',
    dueDate: '2026-08-03',
    subtasks: [
      { id: 's5', title: 'Segment user list', done: true },
      { id: 's6', title: 'Send surveys', done: true }
    ]
  }
];

const initialEmails: EmailItem[] = [
  {
    id: 'em_1',
    sender: 'Marcus Brody',
    senderEmail: 'mbrody@nexuscorp.com',
    subject: 'Urgent: Enterprise Plan Quotation & API Limits',
    snippet: 'Hi Alex, we are looking to upgrade our team of 45 engineers to OmniAgent Enterprise...',
    body: 'Hi Alex,\n\nWe are looking to upgrade our team of 45 engineers to OmniAgent Enterprise. Could your AI sales representative send over a formal SLA quote and contract draft?\n\nThanks,\nMarcus',
    date: '10:42 AM',
    read: false,
    category: 'sales',
    suggestedReply: 'Dear Marcus,\n\nThank you for reaching out! I have prepared a customized Enterprise plan proposal with dedicated Groq API rate limits and 99.9% uptime SLA.\n\nAttached is the formal quotation.\n\nBest regards,\nDavid Miller (AI Sales Lead)'
  },
  {
    id: 'em_2',
    sender: 'Stripe Billing System',
    senderEmail: 'invoices@stripe.com',
    subject: 'Payment Successful - OmniAgent AI Business Plan',
    snippet: 'Your invoice #INV-2026-0801 for $499.00 has been paid successfully.',
    body: 'Your monthly subscription to OmniAgent AI Business Plan has renewed successfully.',
    date: 'Aug 4',
    read: true,
    category: 'primary'
  }
];

const initialCallLogs: CallRecord[] = [
  {
    id: 'call_101',
    callerName: 'Robert Vance (TechCorp CEO)',
    callerPhone: '+1 (555) 392-1049',
    direction: 'inbound',
    duration: '3m 42s',
    status: 'completed',
    timestamp: '2026-08-05 14:15',
    transcript: [
      { speaker: 'Caller', text: 'Hello, I wanted to check if OmniAgent supports HIPAA compliant file handling.', time: '0:05' },
      { speaker: 'Sarah Connor (AI)', text: 'Hello Mr. Vance! Yes, OmniAgent AI features end-to-end encryption, SOC 2 compliance, and dedicated HIPAA vault options.', time: '0:14' },
      { speaker: 'Caller', text: 'Great, please email me the security whitepaper.', time: '0:45' }
    ],
    summary: 'Caller inquired about HIPAA compliance and requested security whitepaper. AI scheduled follow-up email.',
    sentiment: 'positive'
  },
  {
    id: 'call_102',
    callerName: 'Jane Smith',
    callerPhone: '+1 (555) 882-9011',
    direction: 'outbound',
    duration: '2m 10s',
    status: 'completed',
    timestamp: '2026-08-05 11:30',
    transcript: [
      { speaker: 'David Miller (AI)', text: 'Hi Jane, this is David from OmniAgent calling to confirm your platform demo tomorrow at 2 PM.', time: '0:02' },
      { speaker: 'Caller', text: 'Confirmed! Looking forward to seeing the document generator live.', time: '0:18' }
    ],
    summary: 'Outbound appointment confirmation call completed successfully.',
    sentiment: 'positive'
  }
];

const initialKnowledge: KnowledgeSource[] = [
  {
    id: 'k_1',
    name: 'OmniCorp_Employee_Handbook.pdf',
    type: 'pdf',
    sizeOrUrl: '3.8 MB',
    status: 'indexed',
    tokenCount: 42000,
    uploadedAt: '2026-08-01'
  },
  {
    id: 'k_2',
    name: 'https://docs.omnicorp.ai/api-v2',
    type: 'website',
    sizeOrUrl: 'Web Crawler',
    status: 'indexed',
    tokenCount: 185000,
    uploadedAt: '2026-08-03'
  }
];

const initialMarketplace: MarketplaceItem[] = [
  {
    id: 'm_1',
    title: 'Stripe & Invoice Automation Skill',
    author: 'OmniAgent Labs',
    category: 'Skill',
    rating: 4.9,
    downloads: 1420,
    price: 'Free',
    description: 'Enables your AI employee to automatically read vendor invoices, create PDF receipts, and reconcile accounts in Stripe.',
    icon: 'Receipt',
    installed: true
  },
  {
    id: 'm_2',
    title: 'Executive Legal Contract Draft Pack',
    author: 'LegalTech Pro',
    category: 'Template',
    rating: 4.8,
    downloads: 890,
    price: '$29',
    description: 'Pre-vetted templates for NDAs, SLAs, Employment Agreements, and SaaS Terms of Service.',
    icon: 'FileText',
    installed: false
  },
  {
    id: 'm_3',
    title: 'HubSpot & Salesforce CRM Sync',
    author: 'IntegrateAI',
    category: 'Integration',
    rating: 4.7,
    downloads: 3200,
    price: 'Free',
    description: 'Two-way synchronization between AI Call Logs, Emails, and CRM contact timelines.',
    icon: 'RefreshCw',
    installed: true
  }
];

const initialAuditLogs: AuditLog[] = [
  {
    id: 'log_1',
    action: 'AI Agent "Sarah Connor" generated PDF Document #DOC-892',
    actor: 'Sarah Connor (AI)',
    target: 'Document Vault',
    timestamp: '2026-08-05 15:40:12',
    ip: '192.168.1.104',
    status: 'success'
  },
  {
    id: 'log_2',
    action: 'User Role Switched to Business Owner',
    actor: 'Alex Vance',
    target: 'System RBAC',
    timestamp: '2026-08-05 14:10:00',
    ip: '10.0.4.12',
    status: 'success'
  },
  {
    id: 'log_3',
    action: 'Groq API Model execution (llama-3.3-70b-versatile)',
    actor: 'AI Chat Studio',
    target: 'Groq Cloud Engine',
    timestamp: '2026-08-05 13:22:09',
    ip: 'Groq Gateway',
    status: 'success'
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('business_owner');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [agents, setAgents] = useState<AIEmployee[]>(initialAgents);
  const [selectedAgent, setSelectedAgent] = useState<AIEmployee>(initialAgents[0]);
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [emails] = useState<EmailItem[]>(initialEmails);
  const [callLogs] = useState<CallRecord[]>(initialCallLogs);
  const [knowledgeSources, setKnowledgeSources] = useState<KnowledgeSource[]>(initialKnowledge);
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>(initialMarketplace);
  const [auditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Sarah Connor completed AWS Audit Task', time: '10m ago', read: false },
    { id: '2', title: 'Inbound Call from Robert Vance summarized', time: '1h ago', read: false },
    { id: '3', title: 'Stripe Invoice #INV-2026 paid', time: '3h ago', read: true }
  ]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const addAgent = (agent: AIEmployee) => {
    setAgents(prev => [agent, ...prev]);
    setSelectedAgent(agent);
  };

  const addDocument = (doc: DocumentItem) => {
    setDocuments(prev => [doc, ...prev]);
  };

  const addFile = (file: FileItem) => {
    setFiles(prev => [file, ...prev]);
  };

  const updateTaskStatus = (taskId: string, status: TaskItem['status']) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
  };

  const addTask = (task: TaskItem) => {
    setTasks(prev => [task, ...prev]);
  };

  const addKnowledgeSource = (source: KnowledgeSource) => {
    setKnowledgeSources(prev => [source, ...prev]);
  };

  const toggleInstallSkill = (id: string) => {
    setMarketplaceItems(prev => prev.map(m => m.id === id ? { ...m, installed: !m.installed } : m));
  };

  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        userRole,
        setUserRole,
        theme,
        toggleTheme,
        currentUser: initialUser,
        agents,
        selectedAgent,
        setSelectedAgent,
        addAgent,
        documents,
        addDocument,
        files,
        addFile,
        tasks,
        updateTaskStatus,
        addTask,
        emails,
        callLogs,
        knowledgeSources,
        addKnowledgeSource,
        marketplaceItems,
        toggleInstallSkill,
        auditLogs,
        isSearchOpen,
        setIsSearchOpen,
        notifications,
        markNotificationsRead
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
