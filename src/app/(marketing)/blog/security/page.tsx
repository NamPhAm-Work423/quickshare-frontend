import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Security Blog - File Sharing Security & Privacy | QuickShare',
  description: 'Learn about file sharing security, privacy best practices, and how to protect your data when transferring files online.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function SecurityBlogPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article className="prose prose-lg dark:prose-invert mx-auto">
        <h1>Security Blog</h1>
        <p className="lead">
          Learn about file sharing security, privacy best practices, and how to protect your data.
        </p>

        <div className="grid gap-8 mt-8">
          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h2 className="mt-0">
              <a href="/blog/security/why-no-login-is-more-secure" className="text-primary hover:underline">
                Why No-Login File Sharing is More Secure
              </a>
            </h2>
            <p className="text-muted-foreground">
              Discover why anonymous file sharing without accounts provides better security 
              and privacy protection than traditional cloud storage services.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Security</span>
              <span>•</span>
              <span>5 min read</span>
            </div>
          </div>

          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h2 className="mt-0">
              <a href="/blog/security/end-to-end-encryption-explained" className="text-primary hover:underline">
                End-to-End Encryption Explained
              </a>
            </h2>
            <p className="text-muted-foreground">
              Understanding how WebRTC's built-in encryption protects your files during 
              peer-to-peer transfers and why it's more secure than server-based storage.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Encryption</span>
              <span>•</span>
              <span>7 min read</span>
            </div>
          </div>

          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h2 className="mt-0">
              <a href="/blog/security/file-sharing-privacy" className="text-primary hover:underline">
                File Sharing Privacy Best Practices
              </a>
            </h2>
            <p className="text-muted-foreground">
              Essential privacy tips for secure file sharing, including how to verify recipients, 
              protect sensitive data, and avoid common security pitfalls.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Privacy</span>
              <span>•</span>
              <span>6 min read</span>
            </div>
          </div>

          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h2 className="mt-0">
              <a href="/blog/security/webrtc-security-deep-dive" className="text-primary hover:underline">
                WebRTC Security: A Deep Dive
              </a>
            </h2>
            <p className="text-muted-foreground">
              Technical analysis of WebRTC security features, including DTLS encryption, 
              ICE/STUN protocols, and how they protect your file transfers.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Technical</span>
              <span>•</span>
              <span>10 min read</span>
            </div>
          </div>
        </div>

        <div className="mt-12 p-6 bg-muted rounded-lg">
          <h2>Security Resources</h2>
          <ul>
            <li><a href="/security" className="text-primary hover:underline">Security Overview</a></li>
            <li><a href="/privacy" className="text-primary hover:underline">Privacy Policy</a></li>
            <li><a href="/faq" className="text-primary hover:underline">Security FAQ</a></li>
          </ul>
        </div>
      </article>
    </div>
  );
}