
import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, FileText, MessageSquare } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
  return (
    <footer className="border-t border-black/10 bg-[#F4D3AF]/90 py-3 relative z-10">
      <div className="container">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center">
              <img src="/lovable-uploads/a3ea4fc0-78c8-4624-989a-5c56513c125f.png" alt="GAIB Logo" className="h-6" />
            </Link>
            
            <div className="flex items-center gap-4">
              <Link to="https://gaib.ai/" target="_blank" rel="noopener noreferrer" className="text-sm text-black/80 hover:text-[#4F9AF4] transition-colors">
                GAIB
              </Link>
              <Link to="/" className="text-sm text-black/80 hover:text-[#4F9AF4] transition-colors">
                Home
              </Link>
              <Link to="/terms-of-service" className="text-sm text-black/80 hover:text-[#4F9AF4] transition-colors flex items-center gap-1">
                <FileText size={14} />
                <span>Terms</span>
              </Link>
              <Link to="/privacy-policy" className="text-sm text-black/80 hover:text-[#4F9AF4] transition-colors flex items-center gap-1">
                <FileText size={14} />
                <span>Privacy</span>
              </Link>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="https://twitter.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-black/80 hover:text-[#4F9AF4] transition-colors flex items-center gap-1"
            >
              <Twitter size={16} />
              <span>Twitter</span>
            </a>
            <a 
              href="https://discord.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-black/80 hover:text-[#4F9AF4] transition-colors flex items-center gap-1"
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
