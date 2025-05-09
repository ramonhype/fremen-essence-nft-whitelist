
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  return (
    <Layout>
      <div className="container py-12 px-4">
        <h1 className="text-4xl font-bold mb-8">About Our Project</h1>
        
        <div className="space-y-8">
          <Card className="border-nft-border bg-nft-background/60 backdrop-blur-md">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">Our NFT Collection</h2>
              <p className="text-muted-foreground">
                Our upcoming NFT collection features unique digital artwork created by renowned digital artists.
                Each piece is meticulously crafted and offers exclusive benefits to holders including access to
                future drops, community events, and special privileges within our ecosystem.
              </p>
            </CardContent>
          </Card>

          <Card className="border-nft-border bg-nft-background/60 backdrop-blur-md">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">Whitelist Benefits</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="bg-nft-muted p-4 rounded-md border border-nft-border">
                  <h3 className="font-semibold mb-2">Early Access</h3>
                  <p className="text-sm text-muted-foreground">
                    Be among the first to mint our exclusive NFTs before they're available to the public.
                  </p>
                </div>
                <div className="bg-nft-muted p-4 rounded-md border border-nft-border">
                  <h3 className="font-semibold mb-2">Guaranteed Allocation</h3>
                  <p className="text-sm text-muted-foreground">
                    Secure your chance to mint without competing during the public sale rush.
                  </p>
                </div>
                <div className="bg-nft-muted p-4 rounded-md border border-nft-border">
                  <h3 className="font-semibold mb-2">Lower Gas Fees</h3>
                  <p className="text-sm text-muted-foreground">
                    Scheduled minting windows help avoid gas wars and network congestion.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-nft-border bg-nft-background/60 backdrop-blur-md">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">How to Join the Whitelist</h2>
              <ol className="space-y-4 list-decimal list-inside text-muted-foreground">
                <li>Connect your wallet using the button in the top right</li>
                <li>Fill out the registration form with your name and Twitter handle</li>
                <li>Enter the community password provided by your community admin</li>
                <li>Submit your registration and wait for Twitter verification</li>
                <li>Once verified, you'll be added to the whitelist for the upcoming mint</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default About;
