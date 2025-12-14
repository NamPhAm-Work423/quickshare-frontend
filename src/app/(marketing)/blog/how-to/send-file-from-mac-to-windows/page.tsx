import { metadata } from './metadata';

export { metadata };

const structuredData = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Send Files from Mac to Windows PC",
  "description": "Complete guide to transfer files between Mac and Windows computers without compatibility issues using modern web technology",
  "image": "https://quickshare.com/images/mac-to-windows-transfer.jpg",
  "totalTime": "PT3M",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": "0"
  },
  "supply": [
    {
      "@type": "HowToSupply",
      "name": "Mac computer with Safari, Chrome, or Firefox browser"
    },
    {
      "@type": "HowToSupply", 
      "name": "Windows PC with any modern web browser"
    },
    {
      "@type": "HowToSupply",
      "name": "Internet connection on both devices"
    }
  ],
  "tool": [
    {
      "@type": "HowToTool",
      "name": "QuickShare web application"
    }
  ],
  "step": [
    {
      "@type": "HowToStep",
      "name": "Open QuickShare on Mac",
      "text": "Open your preferred browser on Mac and navigate to QuickShare.com",
      "image": "https://quickshare.com/images/step1-mac.jpg"
    },
    {
      "@type": "HowToStep", 
      "name": "Select files to transfer",
      "text": "Drag and drop files or click to select documents, images, or any file type from your Mac",
      "image": "https://quickshare.com/images/step2-select-mac-files.jpg"
    },
    {
      "@type": "HowToStep",
      "name": "Generate sharing link", 
      "text": "QuickShare creates a secure, temporary sharing link for your files",
      "image": "https://quickshare.com/images/step3-mac-link.jpg"
    },
    {
      "@type": "HowToStep",
      "name": "Share link to Windows PC",
      "text": "Send the link to your Windows computer via email, messaging, or QR code",
      "image": "https://quickshare.com/images/step4-share-to-windows.jpg"
    },
    {
      "@type": "HowToStep",
      "name": "Download on Windows PC",
      "text": "Open the link on your Windows PC and download files with full compatibility",
      "image": "https://quickshare.com/images/step5-download-windows.jpg"
    }
  ]
};

