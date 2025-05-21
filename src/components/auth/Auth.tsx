
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  // Check if the admin user already exists
  useEffect(() => {
    const checkAdminUser = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', 'ramon@hype.partners');

        if (error) {
          console.error('Error checking admin user:', error);
          return;
        }

        // If the user doesn't exist, we should register them
        setIsRegistering(data.length === 0);
      } catch (err) {
        console.error('Error checking admin user:', err);
      }
    };

    checkAdminUser();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Try to sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      if (data?.user) {
        // Check if the user is in the admin_users table
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', data.user.id);

        if (adminError) {
          toast.error('Error verifying admin permissions');
          setLoading(false);
          return;
        }

        if (!adminData || adminData.length === 0) {
          toast.error('Not authorized as admin');
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }

        // Store auth state in localStorage
        localStorage.setItem('isAuthenticated', 'true');
        toast.success('Login successful');
        navigate('/admin');
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error('An unexpected error occurred');
    }

    setLoading(false);
  };

  const handleRegister = async () => {
    setLoading(true);

    // Predefined credentials
    const adminEmail = 'ramon@hype.partners';
    const adminPassword = 'rcy0jvu2uyg!YXT9nvr';

    try {
      // Register the admin user
      const { data, error } = await supabase.auth.signUp({
        email: adminEmail,
        password: adminPassword
      });

      if (error) {
        toast.error(`Registration error: ${error.message}`);
        setLoading(false);
        return;
      }

      if (data.user) {
        // Add the user to admin_users table
        const { error: adminError } = await supabase
          .from('admin_users')
          .insert([{ id: data.user.id }]);

        if (adminError) {
          toast.error(`Error creating admin: ${adminError.message}`);
          setLoading(false);
          return;
        }

        toast.success('Admin user registered successfully');
        setIsRegistering(false);
        
        // Pre-fill the login form with admin credentials
        setEmail(adminEmail);
        setPassword(adminPassword);
      }
    } catch (err) {
      console.error('Registration error:', err);
      toast.error('An unexpected error occurred during registration');
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-nft-background">
      {isRegistering ? (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Registration</CardTitle>
            <CardDescription>Register the admin account to continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You need to create the admin account with the following credentials:
            </p>
            <div className="p-3 bg-muted rounded-md">
              <p><strong>Email:</strong> ramon@hype.partners</p>
              <p><strong>Password:</strong> rcy0jvu2uyg!YXT9nvr</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleRegister} 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Creating Admin...' : 'Create Admin Account'}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Enter your credentials to access the admin dashboard</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  );
};

export default Auth;
