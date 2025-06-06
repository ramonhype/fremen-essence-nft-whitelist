
import React from 'react';
import { Link } from 'react-router-dom';
import WalletConnect from '../wallet/WalletConnect';

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/20 bg-[#F4D3AF]/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/61a722fd-1842-4dd1-9fe5-80ed4f5ce6e7.png" 
              alt="GAIB Logo" 
              className="h-6 md:h-8 w-auto" 
            />
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <WalletConnect />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
