import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { OSDashboardView } from './components/OSDashboardView';
import { WorkflowBuilderView } from './components/WorkflowBuilderView';
import { AIMemoryStudioView } from './components/AIMemoryStudioView';
import { AgentBuilderView } from './components/AgentBuilderView';
import { PCVoiceAgentView } from './components/PCVoiceAgentView';
import { AIChatView } from './components/AIChatView';
import { DocumentGeneratorView } from './components/DocumentGeneratorView';
import { FileManagerView } from './components/FileManagerView';
import { EmailAssistantView } from './components/EmailAssistantView';
import { MessagingAssistantView } from './components/MessagingAssistantView';
import { VoiceAIView } from './components/VoiceAIView';
import { ContentCreatorView } from './components/ContentCreatorView';
import { CalendarView } from './components/CalendarView';
import { TaskManagementView } from './components/TaskManagementView';
import { KnowledgeBaseView } from './components/KnowledgeBaseView';
import { IntegrationsView } from './components/IntegrationsView';
import { DownloadableAppsView } from './components/DownloadableAppsView';
import { MarketplaceView } from './components/MarketplaceView';
import { BillingView } from './components/BillingView';
import { SecurityView } from './components/SecurityView';
import { AdminPanelView } from './components/AdminPanelView';
import { GlobalSearchModal } from './components/GlobalSearchModal';

const MainLayout: React.FC = () => {
  const { currentTab } = useApp();

  const renderContent = () => {
    switch (currentTab) {
      case 'os_dashboard': return <OSDashboardView />;
      case 'dashboard': return <OSDashboardView />;
      case 'workflow_builder': return <WorkflowBuilderView />;
      case 'ai_memory': return <AIMemoryStudioView />;
      case 'agent_builder': return <AgentBuilderView />;
      case 'pc_voice_agent': return <PCVoiceAgentView />;
      case 'ai_chat': return <AIChatView />;
      case 'document_generator': return <DocumentGeneratorView />;
      case 'file_manager': return <FileManagerView />;
      case 'email_assistant': return <EmailAssistantView />;
      case 'messaging_assistant': return <MessagingAssistantView />;
      case 'voice_ai': return <VoiceAIView />;
      case 'content_creator': return <ContentCreatorView />;
      case 'calendar': return <CalendarView />;
      case 'task_management': return <TaskManagementView />;
      case 'knowledge_base': return <KnowledgeBaseView />;
      case 'integrations': return <IntegrationsView />;
      case 'downloads': return <DownloadableAppsView />;
      case 'marketplace': return <MarketplaceView />;
      case 'billing': return <BillingView />;
      case 'security': return <SecurityView />;
      case 'admin_panel': return <AdminPanelView />;
      default: return <OSDashboardView />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />
        <main className="flex-1 pb-12">
          {renderContent()}
        </main>
      </div>
      <GlobalSearchModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
