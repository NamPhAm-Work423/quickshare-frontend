import { Metadata } from 'next';
import { metadata } from './metadata';

export { metadata };

export default function SecureFileSharingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Secure File Sharing - Military-Grade Encryption & Privacy
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Share sensitive files with confidence using end-to-end encryption, zero-knowledge architecture, 
            and peer-to-peer technology that keeps your data completely private.
          </p>
        </header>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Why Security Matters in File Sharing</h2>
          <div className="bg-red-50 border border-red-200 p-6 rounded-lg mb-6">
            <h3 className="font-semibold text-red-800 mb-2">⚠️ Traditional File Sharing Risks</h3>
            <ul className="space-y-1 text-red-700 text-sm">
              <li>• Files stored on third-party servers indefinitely</li>
              <li>• Personal data collected and potentially sold</li>
              <li>• Vulnerable to data breaches and hacks</li>
              <li>• Government surveillance and data requests</li>
              <li>• Unencrypted transfers intercepted by bad actors</li>
            </ul>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-3">🛡️ Our Security Approach</h3>
              <ul className="space-y-2 text-green-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span>End-to-end encryption using AES-256</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span>Zero-knowledge architecture</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span>Direct peer-to-peer transfers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span>No file storage on our servers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span>Automatic session cleanup</span>
                </li>
              </ul>
            </div>
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-3">🔒 Encryption Details</h3>
              <ul className="space-y-2 text-blue-700">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">•</span>
                  <span>DTLS 1.2 for WebRTC connections</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">•</span>
                  <span>Perfect Forward Secrecy (PFS)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">•</span>
                  <span>Ephemeral key exchange</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">•</span>
                  <span>SHA-256 integrity verification</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">•</span>
                  <span>Browser-native cryptography</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Security Features in Detail</h2>
          
          <div className="space-y-6">
            <div className="border border-gray-200 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <span className="bg-purple-100 text-purple-600 p-2 rounded-full mr-3">🔐</span>
                End-to-End Encryption
              </h3>
              <p className="text-gray-700 mb-3">
                Your files are encrypted on your device before transmission and only decrypted on the 
                recipient's device. Even if someone intercepts the data, they cannot read it.
              </p>
              <div className="bg-gray-50 p-4 rounded text-sm font-mono">
                Your Device → [Encrypted Data] → Recipient's Device
              </div>
            </div>

            <div className="border border-gray-200 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <span className="bg-blue-100 text-blue-600 p-2 rounded-full mr-3">🚫</span>
                Zero-Knowledge Architecture
              </h3>
              <p className="text-gray-700 mb-3">
                We cannot see, access, or decrypt your files. Our servers only facilitate the initial 
                connection between devices - they never handle your actual data.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• No file content passes through our servers</li>
                <li>• No metadata about your files is stored</li>
                <li>• Connection codes are temporary and automatically deleted</li>
              </ul>
            </div>

            <div className="border border-gray-200 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <span className="bg-green-100 text-green-600 p-2 rounded-full mr-3">⏱️</span>
                Ephemeral Sessions
              </h3>
              <p className="text-gray-700 mb-3">
                Every file sharing session is temporary and automatically cleaned up. No traces 
                of your transfer remain after completion.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Sessions expire automatically after 24 hours</li>
                <li>• Connection codes become invalid after use</li>
                <li>• No permanent links or file storage</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Perfect for Sensitive Data</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-3">🏥</div>
              <h3 className="font-semibold mb-2">Healthcare</h3>
              <p className="text-sm text-gray-600">
                HIPAA-compliant file sharing for medical records and patient data
              </p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-3">⚖️</div>
              <h3 className="font-semibold mb-2">Legal</h3>
              <p className="text-sm text-gray-600">
                Secure document sharing for attorney-client privileged communications
              </p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-3">🏦</div>
              <h3 className="font-semibold mb-2">Financial</h3>
              <p className="text-sm text-gray-600">
                Bank-level security for financial documents and sensitive data
              </p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-3">🔬</div>
              <h3 className="font-semibold mb-2">Research</h3>
              <p className="text-sm text-gray-600">
                Protect intellectual property and confidential research data
              </p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-3">📰</div>
              <h3 className="font-semibold mb-2">Journalism</h3>
              <p className="text-sm text-gray-600">
                Secure source protection and confidential document sharing
              </p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-3">🏢</div>
              <h3 className="font-semibold mb-2">Enterprise</h3>
              <p className="text-sm text-gray-600">
                Corporate data protection and secure business communications
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Security Certifications & Compliance</h2>
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-lg">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">🏆 Industry Standards</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• WebRTC Security Architecture compliance</li>
                  <li>• OWASP security guidelines</li>
                  <li>• W3C Web Cryptography API standards</li>
                  <li>• RFC 5764 DTLS-SRTP framework</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">🔍 Regular Audits</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Third-party security assessments</li>
                  <li>• Penetration testing</li>
                  <li>• Code security reviews</li>
                  <li>• Vulnerability scanning</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Share Files with Complete Confidence</h2>
          <p className="mb-6 opacity-90">
            Experience the most secure file sharing solution available. Your privacy and security 
            are our top priorities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="/app" 
              className="inline-block bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center"
            >
              Start Secure Sharing
            </a>
            <a 
              href="/security" 
              className="inline-block border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors text-center"
            >
              Learn More About Security
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}