
import React from 'react';
import { Link } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/20 bg-[#F09600]/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <img src="/lovable-uploads/a3ea4fc0-78c8-4624-989a-5c56513c125f.png" alt="GAIB Logo" className="h-8" />
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="https://gaib.ai/" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-white hover:text-[#4F9AF4] transition-colors">
              GAIB
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
