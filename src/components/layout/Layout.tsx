
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Design elements */}
      <img 
        src="/lovable-uploads/1a8cc40d-5db4-4af8-892a-0d9d139ffb8c.png" 
        alt="" 
        className="clouds-top-right" 
        aria-hidden="true" 
      />
      <img 
        src="/lovable-uploads/96315555-c76f-42b9-a5f7-403e312f654e.png" 
        alt="" 
        className="circles-top-left" 
        aria-hidden="true" 
      />
      <img 
        src="/lovable-uploads/cce19565-8e57-4e6e-87b3-8a5ba9ee91c9.png" 
        alt="" 
        className="noise-overlay" 
        aria-hidden="true" 
      />
      <img 
        src="/lovable-uploads/8a797feb-705c-4580-a886-fff6a268cf33.png" 
        alt="" 
        className="desert-bottom" 
        aria-hidden="true" 
      />
      
      <Navbar />
      <main className="flex-1 pt-16 content-container">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
