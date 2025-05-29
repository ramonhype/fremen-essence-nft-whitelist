
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
import { useAccount } from 'wagmi';

import WalletDisplay from './WalletDisplay';
import XVerification from './XVerification';
import DiscordVerification from './DiscordVerification';
import PasswordVerification from './PasswordVerification';

const RegistrationForm = () => {
  const [password, setPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isXVerified, setIsXVerified] = useState(false);
  const [isDiscordVerified, setIsDiscordVerified] = useState(false);
  const [discordUsername, setDiscordUsername] = useState<string>('');
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>('');
  
  const { address, isConnected } = useAccount();
  
  // Update wallet address when connected
  useEffect(() => {
    if (isConnected && address) {
      setWalletAddress(address);
    } else {
      setWalletAddress('');
    }
  }, [address, isConnected]);

  // Check for X verification persistence on mount
  useEffect(() => {
    const savedXVerification = localStorage.getItem('xVerified');
    if (savedXVerification === 'true') {
      setIsXVerified(true);
    }
  }, []);
  
  // Check for Discord verification on mount and auth state changes
  useEffect(() => {
    const checkAuthAndDiscord = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.provider_token) {
          const { verified, username } = await checkDiscordVerification();
          setIsDiscordVerified(verified);
          setDiscordUsername(username || '');
          
          // If there's a registration ID and verification was successful, update it
          if (registrationId && verified && username) {
            await updateDiscordVerificationStatus(registrationId, true, username);
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
            const { verified, username } = await checkDiscordVerification();
            setIsDiscordVerified(verified);
            setDiscordUsername(username || '');
            
            if (verified) {
              toast({
                title: "Success",
                description: "Discord successfully verified",
              });
              
              // If there's a registration ID, update it
              if (registrationId && username) {
                await updateDiscordVerificationStatus(registrationId, true, username);
              }
            }
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setIsDiscordVerified(false);
          setDiscordUsername('');
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

  const handleWalletChange = (address: string) => {
    setWalletAddress(address);
  };

  const handleXVerificationChange = (verified: boolean) => {
    setIsXVerified(verified);
    if (verified) {
      localStorage.setItem('xVerified', 'true');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Starting registration submission...');
    console.log('Form state:', {
      walletAddress,
      isPasswordValid,
      isXVerified,
      isDiscordVerified,
      discordUsername,
      password
    });

    if (!walletAddress) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
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
      console.log('Checking password data...');
      // Get password data and check max_uses again as a safety measure
      const { data: passwordData, error: passwordError } = await supabase
        .from('community_passwords')
        .select('id, max_uses, current_uses, active')
        .eq('password', password)
        .eq('active', true)
        .single();
      
      if (passwordError || !passwordData) {
        console.error('Password error:', passwordError);
        throw new Error("Password not found or inactive");
      }
      
      console.log('Password data:', passwordData);
      
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
      
      console.log('Checking for existing registration...');
      // Check if wallet is already registered
      const { data: existingRegistration, error: existingError } = await supabase
        .from('whitelist_registrations')
        .select('id')
        .eq('wallet_address', walletAddress)
        .maybeSingle();
      
      console.log('Existing registration check:', { existingRegistration, existingError });
      
      if (existingRegistration) {
        toast({
          title: "Already Registered",
          description: "This wallet address is already registered",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      console.log('Inserting registration data...');
      // Insert registration data with actual password value and Discord username
      const registrationData = {
        wallet_address: walletAddress,
        discord_username: discordUsername,
        discord_verified: isDiscordVerified,
        password_id: password // Store the actual password value instead of the UUID
      };
      
      console.log('Registration data to insert:', registrationData);
      
      const { data, error } = await supabase
        .from('whitelist_registrations')
        .insert(registrationData)
        .select('id')
        .single();
      
      console.log('Insert result:', { data, error });
      
      if (error) {
        console.error('Registration error:', error);
        if (error.code === '23505') { // Unique violation
          toast({
            title: "Already Registered",
            description: "This wallet address is already registered",
            variant: "destructive",
          });
        } else {
          console.error('Full error details:', JSON.stringify(error, null, 2));
          throw error;
        }
      } else if (data && data.id) {
        console.log('Registration successful, updating password usage...');
        // Increment the current_uses counter
        const { error: updateError } = await supabase
          .from('community_passwords')
          .update({ current_uses: passwordData.current_uses + 1 })
          .eq('id', passwordData.id);
        
        if (updateError) {
          console.error('Error updating password usage:', updateError);
          // Log the error but don't fail the registration since it's already complete
        }
        
        setRegistrationId(data.id);
        console.log('Registration completed successfully');
        toast({
          title: "Registration Successful",
          description: "Your wallet has been registered for the whitelist",
        });
      } else {
        throw new Error("Registration failed: No data returned");
      }
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      // More specific error handling
      let errorMessage = "An error occurred during registration. Please try again.";
      
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        
        // Don't show generic errors for successful registrations
        if (error.message.includes('Registration failed: No data returned')) {
          errorMessage = "Registration may have completed successfully. Please refresh and check if you're already registered.";
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = "Network error. Please check your connection and try again.";
        } else if (error.message.includes('timeout')) {
          errorMessage = "Request timed out. Please try again.";
        } else if (error.message.includes('AbortError')) {
          errorMessage = "Request was interrupted. Please try again.";
        }
      }
      
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md border border-white/10 bg-white/5 backdrop-blur-md text-white shadow-lg mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl md:text-2xl text-white">Whitelist Registration</CardTitle>
        <CardDescription className="text-white/80 text-sm md:text-base">Register your wallet for our upcoming NFT mint</CardDescription>
      </CardHeader>
      <CardContent className="px-4 md:px-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <WalletDisplay onWalletChange={handleWalletChange} />

            <XVerification 
              isVerified={isXVerified}
              onVerificationChange={handleXVerificationChange}
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
              className="w-full bg-[#19E3E3] hover:bg-[#19E3E3]/80 text-white transition-colors py-3 text-sm md:text-base"
              disabled={!isPasswordValid || isLoading || !isDiscordVerified || !isXVerified || !walletAddress}
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
