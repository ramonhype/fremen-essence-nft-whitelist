
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  // Check if user is already authenticated on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is authenticated with Supabase
        const { data } = await supabase.auth.getSession();
        console.log("Auth check - session data:", data);
        
        if (data?.session) {
          console.log("Valid session found, user ID:", data.session.user.id);
          localStorage.setItem('isAuthenticated', 'true');
          setIsAuthenticated(true);
        } else {
          console.log("No valid session found");
          // Fallback to localStorage check for backward compatibility
          const authStatus = localStorage.getItem('isAuthenticated') === 'true';
          setIsAuthenticated(authStatus);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);
    
    try {
      console.log("Attempting login with email:", email);
      
      // Try to sign in with the provided credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Login error:", error);
        if (error.message.includes('Email logins are disabled')) {
          setLoginError('Email logins are disabled in the Supabase project settings. Please enable them in your Supabase dashboard under Authentication > Providers > Email.');
        } else if (error.message.includes('Invalid login credentials')) {
          setLoginError('Invalid login credentials. Please try again or create an admin account.');
        } else {
          setLoginError(error.message);
        }
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      
      if (data.user) {
        console.log("Login successful, user ID:", data.user.id);
        
        // Add the user to admin_users table if not already there
        const { error: adminError } = await supabase
          .from('admin_users')
          .insert([{ id: data.user.id }])
          .select()
          .single();
        
        // It's okay if there's an error from the insert - could be a duplicate
        if (adminError) {
          console.log("Admin user insert note:", adminError.message);
        }
        
        localStorage.setItem('isAuthenticated', 'true');
        setIsAuthenticated(true);
        
        toast({
          title: "Login Successful",
          description: "You are now logged in as admin",
        });
      }
    } catch (error) {
      console.error('Unexpected login error:', error);
      setLoginError('An unexpected error occurred');
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);
    
    try {
      console.log("Attempting to register with email:", email);
      
      // Register the admin user
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) {
        console.error("Registration error:", error);
        if (error.message.includes('Email logins are disabled')) {
          setLoginError('Email logins are disabled in the Supabase project settings. Please enable them in your Supabase dashboard under Authentication > Providers > Email.');
        } else {
          setLoginError(error.message);
        }
        setIsLoading(false);
        return;
      }
      
      if (data.user) {
        console.log("Registration successful, user ID:", data.user.id);
        
        // No need to check for admin status - just add the user to admin_users
        const { error: adminError } = await supabase
          .from('admin_users')
          .insert([{ id: data.user.id }])
          .select()
          .single();
          
        if (adminError && !adminError.message.includes('duplicate')) {
          console.error("Error creating admin user:", adminError);
          setLoginError(`Error creating admin: ${adminError.message}`);
          setIsLoading(false);
          return;
        }
        
        toast({
          title: "Admin Account Created",
          description: "You can now log in with your credentials",
        });
        
        // Try to sign in immediately
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) {
          console.error("Auto-login error after registration:", signInError);
          setLoginError(`Account created but couldn't log in: ${signInError.message}`);
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
    } catch (err: any) {
      console.error('Unexpected registration error:', err);
      setLoginError('An unexpected error occurred during registration');
    }
    
    setIsLoading(false);
  };

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F4D3AF]">
        <Loader2 className="h-8 w-8 animate-spin text-[#19E3E3]" />
      </div>
    );
  }

  // If authenticated, render children
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // If not authenticated, show login form
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F4D3AF] p-4 relative">
      {/* Design elements */}
      <img 
        src="/lovable-uploads/1a8cc40d-5db4-4af8-892a-0d9d139ffb8c.png" 
        alt="" 
        className="absolute top-0 right-0 w-1/3 z-0 opacity-80"
        aria-hidden="true" 
      />
      <img 
        src="/lovable-uploads/96315555-c76f-42b9-a5f7-403e312f654e.png" 
        alt="" 
        className="absolute top-0 left-0 w-1/4 z-0 opacity-80"
        aria-hidden="true" 
      />
      <img 
        src="/lovable-uploads/cce19565-8e57-4e6e-87b3-8a5ba9ee91c9.png" 
        alt="" 
        className="absolute inset-0 w-full h-full z-0 opacity-5"
        aria-hidden="true" 
      />
      <img 
        src="/lovable-uploads/8a797feb-705c-4580-a886-fff6a268cf33.png" 
        alt="" 
        className="absolute bottom-0 left-0 w-full z-0 pointer-events-none"
        aria-hidden="true" 
      />
      
      <Card className="w-full max-w-md border-[#19E3E3]/20 bg-white/90 backdrop-blur-md shadow-xl z-10">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <img src="/lovable-uploads/61a722fd-1842-4dd1-9fe5-80ed4f5ce6e7.png" alt="GAIB Logo" className="h-10" />
          </div>
          <CardTitle className="text-2xl text-center font-bold">Admin Access</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loginError && (
            <Alert variant="destructive" className="mb-4 bg-red-500/10 text-red-600 border-red-200">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}
          
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="border-gray-200 bg-white/50 focus:border-[#19E3E3]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="border-gray-200 bg-white/50 focus:border-[#19E3E3] pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 pt-2">
              <Button 
                onClick={handleLogin}
                className="w-full bg-[#19E3E3] hover:bg-[#19E3E3]/80 text-white transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>Logging in...</span>
                  </>
                ) : 'Login'}
              </Button>
              
              <Button 
                onClick={handleRegister}
                className="w-full bg-white border border-[#19E3E3] text-[#19E3E3] hover:bg-[#19E3E3]/10 transition-colors"
                disabled={isLoading}
                type="button"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>Creating Account...</span>
                  </>
                ) : 'Create Admin Account'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthGuard;
