
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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
  const [isProcessing, setIsProcessing] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("Auth callback processing");
        
        // Check for hash fragment in URL (Supabase returns tokens in hash)
        const hashParams = location.hash;
        if (hashParams) {
          console.log("Hash parameters detected - processing auth");
          
          // Get the current session state
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("Auth callback error:", error);
            toast({
              title: "Authentication Error",
              description: "There was a problem verifying your Discord account",
              variant: "destructive",
            });
          } else if (session) {
            // Session established successfully
            console.log("Auth successful, session established");
            toast({
              title: "Authentication Successful",
              description: "Your Discord account has been verified",
            });
          }
        }
      } catch (err) {
        console.error("Error processing auth callback:", err);
      } finally {
        setIsProcessing(false);
      }
    };
    
    handleAuthCallback();
  }, [location]);
  
  if (isProcessing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Verifying your Discord login...</h2>
          <p className="text-muted-foreground">Please wait while we complete the authentication.</p>
        </div>
      </div>
    );
  }
  
  // Redirect to home page after processing
  return <Navigate to="/" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
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
  </QueryClientProvider>
);

export default App;
