
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { toast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Wallet, MessagesSquare, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { 
  getDiscordAuthUrl, 
  checkDiscordVerification, 
  DISCORD_SERVER_TO_JOIN,
  updateDiscordVerificationStatus
} from "@/utils/discordVerification";

const RegistrationForm = () => {
  const { address, isConnected } = useAccount();
  const [password, setPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDiscordVerified, setIsDiscordVerified] = useState(false);
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  
  // Check for Discord verification code on page load
  useEffect(() => {
    const checkDiscordAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (code) {
        // Remove code from URL to prevent multiple verification attempts
        window.history.replaceState({}, document.title, window.location.pathname);
        
        const { verified, message } = await checkDiscordVerification(code);
        setIsDiscordVerified(verified);
        
        toast({
          title: verified ? "Success" : "Verification Failed",
          description: message,
          variant: verified ? "default" : "destructive",
        });
        
        // If there's a registration ID and verification was successful, update it
        if (registrationId && verified) {
          await updateDiscordVerificationStatus(registrationId, true);
        }
      }
    };
    
    checkDiscordAuth();
  }, [registrationId]);
  
  const handleDiscordVerification = () => {
    // Redirect to Discord OAuth
    window.location.href = getDiscordAuthUrl();
  };

  const handlePasswordCheck = async () => {
    setIsLoading(true);
    
    try {
      // Check password against Supabase
      const { data, error } = await supabase
        .from('community_passwords')
        .select('id')
        .eq('password', password)
        .eq('active', true)
        .single();
      
      if (error) throw error;
      
      const isValid = !!data;
      setIsPasswordValid(isValid);
      
      if (isValid) {
        toast({
          title: "Success",
          description: "Password verified successfully",
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
        description: "Failed to verify password",
        variant: "destructive",
      });
      setIsPasswordValid(false);
    } finally {
      setIsLoading(false);
    }
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
      // Get password ID
      const { data: passwordData } = await supabase
        .from('community_passwords')
        .select('id')
        .eq('password', password)
        .single();
      
      if (!passwordData) throw new Error("Password not found");
      
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
    <Card className="w-full max-w-md border-nft-border bg-nft-background/60 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-2xl">Whitelist Registration</CardTitle>
        <CardDescription>Register your wallet for our upcoming NFT mint</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wallet">Wallet Address</Label>
              <div className="flex items-center p-3 rounded-md bg-nft-muted border border-nft-border">
                <Wallet className="h-4 w-4 mr-2 text-nft-primary" />
                <span className="text-sm font-mono truncate">
                  {isConnected ? address : "Please connect your wallet"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <span>Discord Verification</span>
                <span className="text-xs text-muted-foreground">
                  (Must be a member of {DISCORD_SERVER_TO_JOIN})
                </span>
              </Label>
              
              {isDiscordVerified ? (
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
          </div>
          <div className="mt-6">
            <Button 
              type="submit" 
              className="w-full bg-nft-primary hover:bg-nft-secondary transition-colors"
              disabled={!isConnected || !isPasswordValid || isLoading || !isDiscordVerified}
            >
              {isLoading ? "Submitting..." : "Register for Whitelist"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegistrationForm;
