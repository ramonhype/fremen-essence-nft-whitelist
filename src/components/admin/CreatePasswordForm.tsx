
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
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const passwordSchema = z.object({
  community_name: z.string().min(1, "Community name is required"),
  password: z.string().min(1, "Password is required"),
  max_uses: z.string().optional(),
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

interface CreatePasswordFormProps {
  onPasswordCreated: (newPassword: any) => void;
  onError: (errorMessage: string) => void;
}

const CreatePasswordForm = ({ onPasswordCreated, onError }: CreatePasswordFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      community_name: '',
      password: '',
      max_uses: '',
    },
  });

  const handleCreatePassword = async (values: PasswordFormValues) => {
    setIsLoading(true);
    
    try {
      // Check if we have an authenticated session first
      const { data: sessionData } = await supabase.auth.getSession();
      console.log("Session before creating password:", sessionData);
      
      if (!sessionData?.session) {
        throw new Error("You must be logged in to create passwords");
      }
      
      // Convert maxUses to number or null if empty
      const parsedMaxUses = values.max_uses?.trim() !== '' 
        ? parseInt(values.max_uses!, 10) 
        : null;
      
      if (values.max_uses?.trim() !== '' && isNaN(parsedMaxUses as number)) {
        toast({
          title: "Invalid Input",
          description: "Maximum uses must be a valid number",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Log the data we're trying to insert
      console.log('Inserting password with data:', {
        password: values.password,
        community_name: values.community_name,
        max_uses: parsedMaxUses,
        current_uses: 0,
        active: true
      });

      // Perform the insert operation
      const { data, error: insertError } = await supabase
        .from('community_passwords')
        .insert({
          password: values.password,
          community_name: values.community_name,
          max_uses: parsedMaxUses,
          current_uses: 0,
          active: true
        })
        .select();
        
      if (insertError) {
        console.error('Supabase insert error details:', insertError);
        throw insertError;
      }
      
      if (data && data.length > 0) {
        console.log("Successfully created password:", data[0]);
        onPasswordCreated(data[0]);
        form.reset();
        
        toast({
          title: "Password Created",
          description: `Password for ${values.community_name} created successfully`,
        });
      } else {
        throw new Error("No data returned after password creation");
      }
    } catch (err: any) {
      console.error('Error creating password:', err);
      const errorMessage = err?.message || 'Unknown error';
      
      toast({
        title: "Error",
        description: `Failed to create password: ${errorMessage}`,
        variant: "destructive",
      });
      
      onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-[#394052] bg-[#1F2333] text-white">
      <CardHeader>
        <CardTitle>Create Community Password</CardTitle>
        <CardDescription className="text-gray-400">Generate passwords for different communities</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreatePassword)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="community_name"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-white">Community Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., Discord, Twitter"
                        className="border-[#394052] bg-[#2A2F3D] text-white focus:border-[#19E3E3]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-white">Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter secure password"
                        className="border-[#394052] bg-[#2A2F3D] text-white focus:border-[#19E3E3]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="max_uses"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-white">Max Uses (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number" 
                        min="1"
                        placeholder="Leave empty for unlimited"
                        className="border-[#394052] bg-[#2A2F3D] text-white focus:border-[#19E3E3]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button 
              type="submit" 
              className="mt-4 bg-[#6469FF] hover:bg-[#7478FF] text-white transition-colors"
              disabled={isLoading}
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
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreatePasswordForm;
