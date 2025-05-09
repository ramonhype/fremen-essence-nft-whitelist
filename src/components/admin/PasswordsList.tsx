
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Trash, Loader2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Password {
  id: string;
  password: string;
  community_name: string;
  created_at: string;
  max_uses: number | null;
  current_uses: number | null;
}

interface PasswordsListProps {
  passwords: Password[];
  isLoading: boolean;
  error: string | null;
  onPasswordDeleted: (id: string) => void;
  onError: (errorMessage: string) => void;
}

const PasswordsList = ({ 
  passwords, 
  isLoading, 
  error,
  onPasswordDeleted,
  onError
}: PasswordsListProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const handleDeletePassword = async (id: string) => {
    try {
      setDeletingId(id);
      
      // Check if we have an authenticated session first
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) {
        throw new Error("You must be logged in to delete passwords");
      }
      
      const { error: deleteError } = await supabase
        .from('community_passwords')
        .delete()
        .eq('id', id);
        
      if (deleteError) throw deleteError;
      
      onPasswordDeleted(id);
      
      toast({
        title: "Password Deleted",
        description: "Community password has been removed",
      });
    } catch (err: any) {
      console.error('Error deleting password:', err);
      const errorMessage = err?.message || 'Unknown error';
      
      toast({
        title: "Error",
        description: `Failed to delete password: ${errorMessage}`,
        variant: "destructive",
      });
      
      onError(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Card className="border-nft-border bg-nft-background/60 backdrop-blur-md">
      <CardHeader>
        <CardTitle>Active Passwords</CardTitle>
        <CardDescription>Manage your community access passwords</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
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
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={deletingId === entry.id}
                          >
                            {deletingId === entry.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash className="h-4 w-4 text-destructive" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Password</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete the password for {entry.community_name}? 
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeletePassword(entry.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
  );
};

export default PasswordsList;
