
import React, { useState } from 'react';
import { Wallet } from 'lucide-react';
import { Label } from '@/components/ui/label';

const WalletDisplay = () => {
  const [address, setAddress] = useState('');
  
  return (
    <div className="space-y-2">
      <Label htmlFor="wallet">Wallet Address</Label>
      <div className="flex items-center p-3 rounded-md bg-nft-muted border border-nft-border">
        <Wallet className="h-4 w-4 mr-2 text-nft-primary" />
        <span className="text-sm font-mono truncate">
          Please enter your wallet address
        </span>
      </div>
    </div>
  );
};

export default WalletDisplay;
