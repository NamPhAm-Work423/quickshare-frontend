import { metadata } from './metadata';

export { metadata };

const structuredData = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Send Files from iPhone to PC",
  "description": "Complete guide to transfer files from iPhone to Windows PC without iTunes or cables using modern web technology",
  "image": "https://quickshare.com/images/iphone-to-pc-transfer.jpg",
  "totalTime": "PT5M",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": "0"
  },
  "supply": [
    {
      "@type": "HowToSupply",
      "name": "iPhone with Safari browser"
    },
    {
      "@type": "HowToSupply", 
      "name": "Windows PC with Chrome, Firefox, or Edge browser"
    },
    {
      "@type": "HowToSupply",
      "name": "WiFi connection (same network preferred)"
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
      "name": "Open QuickShare on iPhone",
      "text": "Open Safari on your iPhone and navigate to QuickShare.com",
      "image": "https://quickshare.com/images/step1-iphone.jpg"
    },
    {
      "@type": "HowToStep", 
      "name": "Select files to send",
      "text": "Tap the upload area and select photos, documents, or other files from your iPhone",
      "image": "https://quickshare.com/images/step2-select-files.jpg"
    },
    {
      "@type": "HowToStep",
      "name": "Generate sharing link", 
      "text": "QuickShare will generate a unique sharing link for your files",
      "image": "https://quickshare.com/images/step3-generate-link.jpg"
    },
    {
      "@type": "HowToStep",
      "name": "Share link to PC",
      "text": "Send the link to your PC via email, text message, or QR code",
      "image": "https://quickshare.com/images/step4-share-link.jpg"
    },
    {
      "@type": "HowToStep",
      "name": "Download on PC",
      "text": "Open the link on your Windows PC and download the files directly",
      "image": "https://quickshare.com/images/step5-download-pc.jpg"
    }
  ]
};

