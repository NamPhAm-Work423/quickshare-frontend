import { Metadata } from 'next';
import { metadata } from './metadata';

export { metadata };

export default function SendFilesWithoutLoginPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Send Files Without Login - Secure & Anonymous File Sharing
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Share files instantly without creating accounts or logging in. Our peer-to-peer technology 
            ensures your files stay private and secure while making sharing effortless.
          </p>
        </header>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Why Choose No-Login File Sharing?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">🔒 Enhanced Privacy</h3>
              <p className="text-gray-700">
                No personal information required. Your identity remains completely anonymous 
                throughout the entire file sharing process.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">⚡ Instant Access</h3>
              <p className="text-gray-700">
                Start sharing immediately without registration delays. Just drag, drop, 
                and share your files in seconds.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">🛡️ Zero Data Collection</h3>
              <p className="text-gray-700">
                We don't store your files or personal data. Everything happens directly 
                between your devices using peer-to-peer technology.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">🌐 Universal Access</h3>
              <p className="text-gray-700">
                Works on any device with a web browser. No apps to install, 
                no accounts to manage.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <h3 className="font-semibold">Select Your Files</h3>
                <p className="text-gray-600">
                  Drag and drop files or click to browse. No size limits, no file type restrictions.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <h3 className="font-semibold">Get Your Share Code</h3>
                <p className="text-gray-600">
                  Receive a unique code that connects your devices directly without our servers.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                3
              </div>
              <div>
                <h3 className="font-semibold">Share Securely</h3>
                <p className="text-gray-600">
                  Files transfer directly between devices using end-to-end encryption.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Perfect For</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Sharing sensitive documents without leaving digital traces
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Quick file transfers between personal devices
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Collaborating with clients who prefer privacy
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Avoiding email attachment size limits
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              One-time file sharing without ongoing access
            </li>
          </ul>
        </section>

        <section className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Start Sharing Now</h2>
          <p className="text-gray-700 mb-4">
            Experience the freedom of anonymous file sharing. No registration required, 
            no personal information collected.
          </p>
          <a 
            href="/app" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Send Files Without Login
          </a>
        </section>
      </div>
    </div>
  );
}