export default function SendFileFromMacToWindowsGuide() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8">
          <nav className="text-sm text-gray-600 mb-4">
            <a href="/blog" className="hover:text-blue-600">Blog</a>
            <span className="mx-2">›</span>
            <a href="/blog/how-to" className="hover:text-blue-600">How-To Guides</a>
            <span className="mx-2">›</span>
            <span>Send Files from Mac to Windows</span>
          </nav>
          
          <h1 className="text-4xl font-bold mb-4">
            How to Send Files from Mac to Windows PC - Easy Transfer Guide
          </h1>
          
          <div className="flex items-center gap-4 text-gray-600 mb-6">
            <time dateTime="2024-01-20">January 20, 2024</time>
            <span>•</span>
            <span>3 min read</span>
            <span>•</span>
            <span>By QuickShare Team</span>
          </div>
          
          <p className="text-xl text-gray-700 leading-relaxed">
            Transferring files between Mac and Windows computers has traditionally been challenging due to different 
            file systems and compatibility issues. This guide shows you how to seamlessly share files across platforms 
            using modern web technology that eliminates compatibility concerns.
          </p>
        </header>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Why Cross-Platform Transfer is Challenging</h2>
          <div className="bg-red-50 p-6 rounded-lg mb-6">
            <h3 className="font-semibold text-red-800 mb-3">Common Cross-Platform Issues:</h3>
            <ul className="space-y-2 text-red-700">
              <li>• Different file systems (HFS+ vs NTFS)</li>
              <li>• Network protocol incompatibilities</li>
              <li>• File format and encoding differences</li>
              <li>• Complex network sharing setup</li>
              <li>• Security restrictions between platforms</li>
              <li>• Need for third-party software installation</li>
            </ul>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-3">Web-Based Solution Benefits:</h3>
            <ul className="space-y-2 text-green-700">
              <li>✓ Platform-independent browser technology</li>
              <li>✓ No file system compatibility issues</li>
              <li>✓ Works with any file type and size</li>
              <li>✓ No network configuration required</li>
              <li>✓ Secure peer-to-peer transfer</li>
              <li>✓ No software installation needed</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Step-by-Step Transfer Process</h2>
          
          <div className="space-y-8">
            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-xl font-semibold mb-3">Step 1: Open QuickShare on Your Mac</h3>
              <p className="text-gray-700 mb-4">
                Launch any modern web browser on your Mac (Safari, Chrome, Firefox, or Edge) and navigate to 
                <strong> quickshare.com</strong>. The web application is fully compatible with macOS and 
                optimized for all major browsers.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Mac Tip:</strong> You can add QuickShare to your Dock by dragging the URL from 
                  the address bar to the Dock for quick access.
                </p>
              </div>
            </div>

            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-xl font-semibold mb-3">Step 2: Select Files from Your Mac</h3>
              <p className="text-gray-700 mb-4">
                You can transfer any type of file from your Mac:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-semibold mb-2">Documents & Media:</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Pages, Numbers, Keynote files</li>
                    <li>Photos and videos from Photos app</li>
                    <li>PDF documents and presentations</li>
                    <li>Audio files and recordings</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Professional Files:</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Adobe Creative Suite files</li>
                    <li>Final Cut Pro projects</li>
                    <li>Logic Pro audio projects</li>
                    <li>Code repositories and archives</li>
                  </ul>
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Compatibility Note:</strong> All file types maintain their original format and 
                  metadata during transfer, ensuring full compatibility on Windows.
                </p>
              </div>
            </div>

            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-xl font-semibold mb-3">Step 3: Generate Secure Sharing Link</h3>
              <p className="text-gray-700 mb-4">
                QuickShare automatically creates a unique, encrypted sharing link for your files. This link:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                <li>Is temporary and expires after 24 hours</li>
                <li>Uses end-to-end encryption for security</li>
                <li>Requires no authentication to access</li>
                <li>Works with any web browser on Windows</li>
              </ul>
            </div>

            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-xl font-semibold mb-3">Step 4: Share Link to Windows PC</h3>
              <p className="text-gray-700 mb-4">
                Multiple convenient options to get the link to your Windows computer:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Digital Methods:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Email the link to yourself</li>
                    <li>• Use iMessage or other messaging apps</li>
                    <li>• Copy to shared clipboard (Universal Clipboard)</li>
                    <li>• Share via Slack, Teams, or other tools</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Visual Methods:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Display QR code on Mac screen</li>
                    <li>• Scan QR code with Windows camera</li>
                    <li>• Take photo of QR code with phone</li>
                    <li>• Share QR code via AirDrop to iPhone</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-xl font-semibold mb-3">Step 5: Download Files on Windows PC</h3>
              <p className="text-gray-700 mb-4">
                Open the shared link in any web browser on your Windows PC. The files will transfer directly 
                from your Mac to Windows with full compatibility and original formatting preserved.
              </p>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Performance Note:</strong> Files transfer using peer-to-peer technology, meaning 
                  they go directly between your devices for maximum speed and privacy.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">File Compatibility Guide</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">Mac File Type</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Windows Compatibility</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Recommended Windows App</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Pages (.pages)</td>
                  <td className="border border-gray-300 px-4 py-2">✓ Full compatibility</td>
                  <td className="border border-gray-300 px-4 py-2">Microsoft Word, Pages for iCloud</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">Numbers (.numbers)</td>
                  <td className="border border-gray-300 px-4 py-2">✓ Full compatibility</td>
                  <td className="border border-gray-300 px-4 py-2">Microsoft Excel, Numbers for iCloud</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Keynote (.key)</td>
                  <td className="border border-gray-300 px-4 py-2">✓ Full compatibility</td>
                  <td className="border border-gray-300 px-4 py-2">PowerPoint, Keynote for iCloud</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">HEIC Images</td>
                  <td className="border border-gray-300 px-4 py-2">✓ Windows 10+ native support</td>
                  <td className="border border-gray-300 px-4 py-2">Photos app, HEIF Image Extensions</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">DMG Files</td>
                  <td className="border border-gray-300 px-4 py-2">⚠ Requires extraction tool</td>
                  <td className="border border-gray-300 px-4 py-2">7-Zip, DMG Extractor</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Troubleshooting Cross-Platform Issues</h2>
          
          <div className="space-y-6">
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-2">File Names with Special Characters</h3>
              <p className="text-gray-700 mb-3">
                Mac allows characters in file names that Windows doesn't support. QuickShare automatically 
                handles these during transfer.
              </p>
              <div className="bg-blue-50 p-3 rounded text-sm">
                <strong>Auto-converted characters:</strong> : / \ * ? " &lt; &gt; |
              </div>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-2">Large File Performance</h3>
              <p className="text-gray-700 mb-3">
                For optimal performance when transferring large files between Mac and Windows:
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Ensure both devices are on the same WiFi network</li>
                <li>• Close unnecessary applications during transfer</li>
                <li>• Keep both devices plugged in for power</li>
                <li>• Use wired internet connections when possible</li>
              </ul>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-2">Firewall and Security Software</h3>
              <p className="text-gray-700 mb-3">
                Some security software may block peer-to-peer connections. If transfers fail:
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Temporarily disable VPN on both devices</li>
                <li>• Check Windows Defender firewall settings</li>
                <li>• Ensure browsers are allowed through firewall</li>
                <li>• Try using a different browser</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Alternative Cross-Platform Methods</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-3 text-red-600">Traditional Methods (Limitations)</h3>
              <ul className="space-y-3 text-gray-700">
                <li>
                  <strong>Network Sharing:</strong>
                  <div className="text-sm text-gray-600">Requires complex SMB setup, security risks</div>
                </li>
                <li>
                  <strong>External Drive:</strong>
                  <div className="text-sm text-gray-600">Format compatibility issues, physical transfer needed</div>
                </li>
                <li>
                  <strong>Cloud Storage:</strong>
                  <div className="text-sm text-gray-600">Upload/download time, storage limits, privacy concerns</div>
                </li>
                <li>
                  <strong>Email:</strong>
                  <div className="text-sm text-gray-600">25MB limit, compression issues</div>
                </li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-3 text-green-600">QuickShare Advantages</h3>
              <ul className="space-y-3 text-gray-700">
                <li>
                  <strong>No Setup Required:</strong>
                  <div className="text-sm text-gray-600">Works immediately in any web browser</div>
                </li>
                <li>
                  <strong>Full Compatibility:</strong>
                  <div className="text-sm text-gray-600">Handles all file types and formats automatically</div>
                </li>
                <li>
                  <strong>Direct Transfer:</strong>
                  <div className="text-sm text-gray-600">Peer-to-peer, no cloud storage involved</div>
                </li>
                <li>
                  <strong>No Size Limits:</strong>
                  <div className="text-sm text-gray-600">Transfer files of any size efficiently</div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Security for Cross-Platform Transfers</h2>
          
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="font-semibold text-purple-800 mb-3">Enterprise-Grade Security:</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-purple-700">
                <li>✓ <strong>End-to-end encryption:</strong> Files encrypted during transfer</li>
                <li>✓ <strong>No server storage:</strong> Direct device-to-device transfer</li>
                <li>✓ <strong>Temporary links:</strong> Auto-expire after 24 hours</li>
                <li>✓ <strong>No registration:</strong> No personal data collected</li>
              </ul>
              <ul className="space-y-2 text-purple-700">
                <li>✓ <strong>WebRTC security:</strong> Industry-standard protocols</li>
                <li>✓ <strong>Browser sandboxing:</strong> Isolated execution environment</li>
                <li>✓ <strong>HTTPS only:</strong> Secure connection required</li>
                <li>✓ <strong>Open source:</strong> Publicly auditable code</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <details className="border rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">Will my Mac files work properly on Windows?</summary>
              <p className="mt-3 text-gray-700">
                Yes, QuickShare preserves all file metadata and formatting during transfer. Most Mac files are fully compatible with Windows, and for Mac-specific formats like Pages or Numbers, you can use the free iCloud versions or Microsoft Office.
              </p>
            </details>
            
            <details className="border rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">Do I need to be on the same network?</summary>
              <p className="mt-3 text-gray-700">
                No, both devices just need internet access. However, being on the same WiFi network can improve transfer speeds for large files.
              </p>
            </details>
            
            <details className="border rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">Can I transfer entire folders?</summary>
              <p className="mt-3 text-gray-700">
                Yes, you can select multiple files and folders. They'll be packaged together and maintain their folder structure when downloaded on Windows.
              </p>
            </details>
            
            <details className="border rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">What about file permissions and attributes?</summary>
              <p className="mt-3 text-gray-700">
                Basic file attributes are preserved, but Mac-specific permissions and extended attributes may not transfer to Windows due to different file system architectures.
              </p>
            </details>
          </div>
        </section>

        <section className="bg-gradient-to-r from-blue-50 to-green-50 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-semibold mb-4">Start Cross-Platform File Sharing</h2>
          <p className="text-gray-700 mb-6">
            Experience seamless file transfer between Mac and Windows with QuickShare's 
            browser-based, secure file sharing solution.
          </p>
          <a 
            href="/app" 
            className="inline-block bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-green-700 transition-colors"
          >
            Transfer Files Now
          </a>
        </section>

        <footer className="mt-12 pt-8 border-t">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span>Tags:</span>
            <a href="/blog/tag/mac" className="text-blue-600 hover:underline">Mac</a>
            <a href="/blog/tag/windows" className="text-blue-600 hover:underline">Windows</a>
            <a href="/blog/tag/cross-platform" className="text-blue-600 hover:underline">Cross-platform</a>
            <a href="/blog/tag/file-transfer" className="text-blue-600 hover:underline">File Transfer</a>
          </div>
        </footer>
      </article>
    </>
  );
}