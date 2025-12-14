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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            📋 Terms of Service
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Please read these terms carefully before using QuickShare. By using our service, 
            you agree to be bound by these terms and conditions.
          </p>
          <div className="mt-4 text-sm text-muted-foreground">
            <em>Last updated: January 15, 2024</em>
          </div>
        </header>

        <section className="mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="font-semibold mb-2">What You Can Do</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Share files securely with others</li>
                <li>• Use the service for personal and business purposes</li>
                <li>• Transfer files of any size</li>
                <li>• Enjoy privacy-focused file sharing</li>
              </ul>
            </div>
            <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-lg">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">❌</span>
              </div>
              <h3 className="font-semibold mb-2">What's Not Allowed</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Sharing illegal or harmful content</li>
                <li>• Distributing malware or viruses</li>
                <li>• Violating others' privacy or rights</li>
                <li>• Using the service for spam or abuse</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📜</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold">Terms & Conditions</h2>
                <p className="opacity-90">Legal terms governing your use of QuickShare</p>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <article className="prose prose-lg dark:prose-invert max-w-none">
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
        </div>

        <section className="mt-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Questions About Our Terms?</h2>
          <p className="mb-6 opacity-90">
            We want to be transparent about our terms of service. If you have any questions 
            or need clarification about these terms, our legal team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="mailto:legal@quickshare.app" 
              className="inline-block bg-background text-primary px-6 py-3 rounded-lg font-semibold hover:bg-muted transition-colors"
            >
              Contact Legal Team
            </a>
            <a 
              href="/privacy" 
              className="inline-block bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors"
            >
              View Privacy Policy
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}