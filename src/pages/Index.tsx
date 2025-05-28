
import React from 'react';
import Layout from '@/components/layout/Layout';
import RegistrationForm from '@/components/RegistrationForm';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <Layout>
      <div className="container py-12 px-4 relative z-10">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-black">
                Secure your whitelist for our
                <span className="block text-[#19E3E3]">
                  Fremen Essence NFT
                </span>
                <span className="block">
                  by GAIB
                </span>
              </h1>
              <p className="mt-4 text-lg text-black/80">
                Register your wallet to join the whitelist for the Fremen Essence NFT.
                <br /><br />
                Participate in the Spice Harvest campaign to invest in AI onchain and the launch of AID, the first AI synthetic dollar, by GAIB.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="bg-[#19E3E3] hover:bg-[#19E3E3]/80 text-white transition-colors"
                onClick={() => window.open('https://aid.gaib.ai/', '_blank')}
              >
                Learn More
              </Button>
            </div>
            
            <div className="pt-4 border-t border-black/20">
              <h3 className="text-lg font-semibold mb-2 text-black">Important Dates</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/30 p-4 rounded-md border border-black/10">
                  <div className="text-sm text-black/80">Whitelist Opens</div>
                  <div className="font-semibold text-black">May 30, 2025</div>
                </div>
                <div className="bg-white/30 p-4 rounded-md border border-black/10">
                  <div className="text-sm text-black/80">Whitelist Closes</div>
                  <div className="font-semibold text-black">June, 2025</div>
                </div>
                <div className="bg-white/30 p-4 rounded-md border border-black/10">
                  <div className="text-sm text-black/80">Public Mint</div>
                  <div className="font-semibold text-black">Q3 2025</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-auto md:min-w-[400px] md:max-w-md relative z-10">
            <RegistrationForm />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
