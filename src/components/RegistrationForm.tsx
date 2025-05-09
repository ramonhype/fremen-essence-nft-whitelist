
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
import { Wallet } from 'lucide-react';

const RegistrationForm = () => {
  const { address, isConnected } = useAccount();
  const [name, setName] = useState('');
  const [twitter, setTwitter] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handlePasswordCheck = async () => {
    setIsLoading(true);
    // This will be replaced with actual Supabase logic once integrated
    setTimeout(() => {
      setIsPasswordValid(password === "demo123"); // Placeholder validation
      setIsLoading(false);
      if (password === "demo123") {
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
    }, 1000);
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
    // This will be replaced with actual Supabase registration logic
    setTimeout(() => {
      toast({
        title: "Registration Successful",
        description: "Your wallet has been registered for the whitelist",
      });
      setIsLoading(false);
    }, 1500);
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
              <Label htmlFor="twitter">Twitter Username</Label>
              <div className="relative">
                <span className="absolute left-3 inset-y-0 flex items-center text-muted-foreground">@</span>
                <Input
                  id="twitter"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  className="pl-7 border-nft-border bg-nft-muted focus:border-nft-primary"
                  placeholder="username"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Community Password</Label>
              <div className="flex gap-2">
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                <p className="text-xs text-green-500">Password verified</p>
              )}
            </div>
          </div>
          <div className="mt-6">
            <Button 
              type="submit" 
              className="w-full bg-nft-primary hover:bg-nft-secondary transition-colors"
              disabled={!isConnected || !isPasswordValid || !name || !twitter || isLoading}
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
