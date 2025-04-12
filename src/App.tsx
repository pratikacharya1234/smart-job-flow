
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import ResumePage from "./pages/ResumePage";
import CoverLetterPage from "./pages/CoverLetterPage";
import AnalyzerPage from "./pages/AnalyzerPage";
import TrackerPage from "./pages/TrackerPage";
import AuthPage from "./pages/AuthPage";
import PremiumPage from "./pages/PremiumPage";
import EditProfilePage from "./pages/EditProfilePage";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import { UserProvider } from "./contexts/UserContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <UserProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/premium" element={
                <ProtectedRoute>
                  <Layout><PremiumPage /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout><Dashboard /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/resume" element={
                <ProtectedRoute>
                  <Layout><ResumePage /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/cover-letter" element={
                <ProtectedRoute>
                  <Layout><CoverLetterPage /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/analyzer" element={
                <ProtectedRoute>
                  <Layout><AnalyzerPage /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/tracker" element={
                <ProtectedRoute>
                  <Layout><TrackerPage /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Layout><EditProfilePage /></Layout>
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </UserProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
