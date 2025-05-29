
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

  const validateFormState = () => {
    console.log('=== DETAILED FORM VALIDATION ===');
    console.log('Wallet Address:', walletAddress);
    console.log('Wallet Connected:', isConnected);
    console.log('Password Valid:', isPasswordValid);
    console.log('Password Value:', password ? '[HIDDEN]' : 'EMPTY');
    console.log('X Verified:', isXVerified);
    console.log('Discord Verified:', isDiscordVerified);
    console.log('Discord Username:', discordUsername);
    console.log('================================');

    const errors = [];

    if (!isConnected) {
      errors.push("Wallet is not connected to the application");
    }

    if (!walletAddress || walletAddress.trim() === '') {
      errors.push("Wallet address is empty or invalid");
    }

    if (!isPasswordValid) {
      errors.push("Community password has not been verified successfully");
    }

    if (!password || password.trim() === '') {
      errors.push("Community password is empty");
    }

    if (!isXVerified) {
      errors.push("X (Twitter) account verification is incomplete - you must follow @gaib_ai");
    }

    if (!isDiscordVerified) {
      errors.push("Discord verification is incomplete - you must join the Discord server and verify membership");
    }

    if (!discordUsername || discordUsername.trim() === '') {
      errors.push("Discord username is missing - Discord verification may have failed");
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('🚀 Starting registration submission...');
    
    // Detailed validation with specific error messages
    const validationErrors = validateFormState();
    
    if (validationErrors.length > 0) {
      console.error('❌ Form validation failed:', validationErrors);
      
      const errorMessage = validationErrors.length === 1 
        ? validationErrors[0]
        : `Multiple issues found:\n• ${validationErrors.join('\n• ')}`;
      
      toast({
        title: "Registration Failed - Validation Error",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }

    console.log('✅ Form validation passed, proceeding with registration...');

    setIsLoading(true);
    
    try {
      console.log('🔍 Step 1: Checking password data...');
      
      // Get password data and check max_uses again as a safety measure
      const { data: passwordData, error: passwordError } = await supabase
        .from('community_passwords')
        .select('id, max_uses, current_uses, active')
        .eq('password', password)
        .eq('active', true)
        .single();
      
      if (passwordError) {
        console.error('❌ Password query error:', passwordError);
        throw new Error(`Password verification failed: ${passwordError.message || 'Password not found or inactive'}`);
      }
      
      if (!passwordData) {
        console.error('❌ No password data returned');
        throw new Error("Password not found in database - the password may be invalid or inactive");
      }
      
      console.log('📊 Password data retrieved:', {
        id: passwordData.id,
        maxUses: passwordData.max_uses,
        currentUses: passwordData.current_uses,
        active: passwordData.active
      });
      
      // Double-check if usage limit has been reached
      if (passwordData.max_uses !== null && passwordData.current_uses >= passwordData.max_uses) {
        console.error('❌ Password usage limit reached');
        toast({
          title: "Registration Failed - Password Limit Reached",
          description: `This password has reached its maximum usage limit (${passwordData.current_uses}/${passwordData.max_uses} uses)`,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      console.log('🔍 Step 2: Checking for existing registration...');
      
      // Check if wallet is already registered
      const { data: existingRegistration, error: existingError } = await supabase
        .from('whitelist_registrations')
        .select('id, wallet_address, discord_username, created_at')
        .eq('wallet_address', walletAddress)
        .maybeSingle();
      
      if (existingError) {
        console.error('❌ Error checking existing registration:', existingError);
        throw new Error(`Database error when checking existing registrations: ${existingError.message}`);
      }
      
      if (existingRegistration) {
        console.error('❌ Wallet already registered:', existingRegistration);
        toast({
          title: "Registration Failed - Already Registered",
          description: `This wallet address (${walletAddress}) is already registered on ${new Date(existingRegistration.created_at).toLocaleDateString()}`,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      console.log('✅ No existing registration found, proceeding...');
      console.log('📝 Step 3: Preparing registration data...');
      
      // Insert registration data with actual password value and Discord username
      const registrationData = {
        wallet_address: walletAddress,
        discord_username: discordUsername,
        discord_verified: isDiscordVerified,
        password_id: password // Store the actual password value instead of the UUID
      };
      
      console.log('📋 Registration data prepared:', {
        wallet_address: registrationData.wallet_address,
        discord_username: registrationData.discord_username,
        discord_verified: registrationData.discord_verified,
        password_id: '[HIDDEN]'
      });
      
      console.log('💾 Step 4: Inserting registration into database...');
      
      const { data, error } = await supabase
        .from('whitelist_registrations')
        .insert(registrationData)
        .select('id')
        .single();
      
      if (error) {
        console.error('❌ Registration insert error:', error);
        
        if (error.code === '23505') { // Unique violation
          toast({
            title: "Registration Failed - Duplicate Entry",
            description: "This wallet address is already registered (unique constraint violation)",
            variant: "destructive",
          });
        } else if (error.code === '23503') { // Foreign key violation
          toast({
            title: "Registration Failed - Invalid Reference",
            description: "The provided password or Discord information is invalid (foreign key constraint)",
            variant: "destructive",
          });
        } else if (error.code === '23514') { // Check constraint violation
          toast({
            title: "Registration Failed - Data Validation",
            description: `Data validation failed: ${error.message}`,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Registration Failed - Database Error",
            description: `Database error (${error.code}): ${error.message}`,
            variant: "destructive",
          });
        }
        
        throw error;
      }
      
      if (!data || !data.id) {
        console.error('❌ No data returned from registration insert');
        throw new Error("Registration insert succeeded but no ID was returned - this may indicate a database issue");
      }
      
      console.log('✅ Registration successfully inserted with ID:', data.id);
      console.log('📈 Step 5: Updating password usage counter...');
      
      // Increment the current_uses counter
      const { error: updateError } = await supabase
        .from('community_passwords')
        .update({ current_uses: passwordData.current_uses + 1 })
        .eq('id', passwordData.id);
      
      if (updateError) {
        console.error('⚠️ Error updating password usage (registration still succeeded):', updateError);
        // Log the error but don't fail the registration since it's already complete
      } else {
        console.log('✅ Password usage counter updated successfully');
      }
      
      setRegistrationId(data.id);
      console.log('🎉 Registration completed successfully!');
      
      toast({
        title: "Registration Successful! 🎉",
        description: `Your wallet (${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}) has been successfully registered for the whitelist`,
      });
      
    } catch (error) {
      console.error('💥 Registration error:', error);
      
      let errorMessage = "An unexpected error occurred during registration. Please try again.";
      let errorTitle = "Registration Failed";
      
      if (error instanceof Error) {
        console.error('📝 Error details:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
        
        if (error.message.includes('fetch')) {
          errorTitle = "Network Error";
          errorMessage = "Unable to connect to the server. Please check your internet connection and try again.";
        } else if (error.message.includes('timeout')) {
          errorTitle = "Request Timeout";
          errorMessage = "The request timed out. Please try again.";
        } else if (error.message.includes('AbortError')) {
          errorTitle = "Request Interrupted";
          errorMessage = "The request was interrupted. Please try again.";
        } else if (error.message.includes('Password verification failed')) {
          errorTitle = "Password Error";
          errorMessage = error.message;
        } else if (error.message.includes('Database error')) {
          errorTitle = "Database Error";
          errorMessage = error.message;
        } else if (error.message.length > 0) {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: errorTitle,
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
