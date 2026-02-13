import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import GoalsPage from "@/pages/GoalsPage";
import LabPage from "@/pages/LabPage";
import DeliverablesPage from "@/pages/DeliverablesPage";
import DashboardPage from "@/pages/DashboardPage";
import PreferencesPage from "@/pages/PreferencesPage";
import NotificationsPage from "@/pages/NotificationsPage";
import BillingPage from "@/pages/BillingPage";
import HelpSupportPage from "@/pages/HelpSupportPage";
import ProjectsPage from "@/pages/ProjectsPage";
import ProfilePage from "@/pages/ProfilePage";
import AccountPage from "@/pages/AccountPage";
import SecurityPage from "@/pages/SecurityPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={GoalsPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/lab" component={LabPage} />
      <Route path="/deliverables" component={DeliverablesPage} />

      <Route path="/settings/preferences" component={PreferencesPage} />
      <Route path="/settings/notifications" component={NotificationsPage} />
      <Route path="/settings/billing" component={BillingPage} />
      <Route path="/settings/projects" component={ProjectsPage} />
      <Route path="/support" component={HelpSupportPage} />

      <Route path="/account/profile" component={ProfilePage} />
      <Route path="/account" component={AccountPage} />
      <Route path="/account/security" component={SecurityPage} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
