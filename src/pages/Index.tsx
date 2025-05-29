import React from 'react';
import Layout from '@/components/layout/Layout';
import RegistrationForm from '@/components/RegistrationForm';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <Layout>
      <div className="container py-8 md:py-12 px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
          <div className="flex-1 space-y-4 md:space-y-6 text-center lg:text-left">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-black leading-tight">
                Secure your whitelist for our
                <span className="block text-[#19E3E3]">
                  Fremen Essence NFT
                </span>
                <span className="block">
                  by GAIB
                </span>
              </h1>
              <div className="mt-4 space-y-4 text-base md:text-lg text-black/80 text-left">
                <p>
                  Register your wallet to join the whitelist for the Fremen Essence NFT.
                </p>
                <p>
                  Participate in the Spice Harvest campaign to invest in AI onchain and the launch of AID, the first AI synthetic dollar, by GAIB.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                className="bg-[#19E3E3] hover:bg-[#19E3E3]/80 text-white transition-colors px-6 py-3"
                onClick={() => window.open('https://aid.gaib.ai/', '_blank')}
              >
                Learn More
              </Button>
            </div>
            
            <div className="pt-4 border-t border-black/20">
              <h3 className="text-base md:text-lg font-semibold mb-2 text-black">Important Dates</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                <div className="bg-white/30 p-3 md:p-4 rounded-md border border-black/10">
                  <div className="text-xs md:text-sm text-black/80">Whitelist Opens</div>
                  <div className="font-semibold text-black text-sm md:text-base">May 30, 2025</div>
                </div>
                <div className="bg-white/30 p-3 md:p-4 rounded-md border border-black/10">
                  <div className="text-xs md:text-sm text-black/80">Whitelist Closes</div>
                  <div className="font-semibold text-black text-sm md:text-base">June, 2025</div>
                </div>
                <div className="bg-white/30 p-3 md:p-4 rounded-md border border-black/10">
                  <div className="text-xs md:text-sm text-black/80">Public Mint</div>
                  <div className="font-semibold text-black text-sm md:text-base">Q3 2025</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-auto lg:min-w-[400px] lg:max-w-md relative z-10">
            <RegistrationForm />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
