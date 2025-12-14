import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - QuickShare',
  description: 'Terms of service for QuickShare file sharing platform',
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article className="prose prose-lg dark:prose-invert mx-auto">
        <h1>Terms of Service</h1>
        
        <p><em>Last updated: January 15, 2024</em></p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using QuickShare, you accept and agree to be bound by the terms 
          and provision of this agreement.
        </p>

        <h2>2. Service Description</h2>
        <p>
          QuickShare provides peer-to-peer file sharing services that allow users to transfer 
          files directly between devices without server storage.
        </p>

        <h2>3. User Responsibilities</h2>
        <ul>
          <li>You are responsible for the content you share</li>
          <li>You must not share illegal, harmful, or copyrighted content</li>
          <li>You must not use the service to distribute malware or viruses</li>
          <li>You must respect the privacy and rights of other users</li>
        </ul>

        <h2>4. Service Availability</h2>
        <p>
          We strive to maintain service availability but do not guarantee uninterrupted access. 
          The service is provided "as is" without warranties.
        </p>

        <h2>5. Privacy</h2>
        <p>
          Your privacy is important to us. Please review our Privacy Policy to understand 
          how we handle your information.
        </p>

        <h2>6. Limitation of Liability</h2>
        <p>
          QuickShare shall not be liable for any indirect, incidental, special, consequential, 
          or punitive damages resulting from your use of the service.
        </p>

        <h2>7. Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. Continued use of the service 
          constitutes acceptance of modified terms.
        </p>

        <h2>8. Contact Information</h2>
        <p>
          For questions about these terms, please contact us at: <br />
          <strong>Email:</strong> legal@quickshare.app
        </p>
      </article>
    </div>
  );
}