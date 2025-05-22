
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import CreatePasswordForm from './CreatePasswordForm';
import PasswordsList from './PasswordsList';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Password {
  id: string;
  password: string;
  community_name: string;
  created_at: string;
  max_uses: number | null;
  current_uses: number | null;
}

const PasswordManager = () => {
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [isLoadingPasswords, setIsLoadingPasswords] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  useEffect(() => {
    fetchPasswords();
  }, []);

  const fetchPasswords = async () => {
    try {
      setIsLoadingPasswords(true);
      console.log("Fetching passwords...");
      
      // Check if we have an authenticated session
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData?.session) {
        console.error("No authenticated session found");
        setGlobalError("You must be logged in to access password management.");
        setError("Authentication required");
        setIsLoadingPasswords(false);
        return;
      }
      
      console.log("Session found, user ID:", sessionData.session.user.id);
      
      // Fetch all passwords
      const { data, error: fetchError } = await supabase
        .from('community_passwords')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (fetchError) {
        console.error('Password fetch error:', fetchError);
        throw fetchError;
      }
      
      console.log("Passwords fetched successfully:", data);
      setPasswords(data || []);
      setError(null);
      setGlobalError(null);
    } catch (err: any) {
      console.error('Error fetching passwords:', err);
      setError('Failed to load community passwords');
      setGlobalError(err.message || "Unknown error occurred");
    } finally {
      setIsLoadingPasswords(false);
    }
  };

  const handlePasswordCreated = (newPassword: Password) => {
    console.log("New password created:", newPassword);
    setPasswords([newPassword, ...passwords]);
  };

  const handlePasswordDeleted = (id: string) => {
    console.log("Password deleted with ID:", id);
    setPasswords(passwords.filter(p => p.id !== id));
  };

  const handlePasswordError = (errorMessage: string) => {
    console.error("Password error:", errorMessage);
    setGlobalError(errorMessage);
  };

  return (
    <div className="space-y-8">
      {globalError && (
        <Alert variant="destructive" className="mb-6 bg-red-900/50 border-red-700 text-white">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <span>{globalError}</span>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 w-fit border-white/20 bg-white/10 hover:bg-white/20 text-white"
              onClick={fetchPasswords}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <CreatePasswordForm 
        onPasswordCreated={handlePasswordCreated} 
        onError={handlePasswordError}
      />
      
      <PasswordsList 
        passwords={passwords}
        isLoading={isLoadingPasswords}
        error={error}
        onPasswordDeleted={handlePasswordDeleted}
        onError={handlePasswordError}
      />
    </div>
  );
};

export default PasswordManager;
