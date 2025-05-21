
import { useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { checkDiscordVerification, updateDiscordVerificationStatus } from "@/utils/discordVerification";

import WalletDisplay from './WalletDisplay';
import XVerification from './XVerification';
import DiscordVerification from './DiscordVerification';
import PasswordVerification from './PasswordVerification';

const RegistrationForm = () => {
  // Mock the wallet connection state (replaced wagmi's useAccount)
  const [address, setAddress] = useState<string | undefined>("0x1234...5678"); // Mock address
  const [isConnected, setIsConnected] = useState(true); // Set to true for testing

  const [password, setPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isXVerified, setIsXVerified] = useState(false);
  const [isDiscordVerified, setIsDiscordVerified] = useState(false);
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  
  // Check for Discord verification on mount and auth state changes
  useEffect(() => {
    const checkAuthAndDiscord = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.provider_token) {
          const { verified } = await checkDiscordVerification();
          setIsDiscordVerified(verified);
          
          // If there's a registration ID and verification was successful, update it
          if (registrationId && verified) {
            await updateDiscordVerificationStatus(registrationId, true);
          }
          
          if (verified) {
            toast({
              title: "Success",
              description: "Discord successfully verified",
            });
          }
        }
      } catch (error) {
        console.error("Error checking Discord verification:", error);
      }
    };
    
    checkAuthAndDiscord();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.provider_token) {
          // Use setTimeout to avoid Supabase auth deadlock
          setTimeout(async () => {
            const { verified } = await checkDiscordVerification();
            setIsDiscordVerified(verified);
            
            if (verified) {
              toast({
                title: "Success",
                description: "Discord successfully verified",
              });
              
              // If there's a registration ID, update it
              if (registrationId) {
                await updateDiscordVerificationStatus(registrationId, true);
              }
            }
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setIsDiscordVerified(false);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [registrationId]);
  
  const handlePasswordVerification = (isValid: boolean, verifiedPassword: string) => {
    setIsPasswordValid(isValid);
    setPassword(verifiedPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to register",
        variant: "destructive",
      });
      return;
    }

    if (!isPasswordValid) {
      toast({
        title: "Password not verified",
        description: "Please verify your community password first",
        variant: "destructive",
      });
      return;
    }

    if (!isXVerified) {
      toast({
        title: "X not verified",
        description: "Please follow us on X first",
        variant: "destructive",
      });
      return;
    }

    if (!isDiscordVerified) {
      toast({
        title: "Discord not verified",
        description: "Please verify your Discord membership first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Get password ID and check max_uses again as a safety measure
      const { data: passwordData, error: passwordError } = await supabase
        .from('community_passwords')
        .select('id, max_uses, current_uses')
        .eq('password', password)
        .single();
      
      if (passwordError || !passwordData) throw new Error("Password not found");
      
      // Double-check if usage limit has been reached
      if (passwordData.max_uses !== null && passwordData.current_uses >= passwordData.max_uses) {
        toast({
          title: "Registration Failed",
          description: "This password has reached its maximum usage limit",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Insert registration data - now explicitly setting name to null
      const { data, error } = await supabase
        .from('whitelist_registrations')
        .insert({
          wallet_address: address,
          discord_username: "", // Empty string as we're using OAuth
          discord_verified: isDiscordVerified,
          password_id: passwordData.id,
          name: null // Explicitly set name to null since we've made it nullable
        })
        .select('id')
        .single();
      
      if (error) {
        if (error.code === '23505') { // Unique violation
          toast({
            title: "Already Registered",
            description: "This wallet address is already registered",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        // Increment the current_uses counter
        await supabase
          .from('community_passwords')
          .update({ current_uses: passwordData.current_uses + 1 })
          .eq('id', passwordData.id);
        
        setRegistrationId(data.id);
        toast({
          title: "Registration Successful",
          description: "Your wallet has been registered for the whitelist",
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md border border-white/10 bg-white/5 backdrop-blur-md text-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-white">Whitelist Registration</CardTitle>
        <CardDescription className="text-white/80">Register your wallet for our upcoming NFT mint</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <WalletDisplay 
              address={address} 
              isConnected={isConnected} 
            />

            <XVerification 
              isVerified={isXVerified}
              onVerificationChange={setIsXVerified}
            />

            <DiscordVerification 
              isVerified={isDiscordVerified}
              onVerificationChange={setIsDiscordVerified}
            />

            <PasswordVerification 
              onPasswordVerified={handlePasswordVerification} 
            />
          </div>
          
          <div className="mt-6">
            <Button 
              type="submit" 
              className="w-full bg-[#8b5cf6] hover:bg-[#8b5cf6]/80 text-white transition-colors"
              disabled={!isConnected || !isPasswordValid || isLoading || !isDiscordVerified || !isXVerified}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Submitting...</span>
                </>
              ) : "Register for Whitelist"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegistrationForm;
