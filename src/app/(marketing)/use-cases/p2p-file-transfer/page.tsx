import { Metadata } from 'next';
import { metadata } from './metadata';

export { metadata };

export default function P2PFileTransferPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            P2P File Transfer - Direct Device-to-Device Sharing
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Experience true peer-to-peer file transfer technology. Your files travel directly 
            between devices without touching any servers, ensuring maximum privacy and speed.
          </p>
        </header>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">What is P2P File Transfer?</h2>
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <p className="text-gray-700 leading-relaxed">
              Peer-to-peer (P2P) file transfer allows your devices to communicate directly with each other, 
              bypassing traditional servers. Using WebRTC technology, files are encrypted and transmitted 
              through a secure channel that only your devices can access.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🔗</span>
              </div>
              <h3 className="font-semibold mb-2">Direct Connection</h3>
              <p className="text-sm text-gray-600">
                Your devices connect directly without intermediary servers
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="font-semibold mb-2">End-to-End Encryption</h3>
              <p className="text-sm text-gray-600">
                Files are encrypted during the entire transfer process
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold mb-2">Maximum Speed</h3>
              <p className="text-sm text-gray-600">
                Transfer speeds limited only by your network connection
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Advantages of P2P Technology</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-lg">Enhanced Privacy</h3>
              <p className="text-gray-700">
                Your files never touch our servers or any third-party storage. The transfer 
                happens entirely between your devices.
              </p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-lg">Faster Transfers</h3>
              <p className="text-gray-700">
                Direct device connections often provide faster transfer speeds than 
                traditional upload-download methods.
              </p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-lg">No Size Limits</h3>
              <p className="text-gray-700">
                Transfer files of any size without worrying about server storage 
                limitations or upload restrictions.
              </p>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-semibold text-lg">Real-time Transfer</h3>
              <p className="text-gray-700">
                Files begin transferring immediately as they're selected, with 
                real-time progress updates.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How WebRTC Powers P2P</h2>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
            <p className="text-gray-700 mb-4">
              Our P2P file transfer uses WebRTC (Web Real-Time Communication), a modern web standard 
              that enables direct browser-to-browser communication:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 mt-1">•</span>
                <span><strong>NAT Traversal:</strong> Automatically handles network configurations to establish connections</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 mt-1">•</span>
                <span><strong>DTLS Encryption:</strong> Military-grade encryption protects your data in transit</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 mt-1">•</span>
                <span><strong>Data Channels:</strong> Optimized pathways for efficient file transfer</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 mt-1">•</span>
                <span><strong>Browser Native:</strong> No plugins or additional software required</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Use Cases for P2P File Transfer</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <h3 className="font-semibold mb-3">🏢 Business & Professional</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Confidential document sharing</li>
                <li>• Large media file transfers</li>
                <li>• Client deliverables</li>
                <li>• Secure collaboration</li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <h3 className="font-semibold mb-3">👨‍👩‍👧‍👦 Personal Use</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Family photo sharing</li>
                <li>• Video file transfers</li>
                <li>• Device-to-device sync</li>
                <li>• Backup file sharing</li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <h3 className="font-semibold mb-3">🎓 Education & Research</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Research data sharing</li>
                <li>• Student project files</li>
                <li>• Academic collaboration</li>
                <li>• Thesis and paper drafts</li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <h3 className="font-semibold mb-3">🎨 Creative Industries</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• High-resolution artwork</li>
                <li>• Video production files</li>
                <li>• Audio recordings</li>
                <li>• Design assets</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Experience True P2P File Transfer</h2>
          <p className="mb-6 opacity-90">
            Join thousands of users who trust our peer-to-peer technology for secure, 
            fast, and private file transfers.
          </p>
          <a 
            href="/app" 
            className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Start P2P Transfer Now
          </a>
        </section>
      </div>
    </div>
  );
}