
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import ResumePage from "./pages/ResumePage";
import CoverLetterPage from "./pages/CoverLetterPage";
import AnalyzerPage from "./pages/AnalyzerPage";
import TrackerPage from "./pages/TrackerPage";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import { UserProvider } from "./contexts/UserContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/resume" element={<Layout><ResumePage /></Layout>} />
            <Route path="/cover-letter" element={<Layout><CoverLetterPage /></Layout>} />
            <Route path="/analyzer" element={<Layout><AnalyzerPage /></Layout>} />
            <Route path="/tracker" element={<Layout><TrackerPage /></Layout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
