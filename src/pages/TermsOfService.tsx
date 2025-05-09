
import React from 'react';
import Layout from '@/components/layout/Layout';

const TermsOfService = () => {
  return (
    <Layout>
      <div className="container max-w-3xl py-12 px-4">
        <h1 className="text-3xl font-bold text-white mb-8">📄 Terms of Service</h1>
        <div className="text-white/80 space-y-6">
          <p className="text-sm">Effective Date: May 12th 2025</p>
          
          <p>Welcome to GAIB! By accessing or using our app, you agree to be bound by these Terms of Service. If you do not agree, please do not use the app.</p>
          
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">1. Eligibility</h2>
            <p>You must be at least 13 years old and legally allowed to use Discord and Web3 apps in your jurisdiction.</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">2. Account Verification</h2>
            <p>By using Discord OAuth, you authorize us to access your basic Discord profile information to verify your identity. We do not post or interact on your behalf.</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">3. User Conduct</h2>
            <p>You agree not to misuse the app. This includes attempting to gain unauthorized access, submitting fraudulent data, or using the app to harm others.</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">4. Intellectual Property</h2>
            <p>All content, branding, and code associated with GAIB is owned by us or our licensors and protected by applicable laws.</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">5. Disclaimer</h2>
            <p>This app is provided "as is" without warranties. We do not guarantee uptime, availability, or data accuracy.</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">6. Termination</h2>
            <p>We reserve the right to suspend or terminate access at our discretion.</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">7. Changes</h2>
            <p>We may update these terms. Continued use after changes means you accept them.</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">8. Contact</h2>
            <p>For questions, contact us at gaib.ai</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfService;
