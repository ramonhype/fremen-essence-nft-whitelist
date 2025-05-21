
import React from 'react';
import { Wallet } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useAccount } from 'wagmi';

const WalletDisplay = () => {
  const { address, isConnected } = useAccount();

  return (
    <div className="space-y-2">
      <Label htmlFor="wallet">Wallet Address</Label>
      <div className="flex items-center p-3 rounded-md bg-nft-muted border border-nft-border">
        <Wallet className="h-4 w-4 mr-2 text-nft-primary" />
        <span className="text-sm font-mono truncate">
          {isConnected ? address : "Please connect your wallet"}
        </span>
      </div>
      {isConnected && (
        <p className="text-xs text-green-500 flex items-center gap-1">
          Wallet connected
        </p>
      )}
    </div>
  );
};

export default WalletDisplay;
