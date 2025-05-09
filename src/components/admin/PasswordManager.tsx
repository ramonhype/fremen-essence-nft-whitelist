
import { useState, useEffect } from 'react';
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
import { toast } from '@/hooks/use-toast';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Trash, Loader2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

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
  const [newPassword, setNewPassword] = useState('');
  const [newCommunity, setNewCommunity] = useState('');
  const [maxUses, setMaxUses] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
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
    } catch (err) {
      console.error('Error fetching passwords:', err);
      setError('Failed to load community passwords');
    } finally {
      setIsLoadingPasswords(false);
    }
  };

  const handleCreatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Convert maxUses to number or null if empty
      const parsedMaxUses = maxUses.trim() !== '' ? parseInt(maxUses, 10) : null;
      
      if (maxUses.trim() !== '' && isNaN(parsedMaxUses as number)) {
        toast({
          title: "Invalid Input",
          description: "Maximum uses must be a valid number",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('community_passwords')
        .insert({
          password: newPassword,
          community_name: newCommunity,
          max_uses: parsedMaxUses,
          current_uses: 0
        })
        .select()
        .single();
        
      if (error) throw error;
      
      setPasswords([data, ...passwords]);
      setNewPassword('');
      setNewCommunity('');
      setMaxUses('');
      
      toast({
        title: "Password Created",
        description: `Password for ${newCommunity} created successfully`,
      });
    } catch (err) {
      console.error('Error creating password:', err);
      toast({
        title: "Error",
        description: "Failed to create password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePassword = async (id: string) => {
    try {
      const { error } = await supabase
        .from('community_passwords')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setPasswords(passwords.filter(p => p.id !== id));
      
      toast({
        title: "Password Deleted",
        description: "Community password has been removed",
      });
    } catch (err) {
      console.error('Error deleting password:', err);
      toast({
        title: "Error",
        description: "Failed to delete password",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-8">
      <Card className="border-nft-border bg-nft-background/60 backdrop-blur-md">
        <CardHeader>
          <CardTitle>Create Community Password</CardTitle>
          <CardDescription>Generate passwords for different communities</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreatePassword}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="community">Community Name</Label>
                <Input
                  id="community"
                  value={newCommunity}
                  onChange={(e) => setNewCommunity(e.target.value)}
                  placeholder="e.g., Discord, Twitter"
                  required
                  className="border-nft-border bg-nft-muted focus:border-nft-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter secure password"
                  required
                  className="border-nft-border bg-nft-muted focus:border-nft-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxUses">Max Uses (Optional)</Label>
                <Input
                  id="maxUses"
                  type="number"
                  min="1"
                  value={maxUses}
                  onChange={(e) => setMaxUses(e.target.value)}
                  placeholder="Leave empty for unlimited"
                  className="border-nft-border bg-nft-muted focus:border-nft-primary"
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="mt-4 bg-nft-primary hover:bg-nft-secondary transition-colors"
              disabled={isLoading || !newPassword || !newCommunity}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-nft-border bg-nft-background/60 backdrop-blur-md">
        <CardHeader>
          <CardTitle>Active Passwords</CardTitle>
          <CardDescription>Manage your community access passwords</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingPasswords ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-nft-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <div className="rounded-md border border-nft-border">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-nft-muted/50">
                    <TableHead className="w-1/4">Community</TableHead>
                    <TableHead className="w-1/4">Password</TableHead>
                    <TableHead className="w-1/6">Created</TableHead>
                    <TableHead className="w-1/6">Usage</TableHead>
                    <TableHead className="w-1/12 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {passwords.map((entry) => (
                    <TableRow key={entry.id} className="hover:bg-nft-muted/50">
                      <TableCell className="font-medium">{entry.community_name}</TableCell>
                      <TableCell className="font-mono">{entry.password}</TableCell>
                      <TableCell>{formatDate(entry.created_at)}</TableCell>
                      <TableCell>
                        {entry.current_uses || 0}
                        {entry.max_uses !== null && ` / ${entry.max_uses}`}
                        {entry.max_uses === null && ' (∞)'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeletePassword(entry.id)}
                        >
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {passwords.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        No passwords created yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordManager;
