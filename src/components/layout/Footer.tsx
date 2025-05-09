
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-nft-border bg-nft-background">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <div className="rounded-full bg-nft-primary p-1">
                <div className="h-6 w-6 rounded-full bg-nft-background flex items-center justify-center">
                  <span className="text-nft-primary font-bold">W</span>
                </div>
              </div>
              <span className="font-bold text-lg">WhitelistPass</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              A secure platform for managing NFT whitelist registrations
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-nft-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-nft-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-sm text-muted-foreground hover:text-nft-primary transition-colors">
                  Admin
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://twitter.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-nft-primary transition-colors"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a 
                  href="https://discord.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-nft-primary transition-colors"
                >
                  Discord
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-nft-border">
          <p className="text-xs text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} WhitelistPass. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
