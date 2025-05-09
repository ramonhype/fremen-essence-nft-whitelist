
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-white/20 bg-[#F09600]">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <img src="/lovable-uploads/a3ea4fc0-78c8-4624-989a-5c56513c125f.png" alt="GAIB Logo" className="h-8" />
            </Link>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-white">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-white/80 hover:text-[#4F9AF4] transition-colors">
                  Home
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-white">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://twitter.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-white/80 hover:text-[#4F9AF4] transition-colors"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a 
                  href="https://discord.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-white/80 hover:text-[#4F9AF4] transition-colors"
                >
                  Discord
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-white/20">
          <p className="text-xs text-white/80 text-center">
            &copy; {new Date().getFullYear()} GAIB. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
