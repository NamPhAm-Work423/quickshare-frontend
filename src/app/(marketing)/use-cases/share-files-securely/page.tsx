import { Metadata } from 'next';
import { metadata } from './metadata';

export { metadata };

export default function ShareFilesSecurelyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Share Files Securely - Complete Privacy & Protection Guide
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Learn how to share files securely using advanced encryption, privacy-first technology, 
            and best practices that protect your sensitive data from unauthorized access.
          </p>
        </header>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">The Complete Guide to Secure File Sharing</h2>
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mb-6">
            <p className="text-blue-800 leading-relaxed">
              In today's digital world, sharing files securely isn't just important—it's essential. 
              Whether you're sharing personal photos, business documents, or sensitive research data, 
              understanding how to protect your files during transfer can prevent data breaches, 
              identity theft, and privacy violations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">🚨 Common Security Threats</h3>
              <div className="space-y-3">
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <h4 className="font-semibold text-red-800">Man-in-the-Middle Attacks</h4>
                  <p className="text-red-700 text-sm">
                    Hackers intercept unencrypted file transfers to steal sensitive data
                  </p>
                </div>
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <h4 className="font-semibold text-red-800">Data Breaches</h4>
                  <p className="text-red-700 text-sm">
                    Files stored on compromised servers become accessible to cybercriminals
                  </p>
                </div>
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <h4 className="font-semibold text-red-800">Unauthorized Access</h4>
                  <p className="text-red-700 text-sm">
                    Weak sharing links allow unintended recipients to access your files
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">✅ Security Best Practices</h3>
              <div className="space-y-3">
                <div className="bg-green-50 border-l-4 border-green-400 p-4">
                  <h4 className="font-semibold text-green-800">End-to-End Encryption</h4>
                  <p className="text-green-700 text-sm">
                    Encrypt files before transmission so only intended recipients can decrypt them
                  </p>
                </div>
                <div className="bg-green-50 border-l-4 border-green-400 p-4">
                  <h4 className="font-semibold text-green-800">Zero-Knowledge Systems</h4>
                  <p className="text-green-700 text-sm">
                    Use services that cannot access your files even if they wanted to
                  </p>
                </div>
                <div className="bg-green-50 border-l-4 border-green-400 p-4">
                  <h4 className="font-semibold text-green-800">Temporary Sharing</h4>
                  <p className="text-green-700 text-sm">
                    Use ephemeral links that expire automatically after use or time limit
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Step-by-Step Secure Sharing Process</h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Choose the Right Platform</h3>
                <p className="text-gray-700 mb-3">
                  Select a file sharing service that prioritizes security and privacy. Look for:
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• End-to-end encryption</li>
                  <li>• Zero-knowledge architecture</li>
                  <li>• No file storage on servers</li>
                  <li>• Open-source security audits</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Prepare Your Files</h3>
                <p className="text-gray-700 mb-3">
                  Before sharing, ensure your files are properly prepared:
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Remove unnecessary metadata</li>
                  <li>• Compress large files to reduce transfer time</li>
                  <li>• Verify file integrity with checksums</li>
                  <li>• Consider additional encryption for ultra-sensitive data</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Initiate Secure Transfer</h3>
                <p className="text-gray-700 mb-3">
                  Start the transfer using secure protocols:
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Use HTTPS connections only</li>
                  <li>• Enable two-factor authentication if available</li>
                  <li>• Generate unique, temporary sharing codes</li>
                  <li>• Set expiration times for shared links</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                4
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Share Safely</h3>
                <p className="text-gray-700 mb-3">
                  Communicate sharing details securely:
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Send sharing codes through separate channels</li>
                  <li>• Use encrypted messaging for sensitive transfers</li>
                  <li>• Verify recipient identity before sharing</li>
                  <li>• Provide clear instructions for secure download</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                5
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Verify and Clean Up</h3>
                <p className="text-gray-700 mb-3">
                  Ensure successful transfer and maintain security:
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Confirm recipient received files intact</li>
                  <li>• Verify file checksums match</li>
                  <li>• Revoke access to shared links</li>
                  <li>• Delete temporary files and clear browser data</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Industry-Specific Security Requirements</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-gray-200 p-6 rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center">
                <span className="text-2xl mr-2">🏥</span>
                Healthcare (HIPAA)
              </h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• End-to-end encryption required</li>
                <li>• Access logs and audit trails</li>
                <li>• Patient consent for data sharing</li>
                <li>• Secure deletion after transfer</li>
                <li>• Business Associate Agreements (BAAs)</li>
              </ul>
            </div>
            <div className="border border-gray-200 p-6 rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center">
                <span className="text-2xl mr-2">🏦</span>
                Financial (SOX, PCI DSS)
              </h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Multi-factor authentication</li>
                <li>• Data loss prevention (DLP)</li>
                <li>• Regulatory compliance reporting</li>
                <li>• Encrypted data at rest and in transit</li>
                <li>• Regular security assessments</li>
              </ul>
            </div>
            <div className="border border-gray-200 p-6 rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center">
                <span className="text-2xl mr-2">⚖️</span>
                Legal (Attorney-Client Privilege)
              </h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Privileged communication protection</li>
                <li>• Zero-knowledge architecture</li>
                <li>• Secure client portals</li>
                <li>• Document version control</li>
                <li>• Litigation hold capabilities</li>
              </ul>
            </div>
            <div className="border border-gray-200 p-6 rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center">
                <span className="text-2xl mr-2">🏢</span>
                Enterprise (GDPR, CCPA)
              </h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Data subject rights compliance</li>
                <li>• Privacy by design principles</li>
                <li>• Cross-border transfer restrictions</li>
                <li>• Breach notification procedures</li>
                <li>• Data processing agreements</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Security Checklist for File Sharing</h2>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Before Sharing</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Verify recipient identity</span>
                  </li>
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Choose secure sharing platform</span>
                  </li>
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Remove sensitive metadata</span>
                  </li>
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Set appropriate access controls</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">During Transfer</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Use encrypted connections (HTTPS)</span>
                  </li>
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Monitor transfer progress</span>
                  </li>
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Verify file integrity</span>
                  </li>
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Confirm successful delivery</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Start Sharing Files Securely Today</h2>
          <p className="mb-6 opacity-90">
            Put these security best practices into action with our zero-knowledge, 
            end-to-end encrypted file sharing platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="/app" 
              className="inline-block bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center"
            >
              Share Files Securely Now
            </a>
            <a 
              href="/security" 
              className="inline-block border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors text-center"
            >
              View Security Details
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}