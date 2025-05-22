
import React, { useEffect, useState } from 'react';
import { Wallet } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useAccount } from 'wagmi';

interface WalletDisplayProps {
  onWalletChange?: (address: string) => void;
}

const WalletDisplay = ({ onWalletChange }: WalletDisplayProps) => {
  const { address, isConnected } = useAccount();
  const [displayAddress, setDisplayAddress] = useState<string>('Please connect your wallet');
  
  useEffect(() => {
    if (isConnected && address) {
      setDisplayAddress(address);
      if (onWalletChange) {
        onWalletChange(address);
      }
    } else {
      setDisplayAddress('Please connect your wallet');
      if (onWalletChange) {
        onWalletChange('');
      }
    }
  }, [address, isConnected, onWalletChange]);
  
  return (
    <div className="space-y-2">
      <Label htmlFor="wallet">Wallet Address</Label>
      <div className="flex items-center p-3 rounded-md bg-nft-muted border border-nft-border">
        <Wallet className="h-4 w-4 mr-2 text-nft-primary" />
        <span className={`text-sm font-mono truncate ${isConnected ? "" : "text-muted-foreground"}`}>
          {displayAddress}
        </span>
      </div>
    </div>
  );
};

export default WalletDisplay;
