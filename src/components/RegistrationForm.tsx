
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { toast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Wallet, MessageSquare, CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { verifyDiscordMember, DISCORD_SERVER_TO_JOIN } from "@/utils/discordVerification";

const RegistrationForm = () => {
  const { address, isConnected } = useAccount();
  const [name, setName] = useState('');
  const [discord, setDiscord] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingDiscord, setIsVerifyingDiscord] = useState(false);
  const [isDiscordVerified, setIsDiscordVerified] = useState(false);
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  
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

  const handleDiscordVerification = async () => {
    if (!discord) {
      toast({
        title: "Error",
        description: "Please enter your Discord username",
        variant: "destructive",
      });
      return;
    }

    setIsVerifyingDiscord(true);
    
    try {
      const { verified, message } = await verifyDiscordMember(discord);
      
      setIsDiscordVerified(verified);
      
      toast({
        title: verified ? "Success" : "Verification Failed",
        description: message,
        variant: verified ? "default" : "destructive",
      });
      
      // If already registered, update the verification status
      if (registrationId) {
        await supabase
          .from('whitelist_registrations')
          .update({ discord_verified: verified })
          .eq('id', registrationId);
      }
    } catch (error) {
      console.error('Error verifying Discord:', error);
      toast({
        title: "Error",
        description: "Failed to verify Discord membership status",
        variant: "destructive",
      });
    } finally {
      setIsVerifyingDiscord(false);
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

    setIsLoading(true);
    
    try {
      // Get password ID
      const { data: passwordData } = await supabase
        .from('community_passwords')
        .select('id')
        .eq('password', password)
        .single();
      
      if (!passwordData) throw new Error("Password not found");
      
      // Insert registration data
      const { data, error } = await supabase
        .from('whitelist_registrations')
        .insert({
          wallet_address: address,
          name,
          discord_username: discord,
          discord_verified: isDiscordVerified,
          password_id: passwordData.id
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
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="border-nft-border bg-nft-muted focus:border-nft-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discord" className="flex items-center space-x-2">
                <span>Discord Username</span>
                <span className="text-xs text-muted-foreground">
                  (Must be a member of {DISCORD_SERVER_TO_JOIN})
                </span>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="discord"
                  value={discord}
                  onChange={(e) => {
                    setDiscord(e.target.value);
                    setIsDiscordVerified(false); // Reset verification on change
                  }}
                  className="border-nft-border bg-nft-muted focus:border-nft-primary"
                  placeholder="username#0000"
                  required
                />
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={handleDiscordVerification}
                  disabled={!discord || isVerifyingDiscord}
                  className="flex items-center gap-2"
                >
                  {isVerifyingDiscord ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Verifying</span>
                    </>
                  ) : isDiscordVerified ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Verified</span>
                    </>
                  ) : (
                    <>
                      <MessageSquare className="h-4 w-4" />
                      <span>Verify</span>
                    </>
                  )}
                </Button>
              </div>
              {isDiscordVerified && (
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Discord membership verified
                </p>
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
              disabled={!isConnected || !isPasswordValid || !name || !discord || isLoading || !isDiscordVerified}
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
