
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MessagesSquare, CheckCircle2 } from 'lucide-react';
import { DISCORD_SERVER_TO_JOIN, getDiscordAuthUrl } from "@/utils/discordVerification";

interface DiscordVerificationProps {
  isVerified: boolean;
}

const DiscordVerification = ({ isVerified }: DiscordVerificationProps) => {
  const handleDiscordVerification = () => {
    window.location.href = getDiscordAuthUrl();
  };
  
  return (
    <div className="space-y-2">
      <Label className="flex items-center space-x-2">
        <span>Discord Verification</span>
        <span className="text-xs text-muted-foreground">
          (Must be a member of {DISCORD_SERVER_TO_JOIN})
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
          className="w-full flex items-center justify-center gap-2"
        >
          <MessagesSquare className="h-4 w-4" />
          <span>Verify with Discord</span>
        </Button>
      )}
    </div>
  );
};

export default DiscordVerification;
