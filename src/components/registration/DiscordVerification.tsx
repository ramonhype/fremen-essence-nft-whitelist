
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MessagesSquare, CheckCircle2, Loader2, ExternalLink, AlertTriangle } from 'lucide-react';
import { signInWithDiscord, checkDiscordVerification, DISCORD_SERVER_TO_JOIN } from "@/utils/discordVerification";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DiscordVerificationProps {
  isVerified: boolean;
  onVerificationChange?: (isVerified: boolean) => void;
}

const DiscordVerification = ({ isVerified, onVerificationChange }: DiscordVerificationProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  
  // Check verification status on mount and auth state changes
  useEffect(() => {
    const checkStatus = async () => {
      setCheckingStatus(true);
      setVerificationError(null);
      try {
        console.log("Checking Discord verification status");
        const { verified, message } = await checkDiscordVerification();
        console.log("Discord verification status:", verified, message);
        
        if (!verified && message.includes("join")) {
          setVerificationError(message);
        }
        
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
      console.log("Auth state changed:", event, !!session);
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        // Use setTimeout to avoid Supabase auth deadlock
        setTimeout(async () => {
          try {
            console.log("Checking Discord verification after auth change");
            const { verified, message } = await checkDiscordVerification();
            console.log("After signin verification status:", verified, message);
            
            if (!verified && message.includes("join")) {
              setVerificationError(message);
              toast({
                title: "Discord Server Required",
                description: "Please join the GAIB Discord server",
                variant: "destructive",
              });
            } else if (verified) {
              toast({
                title: "Discord Verified",
                description: "Successfully verified your Discord membership",
              });
            }
            
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
        setVerificationError(null);
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
      } else {
        console.log("Discord sign-in initiated successfully");
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
            className="text-[#19E3E3] hover:underline inline-flex items-center"
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
        <div className="space-y-2">
          {verificationError && (
            <div className="flex items-center p-3 rounded-md border border-amber-500 bg-amber-50 dark:bg-amber-900/20">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-amber-700 dark:text-amber-300">
                  {verificationError}
                </p>
                <div>
                  <button 
                    onClick={openDiscordServer}
                    className="text-xs text-[#19E3E3] hover:underline inline-flex items-center"
                  >
                    Click here to join the server
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <Button 
            type="button" 
            variant="secondary" 
            onClick={handleDiscordVerification}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-[#19E3E3] hover:bg-[#19E3E3]/80 text-white"
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
        </div>
      )}
    </div>
  );
};

export default DiscordVerification;
