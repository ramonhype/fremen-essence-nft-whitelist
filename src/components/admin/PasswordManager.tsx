
import { useState } from 'react';
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
import { toast } from '@/hooks/use-toast';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Trash } from 'lucide-react';

// Placeholder data until Supabase integration
const MOCK_PASSWORDS = [
  { id: '1', password: 'demo123', community: 'Discord', created: '2025-04-10' },
  { id: '2', password: 'alpha456', community: 'Twitter', created: '2025-05-01' },
];

const PasswordManager = () => {
  const [passwords, setPasswords] = useState(MOCK_PASSWORDS);
  const [newPassword, setNewPassword] = useState('');
  const [newCommunity, setNewCommunity] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // This will be replaced with actual Supabase logic
    setTimeout(() => {
      const newPasswordEntry = {
        id: Date.now().toString(),
        password: newPassword,
        community: newCommunity,
        created: new Date().toISOString().split('T')[0]
      };
      
      setPasswords([...passwords, newPasswordEntry]);
      setNewPassword('');
      setNewCommunity('');
      setIsLoading(false);
      
      toast({
        title: "Password Created",
        description: `Password for ${newCommunity} created successfully`,
      });
    }, 1000);
  };

  const handleDeletePassword = (id: string) => {
    setPasswords(passwords.filter(p => p.id !== id));
    
    toast({
      title: "Password Deleted",
      description: "Community password has been removed",
    });
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
            <Button 
              type="submit" 
              className="mt-4 bg-nft-primary hover:bg-nft-secondary transition-colors"
              disabled={isLoading || !newPassword || !newCommunity}
            >
              {isLoading ? "Creating..." : "Create Password"}
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
          <div className="rounded-md border border-nft-border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-nft-muted/50">
                  <TableHead className="w-1/3">Community</TableHead>
                  <TableHead className="w-1/3">Password</TableHead>
                  <TableHead className="w-1/4">Created</TableHead>
                  <TableHead className="w-1/12 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {passwords.map((entry) => (
                  <TableRow key={entry.id} className="hover:bg-nft-muted/50">
                    <TableCell className="font-medium">{entry.community}</TableCell>
                    <TableCell className="font-mono">{entry.password}</TableCell>
                    <TableCell>{entry.created}</TableCell>
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
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      No passwords created yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordManager;