export default function SendFileFromIPhoneToPCGuide() {
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
            <span>Send Files from iPhone to PC</span>
          </nav>
          
          <h1 className="text-4xl font-bold mb-4">
            How to Send Files from iPhone to PC - Complete Guide 2025
          </h1>
          
          <div className="flex items-center gap-4 text-gray-600 mb-6">
            <time dateTime="2025-12-15">December 15, 2025</time>
            <span>•</span>
            <span>5 min read</span>
            <span>•</span>
            <span>By QuickShare Team</span>
          </div>
          
          <p className="text-xl text-gray-700 leading-relaxed">
            Transferring files from your iPhone to a Windows PC doesn't have to involve iTunes, cables, or complicated setup. 
            This comprehensive guide shows you how to send photos, documents, and other files wirelessly using modern web technology.
          </p>
        </header>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Why This Method Works Best</h2>
          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <h3 className="font-semibold text-blue-800 mb-3">Advantages of Web-Based Transfer:</h3>
            <ul className="space-y-2 text-blue-700">
              <li>✓ No software installation required</li>
              <li>✓ Works with any browser on both devices</li>
              <li>✓ No cables or physical connections needed</li>
              <li>✓ Secure peer-to-peer transfer</li>
              <li>✓ No file size limits from email or cloud storage</li>
              <li>✓ Files never stored on external servers</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Step-by-Step Instructions</h2>
          
          <div className="space-y-8">
            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-xl font-semibold mb-3">Step 1: Open QuickShare on Your iPhone</h3>
              <p className="text-gray-700 mb-4">
                Launch Safari on your iPhone and navigate to <strong>quickshare.com</strong>. The web application 
                is optimized for mobile browsers and will work seamlessly on iOS.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Tip:</strong> Add QuickShare to your home screen for quick access. Tap the share button 
                  in Safari and select "Add to Home Screen."
                </p>
              </div>
            </div>

            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-xl font-semibold mb-3">Step 2: Select Files to Transfer</h3>
              <p className="text-gray-700 mb-4">
                Tap the upload area on the QuickShare interface. You can select:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                <li>Photos and videos from your camera roll</li>
                <li>Documents from Files app</li>
                <li>PDFs, presentations, and spreadsheets</li>
                <li>Audio files and recordings</li>
                <li>Any other file type stored on your iPhone</li>
              </ul>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> You can select multiple files at once. The transfer will handle 
                  all selected files in a single session.
                </p>
              </div>
            </div>

            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-xl font-semibold mb-3">Step 3: Generate Sharing Link</h3>
              <p className="text-gray-700 mb-4">
                Once your files are selected, QuickShare automatically generates a unique, secure sharing link. 
                This link is temporary and will expire after the transfer is complete or after 24 hours.
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-xl font-semibold mb-3">Step 4: Share the Link to Your PC</h3>
              <p className="text-gray-700 mb-4">
                You have several options to get the link to your Windows PC:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                <li><strong>QR Code:</strong> Display the QR code and scan it with your PC's camera</li>
                <li><strong>Email:</strong> Send the link to yourself via email</li>
                <li><strong>Text Message:</strong> Send via SMS if you have messaging on your PC</li>
                <li><strong>Copy Link:</strong> Copy and paste through a shared clipboard service</li>
              </ul>
            </div>

            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-xl font-semibold mb-3">Step 5: Download Files on Your PC</h3>
              <p className="text-gray-700 mb-4">
                Open the shared link in any web browser on your Windows PC (Chrome, Firefox, Edge, etc.). 
                The files will begin transferring directly from your iPhone to your PC using peer-to-peer technology.
              </p>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Security Note:</strong> Files transfer directly between your devices without being 
                  uploaded to any server, ensuring maximum privacy and security.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Troubleshooting Common Issues</h2>
          
          <div className="space-y-6">
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-2">Connection Problems</h3>
              <p className="text-gray-700 mb-3">
                If the transfer isn't working, ensure both devices are connected to the internet. 
                Being on the same WiFi network can improve transfer speeds.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Check WiFi connection on both devices</li>
                <li>• Try refreshing the browser on both devices</li>
                <li>• Ensure no VPN is blocking the connection</li>
              </ul>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-2">Large File Transfers</h3>
              <p className="text-gray-700 mb-3">
                For very large files (over 1GB), the transfer may take longer. Keep both devices 
                active and connected during the transfer.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Keep iPhone screen active during transfer</li>
                <li>• Don't close the browser tabs</li>
                <li>• Ensure stable power on both devices</li>
              </ul>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-2">Browser Compatibility</h3>
              <p className="text-gray-700 mb-3">
                Modern browsers support the WebRTC technology used for transfers. If you experience 
                issues, try updating your browser.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Safari 11+ on iPhone</li>
                <li>• Chrome 60+ on PC</li>
                <li>• Firefox 55+ on PC</li>
                <li>• Edge 79+ on PC</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Alternative Methods</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-3">Traditional Methods</h3>
              <ul className="space-y-2 text-gray-700">
                <li><strong>iTunes:</strong> Requires software installation and cable</li>
                <li><strong>iCloud:</strong> Limited storage, requires Apple ID</li>
                <li><strong>Email:</strong> File size limitations (usually 25MB)</li>
                <li><strong>USB Cable:</strong> Requires physical connection</li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-3">Why QuickShare is Better</h3>
              <ul className="space-y-2 text-gray-700">
                <li><strong>No Installation:</strong> Works in any web browser</li>
                <li><strong>No Accounts:</strong> No sign-up or login required</li>
                <li><strong>No Limits:</strong> Transfer files of any size</li>
                <li><strong>Direct Transfer:</strong> Peer-to-peer, no server storage</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Security and Privacy</h2>
          
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-3">How Your Data Stays Safe:</h3>
            <ul className="space-y-2 text-green-700">
              <li>✓ <strong>End-to-end encryption:</strong> Files are encrypted during transfer</li>
              <li>✓ <strong>No server storage:</strong> Files never leave your devices</li>
              <li>✓ <strong>Temporary links:</strong> Sharing links expire automatically</li>
              <li>✓ <strong>No tracking:</strong> No personal information collected</li>
              <li>✓ <strong>Open source:</strong> Code is publicly auditable</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <details className="border rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">Do I need to install any apps?</summary>
              <p className="mt-3 text-gray-700">
                No, QuickShare works entirely in your web browser. No apps or software installation required on either device.
              </p>
            </details>
            
            <details className="border rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">Is there a file size limit?</summary>
              <p className="mt-3 text-gray-700">
                There are no artificial file size limits. The only limitation is your available storage space and internet connection speed.
              </p>
            </details>
            
            <details className="border rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">Can I transfer multiple files at once?</summary>
              <p className="mt-3 text-gray-700">
                Yes, you can select and transfer multiple files in a single session. All files will be packaged together for download.
              </p>
            </details>
            
            <details className="border rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">What happens if the transfer is interrupted?</summary>
              <p className="mt-3 text-gray-700">
                If the connection is lost, you can restart the transfer using the same link. The system will resume from where it left off when possible.
              </p>
            </details>
          </div>
        </section>

        <section className="bg-blue-50 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready to Transfer Your Files?</h2>
          <p className="text-gray-700 mb-6">
            Start sending files from your iPhone to PC right now with QuickShare's secure, 
            no-registration file transfer service.
          </p>
          <a 
            href="/app" 
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Start File Transfer
          </a>
        </section>

        <footer className="mt-12 pt-8 border-t">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span>Tags:</span>
            <a href="/blog/tag/iphone" className="text-blue-600 hover:underline">iPhone</a>
            <a href="/blog/tag/pc" className="text-blue-600 hover:underline">PC</a>
            <a href="/blog/tag/file-transfer" className="text-blue-600 hover:underline">File Transfer</a>
            <a href="/blog/tag/how-to" className="text-blue-600 hover:underline">How-to Guide</a>
          </div>
        </footer>
      </article>
    </>
  );
}