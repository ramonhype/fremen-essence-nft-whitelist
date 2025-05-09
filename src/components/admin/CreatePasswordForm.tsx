
import { useState } from 'react';
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
import { Loader2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

interface CreatePasswordFormProps {
  onPasswordCreated: (newPassword: any) => void;
}

const CreatePasswordForm = ({ onPasswordCreated }: CreatePasswordFormProps) => {
  const [newPassword, setNewPassword] = useState('');
  const [newCommunity, setNewCommunity] = useState('');
  const [maxUses, setMaxUses] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

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

      console.log('Inserting password with data:', {
        password: newPassword,
        community_name: newCommunity,
        max_uses: parsedMaxUses,
        current_uses: 0
      });

      const { data, error } = await supabase
        .from('community_passwords')
        .insert({
          password: newPassword,
          community_name: newCommunity,
          max_uses: parsedMaxUses,
          current_uses: 0,
          active: true
        })
        .select();
        
      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }
      
      if (data) {
        onPasswordCreated(data[0]);
        setNewPassword('');
        setNewCommunity('');
        setMaxUses('');
        
        toast({
          title: "Password Created",
          description: `Password for ${newCommunity} created successfully`,
        });
      }
    } catch (err: any) {
      console.error('Error creating password:', err);
      toast({
        title: "Error",
        description: `Failed to create password: ${err.message || 'Unknown error'}`,
        variant: "destructive",
      });
      setError(`Failed to create password: ${err.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
          {error && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive rounded-md text-destructive text-sm">
              {error}
            </div>
          )}
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
  );
};

export default CreatePasswordForm;
