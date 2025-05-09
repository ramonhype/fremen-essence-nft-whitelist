
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import CreatePasswordForm from './CreatePasswordForm';
import PasswordsList from './PasswordsList';

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

  useEffect(() => {
    fetchPasswords();
  }, []);

  const fetchPasswords = async () => {
    try {
      setIsLoadingPasswords(true);
      const { data, error } = await supabase
        .from('community_passwords')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setPasswords(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching passwords:', err);
      setError('Failed to load community passwords');
    } finally {
      setIsLoadingPasswords(false);
    }
  };

  const handlePasswordCreated = (newPassword: Password) => {
    setPasswords([newPassword, ...passwords]);
  };

  const handlePasswordDeleted = (id: string) => {
    setPasswords(passwords.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-8">
      <CreatePasswordForm onPasswordCreated={handlePasswordCreated} />
      <PasswordsList 
        passwords={passwords}
        isLoading={isLoadingPasswords}
        error={error}
        onPasswordDeleted={handlePasswordDeleted}
      />
    </div>
  );
};

export default PasswordManager;
