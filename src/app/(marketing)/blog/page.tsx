import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'File Sharing Blog - Guides, Security & Technology | QuickShare',
  description: 'Learn about secure file sharing, P2P technology, and step-by-step guides for transferring files between devices.',
  keywords: ['file sharing blog', 'p2p file transfer', 'secure file sharing', 'file transfer guides'],
  openGraph: {
    title: 'File Sharing Blog - Guides, Security & Technology',
    description: 'Learn about secure file sharing, P2P technology, and step-by-step guides for transferring files between devices.',
    type: 'website',
  },
};

export default function BlogIndex() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">File Sharing Blog</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover the latest in secure file sharing technology, learn best practices for privacy protection, 
          and follow step-by-step guides for transferring files between any devices.
        </p>
      </header>

      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-8 text-center">Explore Our Topics</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* P2P File Sharing Cluster */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl hover:shadow-lg transition-shadow">
            <div className="text-blue-600 mb-4">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">
              <a href="/blog/p2p-file-sharing" className="hover:text-blue-600">
                P2P File Sharing
              </a>
            </h3>
            <p className="text-gray-700 mb-6">
              Learn about peer-to-peer technology, WebRTC, and how modern browsers enable direct file transfers 
              without servers.
            </p>
            <div className="space-y-2">
              <a href="/blog/p2p-file-sharing/what-is-p2p-file-transfer" className="block text-blue-600 hover:underline">
                → What is P2P File Transfer?
              </a>
              <a href="/blog/p2p-file-sharing/webrtc-datachannel-explained" className="block text-blue-600 hover:underline">
                → WebRTC DataChannel Explained
              </a>
              <a href="/blog/p2p-file-sharing/browser-p2p-technology" className="block text-blue-600 hover:underline">
                → Browser P2P Technology
              </a>
            </div>
          </div>

          {/* Security Cluster */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl hover:shadow-lg transition-shadow">
            <div className="text-green-600 mb-4">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">
              <a href="/blog/security" className="hover:text-green-600">
                Security & Privacy
              </a>
            </h3>
            <p className="text-gray-700 mb-6">
              Understand file sharing security, end-to-end encryption, and privacy best practices to keep 
              your data safe.
            </p>
            <div className="space-y-2">
              <a href="/blog/security/why-no-login-is-more-secure" className="block text-green-600 hover:underline">
                → Why No Login is More Secure
              </a>
              <a href="/blog/security/end-to-end-encryption-explained" className="block text-green-600 hover:underline">
                → End-to-End Encryption Explained
              </a>
              <a href="/blog/security/file-sharing-privacy" className="block text-green-600 hover:underline">
                → File Sharing Privacy Best Practices
              </a>
            </div>
          </div>

          {/* How-To Cluster */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl hover:shadow-lg transition-shadow">
            <div className="text-purple-600 mb-4">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">
              <a href="/blog/how-to" className="hover:text-purple-600">
                How-To Guides
              </a>
            </h3>
            <p className="text-gray-700 mb-6">
              Step-by-step tutorials for sending files between different devices and platforms, 
              from iPhone to PC and everything in between.
            </p>
            <div className="space-y-2">
              <a href="/blog/how-to/send-file-from-iphone-to-pc" className="block text-purple-600 hover:underline">
                → Send Files from iPhone to PC
              </a>
              <a href="/blog/how-to/send-file-from-mac-to-windows" className="block text-purple-600 hover:underline">
                → Send Files from Mac to Windows
              </a>
              <a href="/blog/how-to/send-file-over-wifi-without-internet" className="block text-purple-600 hover:underline">
                → Send Files Over WiFi Without Internet
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-8 text-center">Latest Articles</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <article className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="text-sm text-blue-600 mb-2">P2P Technology</div>
              <h3 className="text-xl font-semibold mb-3">
                <a href="/blog/p2p-file-sharing/what-is-p2p-file-transfer" className="hover:text-blue-600">
                  What is P2P File Transfer?
                </a>
              </h3>
              <p className="text-gray-600 mb-4">
                Learn the fundamentals of peer-to-peer file transfer technology and how it revolutionizes file sharing.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">5 min read</span>
                <span className="text-sm text-blue-600">Read more →</span>
              </div>
            </div>
          </article>

          <article className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="text-sm text-green-600 mb-2">Security</div>
              <h3 className="text-xl font-semibold mb-3">
                <a href="/blog/security/why-no-login-is-more-secure" className="hover:text-green-600">
                  Why No Login is More Secure
                </a>
              </h3>
              <p className="text-gray-600 mb-4">
                Discover why anonymous file sharing without user accounts can actually provide better security.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">7 min read</span>
                <span className="text-sm text-green-600">Read more →</span>
              </div>
            </div>
          </article>

          <article className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="text-sm text-purple-600 mb-2">How-To Guide</div>
              <h3 className="text-xl font-semibold mb-3">
                <a href="/blog/how-to/send-file-from-iphone-to-pc" className="hover:text-purple-600">
                  Send Files from iPhone to PC
                </a>
              </h3>
              <p className="text-gray-600 mb-4">
                Complete step-by-step guide to transfer files from your iPhone to a Windows PC without cables.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">10 min read</span>
                <span className="text-sm text-purple-600">Read more →</span>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="text-center bg-gray-50 p-8 rounded-xl">
        <h2 className="text-2xl font-semibold mb-4">Stay Updated</h2>
        <p className="text-gray-600 mb-6">
          Get the latest articles about file sharing technology, security tips, and how-to guides delivered to your inbox.
        </p>
        <div className="max-w-md mx-auto flex gap-4">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Subscribe
          </button>
        </div>
      </section>
    </div>
  );
}