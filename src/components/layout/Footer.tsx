
import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, FileText, MessageSquare } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
  return (
    <footer className="border-t border-black/10 bg-[#F4D3AF]/90 py-3 relative z-10">
      <div className="container">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center">
              <img src="/lovable-uploads/61a722fd-1842-4dd1-9fe5-80ed4f5ce6e7.png" alt="GAIB Logo" className="h-6" />
            </Link>
            
            <div className="flex items-center gap-4">
              <Link to="/" className="text-sm text-black/80 hover:text-[#19E3E3] transition-colors">
                Home
              </Link>
              <Link to="/terms-of-service" className="text-sm text-black/80 hover:text-[#19E3E3] transition-colors flex items-center gap-1">
                <FileText size={14} />
                <span>Terms</span>
              </Link>
              <Link to="/privacy-policy" className="text-sm text-black/80 hover:text-[#19E3E3] transition-colors flex items-center gap-1">
                <FileText size={14} />
                <span>Privacy</span>
              </Link>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="https://x.com/gaib_ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-black/80 hover:text-[#19E3E3] transition-colors flex items-center gap-1"
            >
              <ExternalLink size={16} />
              <span>X</span>
            </a>
            <a 
              href="https://discord.gg/gaibofficial" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-black/80 hover:text-[#19E3E3] transition-colors flex items-center gap-1"
            >
              <MessageSquare size={16} />
              <span>Discord</span>
            </a>
            
            <p className="text-xs text-black/60">
              &copy; {new Date().getFullYear()} GAIB
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
