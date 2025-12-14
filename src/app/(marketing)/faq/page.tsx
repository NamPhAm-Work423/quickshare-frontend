import { Metadata } from 'next';
import { seoConfig } from '@/lib/seo/metadata';

export const metadata: Metadata = {
  title: seoConfig.pages.faq?.title || 'FAQ - Frequently Asked Questions | QuickShare',
  description: seoConfig.pages.faq?.description || 'Common questions about QuickShare P2P file sharing service',
  robots: {
    index: true,
    follow: true,
  },
};

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article className="prose prose-lg dark:prose-invert mx-auto">
        <h1>Frequently Asked Questions</h1>
        
        <div className="space-y-8">
          <div>
            <h2>How does the 6-digit code work?</h2>
            <p>
              When you upload a file, we generate a unique 6-digit code. The recipient enters this code 
              to connect directly to your browser via WebRTC for P2P transfer. The code is single-use 
              and expires automatically for security.
            </p>
          </div>

          <div>
            <h2>Are files stored on your servers?</h2>
            <p>
              No. Files never touch our servers. We only provide signaling to establish direct P2P 
              connections between browsers. Your files transfer directly from your device to the 
              recipient's device.
            </p>
          </div>

          <div>
            <h2>Is the transfer encrypted?</h2>
            <p>
              Yes. WebRTC provides end-to-end encryption for all P2P transfers. Files are encrypted 
              during transit between browsers using industry-standard encryption protocols.
            </p>
          </div>

          <div>
            <h2>Do I need to create an account?</h2>
            <p>
              No account required. Simply upload files and share the generated 6-digit code with 
              recipients. We believe in anonymous, privacy-first file sharing.
            </p>
          </div>

          <div>
            <h2>What are the file size limits?</h2>
            <p>
              File size limits depend on your browser and network connection. Most browsers handle 
              files up to 2GB for P2P transfer. For larger files, consider splitting them into 
              smaller chunks.
            </p>
          </div>

          <div>
            <h2>How long do codes last?</h2>
            <p>
              Codes expire automatically after 24 hours for security. Each code can only be used 
              once. If a transfer fails, you'll need to generate a new code.
            </p>
          </div>

          <div>
            <h2>What browsers are supported?</h2>
            <p>
              QuickShare works on all modern browsers that support WebRTC, including Chrome, Firefox, 
              Safari, and Edge. Mobile browsers are also supported.
            </p>
          </div>

          <div>
            <h2>Can I transfer multiple files?</h2>
            <p>
              Yes! You can select multiple files or entire folders. They'll be packaged together 
              and transferred as a single bundle with one 6-digit code.
            </p>
          </div>

          <div>
            <h2>What if the transfer fails?</h2>
            <p>
              If a transfer fails due to network issues, simply generate a new code and try again. 
              Make sure both devices have stable internet connections and aren't behind restrictive 
              firewalls.
            </p>
          </div>

          <div>
            <h2>Is QuickShare free?</h2>
            <p>
              Yes, QuickShare is completely free to use. We don't charge for file transfers, storage 
              (since we don't store files), or any other features.
            </p>
          </div>
        </div>

        <div className="mt-12 p-6 bg-muted rounded-lg">
          <h2>Still have questions?</h2>
          <p>
            Contact us at <strong>hello@quickshare.app</strong> or check our 
            <a href="/security" className="text-primary hover:underline"> security documentation</a> 
            for more technical details.
          </p>
        </div>
      </article>
    </div>
  );
}