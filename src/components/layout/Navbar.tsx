
import React from 'react';
import { Link } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-nft-border bg-nft-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="rounded-full bg-nft-primary p-1">
              <div className="h-6 w-6 rounded-full bg-nft-background flex items-center justify-center">
                <span className="text-nft-primary font-bold">W</span>
              </div>
            </div>
            <span className="font-bold text-lg">WhitelistPass</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-nft-primary transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-sm font-medium hover:text-nft-primary transition-colors">
              About
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ConnectButton />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
