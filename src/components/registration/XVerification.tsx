
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ExternalLink, CheckCircle2 } from 'lucide-react';

interface XVerificationProps {
  isVerified: boolean;
  onVerificationChange: (isVerified: boolean) => void;
}

const XVerification = ({ isVerified, onVerificationChange }: XVerificationProps) => {
  const handleXVerification = () => {
    // Open X in a new tab
    window.open('https://x.com/gaib_ai', '_blank');
    
    // Mark as verified after clicking the button
    if (!isVerified) {
      onVerificationChange(true);
    }
  };
  
  return (
    <div className="space-y-2">
      <Label className="flex items-center space-x-2">
        <span>X Verification</span>
        <span className="text-xs text-muted-foreground">
          (must follow us on X)
        </span>
      </Label>
      
      {isVerified ? (
        <div className="flex items-center p-3 rounded-md border border-green-500 bg-green-50 dark:bg-green-900/20">
          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
          <span className="text-green-700 dark:text-green-300">
            X account followed
          </span>
        </div>
      ) : (
        <Button 
          type="button" 
          variant="secondary" 
          onClick={handleXVerification}
          className="w-full flex items-center justify-center gap-2 bg-[#19E3E3] hover:bg-[#19E3E3]/80 text-white"
        >
          <ExternalLink className="h-4 w-4" />
          <span>Follow us on X (GAIB X)</span>
        </Button>
      )}
    </div>
  );
};

export default XVerification;
