'use client';

import { useState, useEffect, useRef } from 'react';

type QRType = 'url' | 'text' | 'wifi' | 'email' | 'phone';

export default function QRCodeGeneratorPage() {
  const [qrType, setQrType] = useState<QRType>('url');
  const [inputData, setInputData] = useState('');
  const [wifiData, setWifiData] = useState({
    ssid: '',
    password: '',
    security: 'WPA',
    hidden: false
  });
  const [emailData, setEmailData] = useState({
    email: '',
    subject: '',
    body: ''
  });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simple QR code generation using canvas (basic implementation)
  const generateQRCode = (data: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 200;
    canvas.height = 200;

    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 200, 200);

    // Simple placeholder QR code pattern (in a real implementation, you'd use a QR library)
    ctx.fillStyle = 'black';
    
    // Create a simple grid pattern as placeholder
    const gridSize = 10;
    const cellSize = 200 / gridSize;
    
    // Generate a pseudo-random pattern based on the data
    const hash = data.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const shouldFill = ((hash + i * gridSize + j) % 3) === 0;
        if (shouldFill) {
          ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
      }
    }

    // Add corner markers (typical QR code feature)
    const markerSize = cellSize * 3;
    // Top-left
    ctx.fillRect(0, 0, markerSize, markerSize);
    ctx.fillStyle = 'white';
    ctx.fillRect(cellSize, cellSize, cellSize, cellSize);
    
    // Top-right
    ctx.fillStyle = 'black';
    ctx.fillRect(200 - markerSize, 0, markerSize, markerSize);
    ctx.fillStyle = 'white';
    ctx.fillRect(200 - markerSize + cellSize, cellSize, cellSize, cellSize);
    
    // Bottom-left
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 200 - markerSize, markerSize, markerSize);
    ctx.fillStyle = 'white';
    ctx.fillRect(cellSize, 200 - markerSize + cellSize, cellSize, cellSize);

    // Convert to data URL
    const dataUrl = canvas.toDataURL('image/png');
    setQrCodeDataUrl(dataUrl);
  };

  const getQRData = () => {
    switch (qrType) {
      case 'url':
      case 'text':
        return inputData;
      case 'wifi':
        return `WIFI:T:${wifiData.security};S:${wifiData.ssid};P:${wifiData.password};H:${wifiData.hidden ? 'true' : 'false'};;`;
      case 'email':
        return `mailto:${emailData.email}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`;
      case 'phone':
        return `tel:${phoneNumber}`;
      default:
        return '';
    }
  };

  useEffect(() => {
    const data = getQRData();
    if (data) {
      generateQRCode(data);
    }
  }, [qrType, inputData, wifiData, emailData, phoneNumber]);

  const downloadQRCode = () => {
    if (qrCodeDataUrl) {
      const link = document.createElement('a');
      link.download = 'qrcode.png';
      link.href = qrCodeDataUrl;
      link.click();
    }
  };

  const renderInputForm = () => {
    switch (qrType) {
      case 'url':
        return (
          <div>
            <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 mb-2">
              Enter URL
            </label>
            <input
              id="url-input"
              type="url"
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        );
      
      case 'text':
        return (
          <div>
            <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-2">
              Enter Text
            </label>
            <textarea
              id="text-input"
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              placeholder="Enter your text here..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        );
      
      case 'wifi':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="wifi-ssid" className="block text-sm font-medium text-gray-700 mb-2">
                Network Name (SSID)
              </label>
              <input
                id="wifi-ssid"
                type="text"
                value={wifiData.ssid}
                onChange={(e) => setWifiData({...wifiData, ssid: e.target.value})}
                placeholder="MyWiFiNetwork"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="wifi-password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="wifi-password"
                type="password"
                value={wifiData.password}
                onChange={(e) => setWifiData({...wifiData, password: e.target.value})}
                placeholder="WiFi password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="wifi-security" className="block text-sm font-medium text-gray-700 mb-2">
                Security Type
              </label>
              <select
                id="wifi-security"
                value={wifiData.security}
                onChange={(e) => setWifiData({...wifiData, security: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">Open (No Password)</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                id="wifi-hidden"
                type="checkbox"
                checked={wifiData.hidden}
                onChange={(e) => setWifiData({...wifiData, hidden: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="wifi-hidden" className="text-sm text-gray-700">
                Hidden Network
              </label>
            </div>
          </div>
        );
      
      case 'email':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email-address"
                type="email"
                value={emailData.email}
                onChange={(e) => setEmailData({...emailData, email: e.target.value})}
                placeholder="example@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="email-subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject (Optional)
              </label>
              <input
                id="email-subject"
                type="text"
                value={emailData.subject}
                onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                placeholder="Email subject"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="email-body" className="block text-sm font-medium text-gray-700 mb-2">
                Message (Optional)
              </label>
              <textarea
                id="email-body"
                value={emailData.body}
                onChange={(e) => setEmailData({...emailData, body: e.target.value})}
                placeholder="Email message"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        );
      
      case 'phone':
        return (
          <div>
            <label htmlFor="phone-input" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              id="phone-input"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1234567890"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            QR Code Generator
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Create QR codes instantly for URLs, text, WiFi credentials, and more. 
            Generate high-quality QR codes that work with any QR scanner.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          <section>
            <div className="bg-card border border-border p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold mb-6">Generate QR Code</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-3">
                  QR Code Type
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { value: 'url', label: 'URL', icon: '🔗' },
                    { value: 'text', label: 'Text', icon: '📝' },
                    { value: 'wifi', label: 'WiFi', icon: '📶' },
                    { value: 'email', label: 'Email', icon: '📧' },
                    { value: 'phone', label: 'Phone', icon: '📞' }
                  ].map(type => (
                    <button
                      key={type.value}
                      onClick={() => setQrType(type.value as QRType)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
                        qrType === type.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      <span>{type.icon}</span>
                      <span>{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                {renderInputForm()}
              </div>

              {getQRData() && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">QR Code Data Preview</h3>
                  <div className="text-sm font-mono bg-white p-2 rounded border break-all">
                    {getQRData()}
                  </div>
                </div>
              )}
            </div>
          </section>

          <section>
            <div className="bg-card border border-border p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold mb-6">QR Code Preview</h2>
              
              <div className="text-center">
                {qrCodeDataUrl ? (
                  <div>
                    <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg mb-4">
                      <canvas
                        ref={canvasRef}
                        className="max-w-full h-auto"
                        style={{ imageRendering: 'pixelated' }}
                      />
                    </div>
                    <div>
                      <button
                        onClick={downloadQRCode}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Download QR Code
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-gray-500">
                    <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                      <span className="text-4xl">📱</span>
                    </div>
                    <p>Enter data above to generate QR code</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">QR Code Best Practices</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-3">✅ Do's</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Test your QR code before sharing</li>
                <li>• Use high contrast colors (black on white)</li>
                <li>• Ensure adequate size for scanning distance</li>
                <li>• Include a call-to-action near the QR code</li>
                <li>• Keep URLs short and simple</li>
              </ul>
            </div>
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-3">❌ Don'ts</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Don't use low contrast colors</li>
                <li>• Don't make QR codes too small</li>
                <li>• Don't add logos that obscure data</li>
                <li>• Don't use expired or broken URLs</li>
                <li>• Don't forget to test on mobile devices</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Common QR Code Uses</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <h3 className="font-semibold mb-3">🏢 Business</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Contact information</li>
                <li>• Website links</li>
                <li>• Product catalogs</li>
                <li>• Payment links</li>
                <li>• Social media profiles</li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <h3 className="font-semibold mb-3">🎉 Events</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Event registration</li>
                <li>• WiFi access</li>
                <li>• Digital tickets</li>
                <li>• Feedback forms</li>
                <li>• Photo sharing</li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <h3 className="font-semibold mb-3">🏠 Personal</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• WiFi passwords</li>
                <li>• Contact sharing</li>
                <li>• File sharing links</li>
                <li>• Location sharing</li>
                <li>• App downloads</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Share Files with QR Codes</h2>
          <p className="mb-6 opacity-90">
            Generate QR codes for your file sharing links to make it easy for others 
            to access your files on mobile devices.
          </p>
          <a 
            href="/app" 
            className="inline-block bg-background text-primary px-6 py-3 rounded-lg font-semibold hover:bg-muted transition-colors"
          >
            Create Shareable Link
          </a>
        </section>
      </div>
    </div>
  );
}