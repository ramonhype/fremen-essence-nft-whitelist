
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
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                Secure your whitelist for our
                <span className="block text-[#4F9AF4]">
                  Fremen Essence NFT
                </span>
                <span className="block">
                  by GAIB
                </span>
              </h1>
              <p className="mt-4 text-lg text-white/80">
                Register your wallet to join the whitelist for the Fremen Essence NFT.
                <br /><br />
                Participate in the Spice Harvest campaign to invest in AI onchain and the launch of AID, the first AI synthetic dollar, by GAIB.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="bg-[#4F9AF4] hover:bg-[#4F9AF4]/80 text-white transition-colors"
                onClick={() => window.open('https://aid.gaib.ai/', '_blank')}
              >
                Learn More
              </Button>
            </div>
            
            <div className="pt-4 border-t border-white/20">
              <h3 className="text-lg font-semibold mb-2 text-white">Important Dates</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/10 p-4 rounded-md border border-white/20">
                  <div className="text-sm text-white/80">Whitelist Opens</div>
                  <div className="font-semibold text-white">May 16, 2025</div>
                </div>
                <div className="bg-white/10 p-4 rounded-md border border-white/20">
                  <div className="text-sm text-white/80">Whitelist Closes</div>
                  <div className="font-semibold text-white">June 15, 2025</div>
                </div>
                <div className="bg-white/10 p-4 rounded-md border border-white/20">
                  <div className="text-sm text-white/80">Public Mint</div>
                  <div className="font-semibold text-white">Q3 2025</div>
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
