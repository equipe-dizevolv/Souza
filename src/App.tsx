import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { AppLayout } from './components/layout/app-layout';
import { Toaster } from './components/ui/sonner';

// Auth Screens
import { Login, SignUp, ForgotPassword, ResetPassword } from './screens/auth';

// Screens - Admin
import { AdminModulesHub } from './screens/admin/modules-hub';
import { AdminUsers } from './screens/admin/users';
import { AdminIntegrations } from './screens/admin/integrations';
import { AdminReports } from './screens/admin/reports';
import { AdminSettings } from './screens/admin/settings';
import { PlansSubscriptions } from './screens/admin/plans-subscriptions';
import { OneOffProducts } from './screens/admin/one-off-products';
import { QRArchitect } from './screens/admin/qr-architect';

// Screens - User
import { UserHome } from './screens/user/home';
import { UserModulesHub } from './screens/user/modules-hub';
import { MarketingBriefing } from './screens/user/marketing-briefing';
import { MarketingBriefingCreateAI } from './screens/user/marketing-briefing-create-ai';
import { MarketingEditor } from './screens/user/marketing-editor';
import { SalesFunnel } from './screens/user/sales-funnel';
import { HeadHunterSearch } from './screens/user/headhunter-search';
import { HeadHunterSearchCreateAI } from './screens/user/headhunter-search-create-ai';
import { HeadHunterScreening } from './screens/user/headhunter-screening';
import { HeadhunterExport } from './screens/user/headhunter-export';
import { WhatsAppPlaybooks } from './screens/user/whatsapp-playbooks';
import { WhatsAppPlaybookDetail } from './screens/user/whatsapp-playbook-detail';
import { ConsultancyChat } from './screens/user/consultancy-chat';
import { ConsultancyActionPlan } from './screens/user/consultancy-action-plan';
import { IncomeWizard } from './screens/user/income-wizard';
import { IncomePlan90D } from './screens/user/income-plan-90d';
import { UserReports } from './screens/user/reports';
import { UserHistory } from './screens/user/history';

// Screens - Consultant
import { ConsultantDashboard } from './screens/consultant/dashboard';
import { ConsultantReports } from './screens/consultant/reports';
import { ConsultantNotes } from './screens/consultant/notes';
import { AccountsPanel } from './screens/consultant/accounts-panel';

export type Persona = 'Ana Admin' | 'Paulo Padrão' | 'Clara Consultora';

export default function App() {
  const [currentPersona, setCurrentPersona] = useState<Persona>('Paulo Padrão');

  return (
    <ThemeProvider defaultTheme="dark" storageKey="app-theme">
      <BrowserRouter>
        <Routes>
          {/* Auth Routes - Without Layout */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<SignUp />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />

          {/* App Routes - With Layout */}
          <Route
            path="/*"
            element={
              <AppLayout
                currentPersona={currentPersona}
                onPersonaChange={setCurrentPersona}
              >
                <Routes>
                  {/* User Routes */}
                  {currentPersona === 'Paulo Padrão' && (
                    <>
                      <Route path="/" element={<UserHome />} />
                      <Route path="/home" element={<UserHome />} />
                      <Route path="/hub" element={<UserModulesHub />} />
                      <Route path="/marketing/briefing" element={<MarketingBriefing />} />
                      <Route path="/marketing/briefing/criar-com-ia" element={<MarketingBriefingCreateAI />} />
                      <Route path="/marketing/editor" element={<MarketingEditor />} />
                      <Route path="/sales/funnel" element={<SalesFunnel />} />
                      <Route path="/headhunter/search" element={<HeadHunterSearch />} />
                      <Route path="/headhunter/search/criar-com-ia" element={<HeadHunterSearchCreateAI />} />
                      <Route path="/headhunter/screening" element={<HeadHunterScreening />} />
                      <Route path="/headhunter/export" element={<HeadhunterExport />} />
                      <Route path="/whatsapp/playbooks" element={<WhatsAppPlaybooks />} />
                      <Route path="/whatsapp/playbooks/:id" element={<WhatsAppPlaybookDetail />} />
                      <Route path="/consultancy/chat" element={<ConsultancyChat />} />
                      <Route path="/consultancy/action-plan" element={<ConsultancyActionPlan />} />
                      <Route path="/income/wizard" element={<IncomeWizard />} />
                      <Route path="/income/plan-90d" element={<IncomePlan90D />} />
                      <Route path="/reports" element={<UserReports />} />
                      <Route path="/history" element={<UserHistory />} />
                      <Route path="*" element={<Navigate to="/home" replace />} />
                    </>
                  )}

                  {/* Admin Routes */}
                  {currentPersona === 'Ana Admin' && (
                    <>
                      <Route path="/" element={<AdminModulesHub />} />
                      <Route path="/hub" element={<AdminModulesHub />} />
                      <Route path="/users" element={<AdminUsers />} />
                      <Route path="/integrations" element={<AdminIntegrations />} />
                      <Route path="/plans" element={<PlansSubscriptions />} />
                      <Route path="/products" element={<OneOffProducts />} />
                      <Route path="/qr-architect" element={<QRArchitect />} />
                      <Route path="/reports" element={<AdminReports />} />
                      <Route path="/settings" element={<AdminSettings />} />
                      <Route path="*" element={<Navigate to="/hub" replace />} />
                    </>
                  )}

                  {/* Consultant Routes */}
                  {currentPersona === 'Clara Consultora' && (
                    <>
                      <Route path="/" element={<AccountsPanel />} />
                      <Route path="/accounts" element={<AccountsPanel />} />
                      <Route path="/dashboard" element={<ConsultantDashboard />} />
                      <Route path="/reports" element={<ConsultantReports />} />
                      <Route path="/notes" element={<ConsultantNotes />} />
                      <Route path="*" element={<Navigate to="/accounts" replace />} />
                    </>
                  )}
                </Routes>
              </AppLayout>
            }
          />
        </Routes>
        <Toaster position="top-center" duration={4000} />
      </BrowserRouter>
    </ThemeProvider>
  );
}