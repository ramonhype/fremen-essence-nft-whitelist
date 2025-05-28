
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2 } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PasswordVerificationProps {
  onPasswordVerified: (isValid: boolean, password: string) => void;
}

const PasswordVerification = ({ onPasswordVerified }: PasswordVerificationProps) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const handlePasswordCheck = async () => {
    setIsLoading(true);
    
    try {
      // Check password against Supabase with additional check for max_uses
      const { data, error } = await supabase
        .from('community_passwords')
        .select('id, max_uses, current_uses, active')
        .eq('password', password)
        .eq('active', true)
        .single();
      
      if (error) {
        console.error('Password check error:', error);
        throw new Error('Invalid password');
      }
      
      // Check if password usage limit has been reached
      const hasReachedLimit = data.max_uses !== null && data.current_uses >= data.max_uses;
      
      const isValid = !!data && !hasReachedLimit;
      setIsPasswordValid(isValid);
      onPasswordVerified(isValid, password);
      
      if (isValid) {
        toast({
          title: "Success",
          description: "Password verified successfully",
        });
      } else if (hasReachedLimit) {
        toast({
          title: "Error",
          description: "This password has reached its maximum usage limit",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Invalid community password",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error checking password:', error);
      toast({
        title: "Error",
        description: "Failed to verify password. Please check your password and try again.",
        variant: "destructive",
      });
      setIsPasswordValid(false);
      onPasswordVerified(false, '');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="password">Community Password</Label>
      <div className="flex gap-2">
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setIsPasswordValid(false); // Reset validation on change
            onPasswordVerified(false, e.target.value);
          }}
          placeholder="Enter community password"
          className="border-nft-border bg-nft-muted focus:border-nft-primary"
          required
        />
        <Button 
          type="button" 
          variant="secondary" 
          onClick={handlePasswordCheck}
          disabled={!password || isLoading}
        >
          {isLoading ? "Checking..." : "Verify"}
        </Button>
      </div>
      {isPasswordValid && (
        <p className="text-xs text-green-500 flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Password verified
        </p>
      )}
    </div>
  );
};

export default PasswordVerification;
