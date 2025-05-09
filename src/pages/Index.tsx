
import React from 'react';
import Layout from '@/components/layout/Layout';
import RegistrationForm from '@/components/RegistrationForm';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <Layout>
      <div className="container py-12 px-4">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Secure your spot for our upcoming
                <span className="block text-transparent bg-clip-text bg-nft-gradient animate-gradient bg-gradient-animate">
                  NFT Collection
                </span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Register your wallet to join our exclusive whitelist. 
                Follow us on social media and secure your chance to mint our unique NFTs before everyone else.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-nft-primary hover:bg-nft-secondary transition-colors">
                Learn More
              </Button>
              <Button variant="outline" className="border-nft-border hover:bg-nft-muted transition-colors">
                View Collection
              </Button>
            </div>
            
            <div className="pt-4 border-t border-nft-border">
              <h3 className="text-lg font-semibold mb-2">Important Dates</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-nft-muted p-4 rounded-md border border-nft-border">
                  <div className="text-sm text-muted-foreground">Whitelist Opens</div>
                  <div className="font-semibold">May 10, 2025</div>
                </div>
                <div className="bg-nft-muted p-4 rounded-md border border-nft-border">
                  <div className="text-sm text-muted-foreground">Whitelist Closes</div>
                  <div className="font-semibold">May 20, 2025</div>
                </div>
                <div className="bg-nft-muted p-4 rounded-md border border-nft-border">
                  <div className="text-sm text-muted-foreground">Public Mint</div>
                  <div className="font-semibold">May 25, 2025</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-auto md:min-w-[400px] md:max-w-md">
            <RegistrationForm />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
