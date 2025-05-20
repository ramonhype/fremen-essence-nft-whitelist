
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MessagesSquare, CheckCircle2, Loader2, ExternalLink } from 'lucide-react';
import { signInWithDiscord, checkDiscordVerification } from "@/utils/discordVerification";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DiscordVerificationProps {
  isVerified: boolean;
  onVerificationChange?: (isVerified: boolean) => void;
}

const DiscordVerification = ({ isVerified, onVerificationChange }: DiscordVerificationProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  
  // Check verification status on mount and auth state changes
  useEffect(() => {
    const checkStatus = async () => {
      setCheckingStatus(true);
      try {
        console.log("Checking Discord verification status");
        const { verified } = await checkDiscordVerification();
        console.log("Discord verification status:", verified);
        
        if (onVerificationChange) {
          onVerificationChange(verified);
        }
      } catch (err) {
        console.error("Error checking Discord verification:", err);
      } finally {
        setCheckingStatus(false);
      }
    };
    
    checkStatus();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        // Use setTimeout to avoid Supabase auth deadlock
        setTimeout(async () => {
          try {
            const { verified } = await checkDiscordVerification();
            console.log("After signin verification status:", verified);
            
            if (onVerificationChange) {
              onVerificationChange(verified);
            }
          } catch (err) {
            console.error("Error checking Discord verification after auth change:", err);
          }
        }, 0);
      } else if (event === 'SIGNED_OUT') {
        if (onVerificationChange) {
          onVerificationChange(false);
        }
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [onVerificationChange]);
  
  const openDiscordServer = () => {
    window.open('https://discord.gg/gaibofficial', '_blank');
  };
  
  const handleDiscordVerification = async () => {
    try {
      setIsLoading(true);
      console.log("Starting Discord verification");
      
      // Log current URL for debugging
      console.log("Current origin:", window.location.origin);
      
      const { error } = await signInWithDiscord();
      
      if (error) {
        console.error("Discord sign-in error:", error);
        toast({
          title: "Verification Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("Discord verification error:", err);
      toast({
        title: "Verification Failed",
        description: "An error occurred during Discord verification",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (checkingStatus) {
    return (
      <div className="space-y-2">
        <Label className="flex items-center space-x-2">
          <span>Discord Verification</span>
        </Label>
        <div className="flex items-center p-3 rounded-md border border-muted bg-muted/20">
          <Loader2 className="h-5 w-5 text-muted-foreground animate-spin mr-2" />
          <span className="text-muted-foreground">Checking verification status...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      <Label className="flex items-center space-x-2">
        <span>Discord Verification</span>
        <span className="text-xs text-muted-foreground">
          (must be a member of{" "}
          <button 
            onClick={openDiscordServer}
            className="text-[#4F9AF4] hover:underline inline-flex items-center"
          >
            GAIB's Discord
            <ExternalLink className="h-3 w-3 ml-1" />
          </button>
          )
        </span>
      </Label>
      
      {isVerified ? (
        <div className="flex items-center p-3 rounded-md border border-green-500 bg-green-50 dark:bg-green-900/20">
          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
          <span className="text-green-700 dark:text-green-300">
            Discord successfully verified
          </span>
        </div>
      ) : (
        <Button 
          type="button" 
          variant="secondary" 
          onClick={handleDiscordVerification}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-[#4F9AF4] hover:bg-[#4F9AF4]/80 text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Verifying...</span>
            </>
          ) : (
            <>
              <MessagesSquare className="h-4 w-4" />
              <span>Verify with Discord</span>
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default DiscordVerification;
