
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { chains, RainbowKitProvider, WagmiConfig, darkTheme, wagmiConfig } from "@/lib/rainbowkit";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Auth from "./components/auth/Auth";
import NotFound from "./pages/NotFound";
import AuthGuard from "./components/auth/AuthGuard";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";

const queryClient = new QueryClient();

// Handle Auth callback
const AuthCallback = () => {
  useEffect(() => {
    // The hash fragment contains auth info from Supabase OAuth
    const handleAuthCallback = async () => {
      const hashParams = new URLSearchParams(
        window.location.hash.substring(1) // remove the # character
      );
      
      if (hashParams.has('access_token')) {
        // Refresh the session to ensure Supabase client has the latest auth state
        await supabase.auth.getSession();
      }
      
      // Remove the hash to clean up the URL
      if (window.location.hash) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };
    
    handleAuthCallback();
  }, []);
  
  // Redirect to home page
  return <Navigate to="/" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider 
        chains={chains}
        theme={darkTheme({
          accentColor: '#4F9AF4',
          accentColorForeground: 'white',
          borderRadius: 'medium',
          fontStack: 'system',
        })}
      >
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/admin" element={
                <AuthGuard>
                  <Admin />
                </AuthGuard>
              } />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  </QueryClientProvider>
);

export default App;
