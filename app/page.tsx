'use client';

import React from 'react';
import { useManagementStore } from '@/stores/useManagementStore';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { CommandPalette } from '@/components/CommandPalette';
import { AICopilotDrawer } from '@/components/AICopilotDrawer';
import { CommandCenter } from '@/components/features/CommandCenter';
import { ClientsModule } from '@/components/features/ClientsModule';
import { CaseNotesModule } from '@/components/features/CaseNotesModule';
import { IncidentsModule } from '@/components/features/IncidentsModule';
import { RestrictivePracticesModule } from '@/components/features/RestrictivePracticesModule';
import { ABCAnalyserModule } from '@/components/features/ABCAnalyserModule';
import { BSPModule } from '@/components/features/BSPModule';
import { PracticeToolsModule } from '@/components/features/PracticeToolsModule';
import { GoogleWorkspaceHub } from '@/components/features/GoogleWorkspaceHub';
import { GoogleMapsView } from '@/components/features/GoogleMapsView';
import { ComplianceDashboard } from '@/components/features/ComplianceDashboard';
import { CRMModule } from '@/components/features/CRMModule';
import { BillingModule } from '@/components/features/BillingModule';
import { HRModule } from '@/components/features/HRModule';
import { AuditLogsModule } from '@/components/features/AuditLogsModule';
import { IntegrationsModule } from '@/components/features/IntegrationsModule';
import { OutcomeTrackingModule } from '@/components/features/OutcomeTrackingModule';
import { StaffTrainingModule } from '@/components/features/StaffTrainingModule';
import { ReferralIntakeModule } from '@/components/features/ReferralIntakeModule';
import { AnalyticsDashboardModule } from '@/components/features/AnalyticsDashboardModule';
import { WorkflowAutomationModule } from '@/components/features/WorkflowAutomationModule';

export default function Page() {
  const { activeTab, setActiveTab, theme, toggleAICopilot } = useManagementStore();

  // Global hotkey listeners: Ctrl+J for Copilot
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        toggleAICopilot();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleAICopilot]);

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-50'
      }`}
    >
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {activeTab === 'command-center' && <CommandCenter />}
            {activeTab === 'analytics' && <AnalyticsDashboardModule />}
            {activeTab === 'workflow-automation' && <WorkflowAutomationModule />}
            {activeTab === 'clients' && <ClientsModule />}
            {activeTab === 'referral-intake' && <ReferralIntakeModule />}
            {activeTab === 'outcome-tracking' && <OutcomeTrackingModule />}
            {activeTab === 'staff-training' && <StaffTrainingModule />}
            {activeTab === 'case-notes' && <CaseNotesModule />}
            {activeTab === 'incidents' && <IncidentsModule />}
            {activeTab === 'restrictive-practices' && <RestrictivePracticesModule />}
            {activeTab === 'abc-analyser' && <ABCAnalyserModule />}
            {(activeTab === 'bsp-creator' || activeTab === 'bsp-plans') && <BSPModule />}
            {activeTab === 'practice-tools' && <PracticeToolsModule />}
            {activeTab === 'google-workspace' && <GoogleWorkspaceHub />}
            {activeTab === 'google-maps' && <GoogleMapsView />}
            {activeTab === 'audit' && <ComplianceDashboard />}
            {activeTab === 'crm' && <CRMModule />}
            {activeTab === 'billing' && <BillingModule />}
            {activeTab === 'practitioners' && <HRModule />}
            {activeTab === 'hr-roster' && <HRModule />}
            {activeTab === 'audit-logs' && <AuditLogsModule />}
            {activeTab === 'integrations' && <IntegrationsModule />}
          </div>
        </main>
      </div>
      <CommandPalette />
      <AICopilotDrawer />
    </div>
  );
}

