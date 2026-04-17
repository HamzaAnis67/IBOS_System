import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import NotFound from "./pages/NotFound";
import ClientProjectsPage from "./pages/dashboard/client/Projects";
import ClientInvoicesPage from "./pages/dashboard/client/Invoices";
import ClientDashboard from "@/pages/dashboard/client/ClientDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard/client" element={<ClientDashboard />} />
          <Route path="/dashboard/client/projects" element={<ClientProjectsPage />} />
          <Route path="/dashboard/client/invoices" element={<ClientInvoicesPage />} />
          <Route
            path="/employee/dashboard"
            element={<DashboardPage role="employee" />}
          />
          <Route
            path="/admin/dashboard"
            element={<DashboardPage role="admin" />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
