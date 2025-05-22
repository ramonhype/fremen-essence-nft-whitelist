
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
      console.log("Attempting to delete password with ID:", id);
      
      // Check if we have an authenticated session first
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) {
        throw new Error("You must be logged in to delete passwords");
      }
      
      console.log("Authenticated session confirmed, proceeding with deletion");
      
      const { error: deleteError } = await supabase
        .from('community_passwords')
        .delete()
        .eq('id', id);
        
      if (deleteError) {
        console.error("Delete error:", deleteError);
        throw deleteError;
      }
      
      console.log("Password deleted successfully");
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
    <Card className="border-[#394052] bg-[#1F2333] text-white">
      <CardHeader>
        <CardTitle>Active Passwords</CardTitle>
        <CardDescription className="text-gray-400">Manage your community access passwords</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-[#19E3E3]" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-400">{error}</div>
        ) : (
          <div className="rounded-md border border-[#394052]">
            <Table>
              <TableHeader className="bg-[#2A2F3D]">
                <TableRow className="hover:bg-[#343B4F] border-b border-[#394052]">
                  <TableHead className="w-1/4 text-gray-300">Community</TableHead>
                  <TableHead className="w-1/4 text-gray-300">Password</TableHead>
                  <TableHead className="w-1/6 text-gray-300">Created</TableHead>
                  <TableHead className="w-1/6 text-gray-300">Usage</TableHead>
                  <TableHead className="w-1/12 text-right text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {passwords.length > 0 ? (
                  passwords.map((entry) => (
                    <TableRow key={entry.id} className="hover:bg-[#343B4F] border-b border-[#394052]">
                      <TableCell className="font-medium text-white">{entry.community_name}</TableCell>
                      <TableCell className="font-mono text-[#19E3E3]">{entry.password}</TableCell>
                      <TableCell className="text-gray-300">{formatDate(entry.created_at)}</TableCell>
                      <TableCell className="text-gray-300">
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
                              className="hover:bg-red-900/30"
                            >
                              {deletingId === entry.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash className="h-4 w-4 text-red-400" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-[#2A2F3D] border-[#394052] text-white">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Password</AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-400">
                                Are you sure you want to delete the password for {entry.community_name}? 
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-[#394052] bg-[#1F2333] text-white hover:bg-[#343B4F]">Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeletePassword(entry.id)}
                                className="bg-red-600 text-white hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-gray-400">
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
