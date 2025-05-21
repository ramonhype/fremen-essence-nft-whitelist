
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if user is already authenticated on component mount
  useEffect(() => {
    const checkAuth = async () => {
      // Check if user is authenticated with Supabase
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Verify that the user is in admin_users
        const { data, error } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', session.user.id);
        
        if (error) {
          console.error('Error checking admin status:', error);
          setIsAuthenticated(false);
          return;
        }
        
        if (data && data.length > 0) {
          localStorage.setItem('isAuthenticated', 'true');
          setIsAuthenticated(true);
        } else {
          // User is authenticated but not an admin
          await supabase.auth.signOut();
          setIsAuthenticated(false);
        }
      } else {
        // Fallback to localStorage check for backward compatibility
        const authStatus = localStorage.getItem('isAuthenticated') === 'true';
        setIsAuthenticated(authStatus);
      }
    };
    
    checkAuth();
  }, []);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      
      // Check if the user is an admin
      if (data.user) {
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', data.user.id);
        
        if (adminError) {
          toast({
            title: "Verification Failed",
            description: "Could not verify admin status",
            variant: "destructive",
          });
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }
        
        if (!adminData || adminData.length === 0) {
          toast({
            title: "Access Denied",
            description: "You are not authorized as an admin",
            variant: "destructive",
          });
          await supabase.auth.signOut();
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }
        
        localStorage.setItem('isAuthenticated', 'true');
        setIsAuthenticated(true);
        
        toast({
          title: "Login Successful",
          description: "You are now logged in as admin",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-nft-primary" />
      </div>
    );
  }

  // If authenticated, render children
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // If not authenticated, show login form
  return (
    <div className="flex justify-center items-center min-h-screen bg-nft-background p-4">
      <Card className="w-full max-w-md border-nft-border bg-nft-background/60 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the admin dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="border-nft-border bg-nft-muted focus:border-nft-primary"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="border-nft-border bg-nft-muted focus:border-nft-primary"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-nft-primary hover:bg-nft-secondary transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Logging in...</span>
                </>
              ) : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthGuard;
