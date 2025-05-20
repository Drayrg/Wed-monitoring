import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import DashboardPage from "@/pages/DashboardPage";
import ProcessesPage from "@/pages/ProcessesPage";
import SystemDetailsPage from "@/pages/SystemDetailsPage";
import Sidebar from "@/components/Sidebar";
import { ThemeProvider } from "@/context/ThemeContext";
import { UpdateIntervalProvider } from "@/context/UpdateIntervalContext";

function Router() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      <Sidebar />
      <Switch>
        <Route path="/" component={DashboardPage} />
        <Route path="/processes" component={ProcessesPage} />
        <Route path="/system-details" component={SystemDetailsPage} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <UpdateIntervalProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </UpdateIntervalProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
