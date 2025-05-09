
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import CreatePasswordForm from './CreatePasswordForm';
import PasswordsList from './PasswordsList';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';

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
      
      // Check if we have an authenticated session
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        setGlobalError("You must be logged in to access password management.");
        setError("Authentication required");
        return;
      }
      
      const { data, error: fetchError } = await supabase
        .from('community_passwords')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (fetchError) throw fetchError;
      
      console.log("Fetched passwords:", data);
      setPasswords(data || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching passwords:', err);
      setError('Failed to load community passwords');
      if (err.message.includes('row-level security')) {
        setGlobalError("Permission error: Your account doesn't have access to manage passwords.");
      }
    } finally {
      setIsLoadingPasswords(false);
    }
  };

  const handlePasswordCreated = (newPassword: Password) => {
    setPasswords([newPassword, ...passwords]);
    setGlobalError(null);
  };

  const handlePasswordDeleted = (id: string) => {
    setPasswords(passwords.filter(p => p.id !== id));
  };

  const handlePasswordError = (errorMessage: string) => {
    if (errorMessage.includes('row-level security')) {
      setGlobalError("Permission error: Your account doesn't have access to manage passwords.");
    } else {
      setGlobalError(errorMessage);
    }
  };

  return (
    <div className="space-y-8">
      {globalError && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{globalError}</AlertDescription>
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
