
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import PasswordManager from '@/components/admin/PasswordManager';
import WhitelistEntries from '@/components/admin/WhitelistEntries';

const Admin = () => {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('isAuthenticated');
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully",
      });
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Logout Failed",
        description: "There was an error logging out",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F4D3AF] relative">
      {/* Design elements */}
      <img 
        src="/lovable-uploads/1a8cc40d-5db4-4af8-892a-0d9d139ffb8c.png" 
        alt="" 
        className="absolute top-0 right-0 w-1/4 z-0 opacity-80"
        aria-hidden="true" 
      />
      <img 
        src="/lovable-uploads/96315555-c76f-42b9-a5f7-403e312f654e.png" 
        alt="" 
        className="absolute top-0 left-0 w-1/5 z-0 opacity-80"
        aria-hidden="true" 
      />
      <img 
        src="/lovable-uploads/cce19565-8e57-4e6e-87b3-8a5ba9ee91c9.png" 
        alt="" 
        className="absolute inset-0 w-full h-full z-0 opacity-5"
        aria-hidden="true" 
      />
      <img 
        src="/lovable-uploads/8a797feb-705c-4580-a886-fff6a268cf33.png" 
        alt="" 
        className="absolute bottom-0 left-0 w-full z-0 pointer-events-none"
        aria-hidden="true" 
      />
      
      {/* Header */}
      <header className="relative z-10 border-b border-black/10 bg-[#F4D3AF]/90 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/lovable-uploads/61a722fd-1842-4dd1-9fe5-80ed4f5ce6e7.png" alt="GAIB Logo" className="h-8" />
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 border-[#19E3E3]/50 hover:bg-[#19E3E3]/10"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </Button>
        </div>
      </header>
      
      <div className="container py-12 px-4 relative z-10">
        <div className="bg-gray-800/80 backdrop-blur-md shadow-md rounded-lg border border-gray-700 p-6">
          <Tabs defaultValue="passwords" className="w-full">
            <TabsList className="grid w-full md:w-[400px] grid-cols-2 mb-6 bg-gray-700/50">
              <TabsTrigger 
                value="passwords" 
                className="data-[state=active]:bg-[#19E3E3] data-[state=active]:text-black"
              >
                Passwords
              </TabsTrigger>
              <TabsTrigger 
                value="whitelist"
                className="data-[state=active]:bg-[#19E3E3] data-[state=active]:text-black"
              >
                Whitelist
              </TabsTrigger>
            </TabsList>
            <TabsContent value="passwords">
              <PasswordManager />
            </TabsContent>
            <TabsContent value="whitelist">
              <WhitelistEntries />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Admin;
