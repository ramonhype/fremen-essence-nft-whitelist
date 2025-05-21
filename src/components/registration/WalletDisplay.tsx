
import React from 'react';
import { Wallet } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface WalletDisplayProps {
  address?: string;
  isConnected?: boolean;
}

const WalletDisplay = ({ address, isConnected }: WalletDisplayProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="wallet">Wallet Address</Label>
      <div className="flex items-center p-3 rounded-md bg-nft-muted border border-nft-border">
        <Wallet className="h-4 w-4 mr-2 text-nft-primary" />
        <span className="text-sm font-mono truncate">
          {isConnected ? address : "Wallet connection disabled"}
        </span>
      </div>
    </div>
  );
};

export default WalletDisplay;
