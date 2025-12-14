import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How to Send Files - Step-by-Step Guides | QuickShare',
  description: 'Learn how to send files between different devices and platforms with our comprehensive step-by-step guides.',
  keywords: ['how to send files', 'file transfer guide', 'send files between devices', 'file sharing tutorial'],
  openGraph: {
    title: 'How to Send Files - Step-by-Step Guides',
    description: 'Learn how to send files between different devices and platforms with our comprehensive step-by-step guides.',
    type: 'website',
  },
};

export default function HowToCluster() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">How to Send Files</h1>
        <p className="text-xl text-gray-600">
          Step-by-step guides for sending files between different devices and platforms securely and efficiently.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Popular Guides</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <article className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3">
              <a href="/blog/how-to/send-file-from-iphone-to-pc" className="hover:text-blue-600">
                Send Files from iPhone to PC
              </a>
            </h3>
            <p className="text-gray-600 mb-4">
              Complete guide to transferring files from your iPhone to a Windows PC without iTunes or cables.
            </p>
            <span className="text-sm text-blue-600">Read more →</span>
          </article>

          <article className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3">
              <a href="/blog/how-to/send-file-from-mac-to-windows" className="hover:text-blue-600">
                Send Files from Mac to Windows
              </a>
            </h3>
            <p className="text-gray-600 mb-4">
              Learn how to easily transfer files between Mac and Windows computers using modern web technology.
            </p>
            <span className="text-sm text-blue-600">Read more →</span>
          </article>

          <article className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3">
              <a href="/blog/how-to/send-file-over-wifi-without-internet" className="hover:text-blue-600">
                Send Files Over WiFi Without Internet
              </a>
            </h3>
            <p className="text-gray-600 mb-4">
              Discover how to share files on the same WiFi network even when there's no internet connection.
            </p>
            <span className="text-sm text-blue-600">Read more →</span>
          </article>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">By Device Type</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Mobile Devices</h3>
            <ul className="space-y-3">
              <li>
                <a href="/blog/how-to/send-file-from-iphone-to-pc" className="text-blue-600 hover:underline">
                  iPhone to PC File Transfer
                </a>
              </li>
              <li>
                <a href="/blog/how-to/send-file-from-android-to-mac" className="text-blue-600 hover:underline">
                  Android to Mac File Transfer
                </a>
              </li>
              <li>
                <a href="/blog/how-to/send-file-from-phone-to-computer" className="text-blue-600 hover:underline">
                  Phone to Computer Transfer
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Desktop Computers</h3>
            <ul className="space-y-3">
              <li>
                <a href="/blog/how-to/send-file-from-mac-to-windows" className="text-blue-600 hover:underline">
                  Mac to Windows Transfer
                </a>
              </li>
              <li>
                <a href="/blog/how-to/send-file-from-windows-to-mac" className="text-blue-600 hover:underline">
                  Windows to Mac Transfer
                </a>
              </li>
              <li>
                <a href="/blog/how-to/send-file-between-computers" className="text-blue-600 hover:underline">
                  Computer to Computer Transfer
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Special Scenarios</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h4 className="font-semibold mb-3 text-blue-800">No Internet Connection</h4>
            <p className="text-blue-700 mb-4">
              Learn how to transfer files when you don't have internet access but are on the same network.
            </p>
            <a href="/blog/how-to/send-file-over-wifi-without-internet" className="text-blue-600 hover:underline">
              Read Guide →
            </a>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg">
            <h4 className="font-semibold mb-3 text-green-800">Large Files</h4>
            <p className="text-green-700 mb-4">
              Best practices for transferring large files efficiently and securely between devices.
            </p>
            <a href="/blog/how-to/send-large-files-quickly" className="text-green-600 hover:underline">
              Read Guide →
            </a>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg">
            <h4 className="font-semibold mb-3 text-purple-800">Multiple Files</h4>
            <p className="text-purple-700 mb-4">
              Efficiently organize and send multiple files or entire folders between devices.
            </p>
            <a href="/blog/how-to/send-multiple-files-at-once" className="text-purple-600 hover:underline">
              Read Guide →
            </a>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Quick Start Guide</h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Send Any File in 3 Simple Steps</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                1
              </div>
              <h4 className="font-semibold mb-2">Select Your Files</h4>
              <p className="text-gray-600">
                Choose the files you want to send from your device
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                2
              </div>
              <h4 className="font-semibold mb-2">Share the Link</h4>
              <p className="text-gray-600">
                Send the generated link to the recipient via any method
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                3
              </div>
              <h4 className="font-semibold mb-2">Transfer Complete</h4>
              <p className="text-gray-600">
                Files transfer directly between devices securely
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}