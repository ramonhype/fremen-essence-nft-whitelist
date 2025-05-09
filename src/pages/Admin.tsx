
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import PasswordManager from '@/components/admin/PasswordManager';
import WhitelistEntries from '@/components/admin/WhitelistEntries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Admin = () => {
  return (
    <Layout>
      <div className="container py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <Tabs defaultValue="passwords" className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2 mb-6">
            <TabsTrigger value="passwords">Passwords</TabsTrigger>
            <TabsTrigger value="whitelist">Whitelist</TabsTrigger>
          </TabsList>
          <TabsContent value="passwords">
            <PasswordManager />
          </TabsContent>
          <TabsContent value="whitelist">
            <WhitelistEntries />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;
