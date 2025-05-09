
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
import { Wallet, Twitter, CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { verifyTwitterFollower, TWITTER_ACCOUNT_TO_FOLLOW } from "@/utils/twitterVerification";

const RegistrationForm = () => {
  const { address, isConnected } = useAccount();
  const [name, setName] = useState('');
  const [twitter, setTwitter] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingTwitter, setIsVerifyingTwitter] = useState(false);
  const [isTwitterVerified, setIsTwitterVerified] = useState(false);
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

  const handleTwitterVerification = async () => {
    if (!twitter) {
      toast({
        title: "Error",
        description: "Please enter your Twitter username",
        variant: "destructive",
      });
      return;
    }

    setIsVerifyingTwitter(true);
    
    try {
      const { verified, message } = await verifyTwitterFollower(twitter);
      
      setIsTwitterVerified(verified);
      
      toast({
        title: verified ? "Success" : "Verification Failed",
        description: message,
        variant: verified ? "default" : "destructive",
      });
      
      // If already registered, update the verification status
      if (registrationId) {
        await supabase
          .from('whitelist_registrations')
          .update({ twitter_verified: verified })
          .eq('id', registrationId);
      }
    } catch (error) {
      console.error('Error verifying Twitter:', error);
      toast({
        title: "Error",
        description: "Failed to verify Twitter follow status",
        variant: "destructive",
      });
    } finally {
      setIsVerifyingTwitter(false);
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
          twitter_username: twitter,
          twitter_verified: isTwitterVerified,
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
              <Label htmlFor="twitter" className="flex items-center space-x-2">
                <span>Twitter Username</span>
                <span className="text-xs text-muted-foreground">
                  (Must follow @{TWITTER_ACCOUNT_TO_FOLLOW})
                </span>
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 inset-y-0 flex items-center text-muted-foreground">@</span>
                  <Input
                    id="twitter"
                    value={twitter}
                    onChange={(e) => {
                      setTwitter(e.target.value);
                      setIsTwitterVerified(false); // Reset verification on change
                    }}
                    className="pl-7 border-nft-border bg-nft-muted focus:border-nft-primary"
                    placeholder="username"
                    required
                  />
                </div>
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={handleTwitterVerification}
                  disabled={!twitter || isVerifyingTwitter}
                  className="flex items-center gap-2"
                >
                  {isVerifyingTwitter ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Verifying</span>
                    </>
                  ) : isTwitterVerified ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Verified</span>
                    </>
                  ) : (
                    <>
                      <Twitter className="h-4 w-4" />
                      <span>Verify</span>
                    </>
                  )}
                </Button>
              </div>
              {isTwitterVerified && (
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Twitter follow verified
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
              disabled={!isConnected || !isPasswordValid || !name || !twitter || isLoading || !isTwitterVerified}
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
