
import React from 'react';
import Layout from '@/components/layout/Layout';

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="container max-w-3xl py-12 px-4">
        <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>
        <div className="text-white/80 space-y-6">
          <p className="text-sm">Effective Date: May 12th 2025</p>
          
          <p>Your privacy is important to us. This Privacy Policy outlines how GAIB collects and uses your data.</p>
          
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">1. What We Collect</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Discord OAuth Info: Your Discord ID, username, and avatar (read-only)</li>
              <li>Wallet Address (if submitted)</li>
              <li>App interaction metadata (e.g., timestamps, activity logs)</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">2. How We Use It</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>To verify your identity</li>
              <li>To track participation and submissions</li>
              <li>To improve app functionality</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">3. Data Sharing</h2>
            <p>We do not sell your data. We may share it only:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>With infrastructure providers (e.g., Supabase)</li>
              <li>When required by law</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">4. Security</h2>
            <p>We take reasonable steps to protect your data, but cannot guarantee full security of data transmitted online.</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">5. Your Rights</h2>
            <p>You may request deletion of your data by contacting us at gaib.ai</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">6. Updates</h2>
            <p>This policy may change. Updates will be posted here.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
