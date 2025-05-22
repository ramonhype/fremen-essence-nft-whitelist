
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { checkDiscordVerification } from "@/utils/discordVerification";

import Index from "./pages/Index";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import AuthGuard from "./components/auth/AuthGuard";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";

// Handle Auth callback
const AuthCallback = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("Auth callback processing");
        console.log("URL:", window.location.href);
        
        // Parse the hash or query string
        const params = location.hash ? location.hash.substring(1) : location.search.substring(1);
        
        if (params) {
          console.log("Auth parameters detected");
          
          // Wait a moment to ensure Supabase has time to process the token
          setTimeout(async () => {
            try {
              // Get the current session state
              const { data: { session }, error } = await supabase.auth.getSession();
              
              if (error) {
                console.error("Auth callback error:", error);
                toast({
                  title: "Authentication Error",
                  description: "There was a problem verifying your Discord account: " + error.message,
                  variant: "destructive",
                });
                setIsProcessing(false);
                return;
              }
              
              if (session) {
                // Session established successfully
                console.log("Auth successful, session established", session);
                
                // Check Discord server membership
                const { verified, message } = await checkDiscordVerification();
                console.log("Discord verification result:", verified, message);
                
                if (verified) {
                  toast({
                    title: "Authentication Successful",
                    description: "Your Discord account has been verified",
                  });
                } else {
                  toast({
                    title: "Discord Verification Incomplete",
                    description: message,
                    variant: "destructive",
                  });
                }
              } else {
                console.log("No session found after auth callback");
                toast({
                  title: "Authentication Failed",
                  description: "No session was established",
                  variant: "destructive",
                });
              }
              setIsProcessing(false);
            } catch (innerError) {
              console.error("Error in delayed processing:", innerError);
              setIsProcessing(false);
            }
          }, 500);
        } else {
          console.log("No auth parameters found in URL");
          setIsProcessing(false);
        }
      } catch (err) {
        console.error("Error processing auth callback:", err);
        toast({
          title: "Authentication Error",
          description: "An unexpected error occurred during authentication",
          variant: "destructive",
        });
        setIsProcessing(false);
      }
    };
    
    handleAuthCallback();
  }, [location, navigate]);
  
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
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
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
);

export default App;
