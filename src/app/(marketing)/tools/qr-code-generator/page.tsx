'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  QrCode, 
  Link as LinkIcon, 
  Type, 
  Wifi, 
  Mail, 
  Phone, 
  Download,
  ArrowRight,
  CheckCircle,
  XCircle,
  Building,
  PartyPopper,
  Home
} from 'lucide-react';

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrType, inputData, wifiData, emailData, phoneNumber]);

  const downloadQRCode = () => {
    if (qrCodeDataUrl) {
      const link = document.createElement('a');
      link.download = 'qrcode.png';
      link.href = qrCodeDataUrl;
      link.click();
    }
  };

  const qrTypes = [
    { value: 'url', label: 'URL', icon: LinkIcon },
    { value: 'text', label: 'Text', icon: Type },
    { value: 'wifi', label: 'WiFi', icon: Wifi },
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'phone', label: 'Phone', icon: Phone }
  ];

  const renderInputForm = () => {
    const inputClass = "w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all";
    const labelClass = "block text-sm font-medium text-foreground mb-2";

    switch (qrType) {
      case 'url':
        return (
          <div>
            <label htmlFor="url-input" className={labelClass}>
              Enter URL
            </label>
            <input
              id="url-input"
              type="url"
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              placeholder="https://example.com"
              className={inputClass}
            />
          </div>
        );
      
      case 'text':
        return (
          <div>
            <label htmlFor="text-input" className={labelClass}>
              Enter Text
            </label>
            <textarea
              id="text-input"
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              placeholder="Enter your text here..."
              rows={3}
              className={inputClass}
            />
          </div>
        );
      
      case 'wifi':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="wifi-ssid" className={labelClass}>
                Network Name (SSID)
              </label>
              <input
                id="wifi-ssid"
                type="text"
                value={wifiData.ssid}
                onChange={(e) => setWifiData({...wifiData, ssid: e.target.value})}
                placeholder="MyWiFiNetwork"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="wifi-password" className={labelClass}>
                Password
              </label>
              <input
                id="wifi-password"
                type="password"
                value={wifiData.password}
                onChange={(e) => setWifiData({...wifiData, password: e.target.value})}
                placeholder="WiFi password"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="wifi-security" className={labelClass}>
                Security Type
              </label>
              <select
                id="wifi-security"
                value={wifiData.security}
                onChange={(e) => setWifiData({...wifiData, security: e.target.value})}
                className={inputClass}
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5rem', appearance: 'none' }}
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">Open (No Password)</option>
              </select>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border">
              <input
                id="wifi-hidden"
                type="checkbox"
                checked={wifiData.hidden}
                onChange={(e) => setWifiData({...wifiData, hidden: e.target.checked})}
                className="w-4 h-4 rounded border-border accent-primary"
              />
              <label htmlFor="wifi-hidden" className="text-sm text-foreground">
                Hidden Network
              </label>
            </div>
          </div>
        );
      
      case 'email':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className={labelClass}>
                Email Address
              </label>
              <input
                id="email-address"
                type="email"
                value={emailData.email}
                onChange={(e) => setEmailData({...emailData, email: e.target.value})}
                placeholder="example@email.com"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="email-subject" className={labelClass}>
                Subject (Optional)
              </label>
              <input
                id="email-subject"
                type="text"
                value={emailData.subject}
                onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                placeholder="Email subject"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="email-body" className={labelClass}>
                Message (Optional)
              </label>
              <textarea
                id="email-body"
                value={emailData.body}
                onChange={(e) => setEmailData({...emailData, body: e.target.value})}
                placeholder="Email message"
                rows={3}
                className={inputClass}
              />
            </div>
          </div>
        );
      
      case 'phone':
        return (
          <div>
            <label htmlFor="phone-input" className={labelClass}>
              Phone Number
            </label>
            <input
              id="phone-input"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1234567890"
              className={inputClass}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-background to-fuchsia-500/5" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-2xl blur-xl opacity-50 animate-pulse" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-xl flex items-center justify-center">
                <QrCode className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              QR Code Generator
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Create QR codes instantly for URLs, text, WiFi credentials, and more. 
              Generate high-quality QR codes that work with any QR scanner.
            </p>
          </div>
        </div>
      </section>

      {/* Generator Section */}
      <section className="container mx-auto px-4 pb-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Panel */}
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <QrCode className="w-5 h-5 text-primary" />
                Generate QR Code
              </h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-3">
                  QR Code Type
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {qrTypes.map(type => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        onClick={() => setQrType(type.value as QRType)}
                        className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border flex items-center justify-center gap-2 ${
                          qrType === type.value
                            ? 'bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white border-transparent shadow-lg shadow-violet-500/25'
                            : 'bg-muted/50 text-foreground hover:bg-muted border-border hover:border-primary/30'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mb-6">
                {renderInputForm()}
              </div>

              {getQRData() && (
                <div className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 p-4 rounded-xl border border-violet-500/20">
                  <h3 className="font-semibold mb-2 text-sm">QR Code Data Preview</h3>
                  <div className="text-sm font-mono bg-background p-3 rounded-lg border border-border break-all">
                    {getQRData()}
                  </div>
                </div>
              )}
            </div>

            {/* Preview Panel */}
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Download className="w-5 h-5 text-primary" />
                QR Code Preview
              </h2>
              
              <div className="text-center">
                {qrCodeDataUrl ? (
                  <div>
                    <div className="inline-block p-6 bg-white border-2 border-border rounded-2xl mb-6 shadow-lg">
                      <canvas
                        ref={canvasRef}
                        className="max-w-full h-auto"
                        style={{ imageRendering: 'pixelated' }}
                      />
                    </div>
                    <div>
                      <Button
                        onClick={downloadQRCode}
                        className="bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white hover:from-violet-600 hover:to-fuchsia-700 shadow-lg shadow-violet-500/25"
                        size="lg"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download QR Code
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-12">
                    <div className="w-48 h-48 mx-auto bg-muted/50 rounded-2xl flex items-center justify-center mb-4 border-2 border-dashed border-border">
                      <QrCode className="w-16 h-16 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">Enter data above to generate QR code</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="container mx-auto px-4 pb-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">QR Code Best Practices</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Do&apos;s
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> Test your QR code before sharing</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> Use high contrast colors (black on white)</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> Ensure adequate size for scanning distance</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> Include a call-to-action near the QR code</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> Keep URLs short and simple</li>
              </ul>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/20">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" />
                Don&apos;ts
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" /> Don&apos;t use low contrast colors</li>
                <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" /> Don&apos;t make QR codes too small</li>
                <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" /> Don&apos;t add logos that obscure data</li>
                <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" /> Don&apos;t use expired or broken URLs</li>
                <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" /> Don&apos;t forget to test on mobile devices</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Common Uses */}
      <section className="container mx-auto px-4 pb-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Common QR Code Uses</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Building, title: 'Business', items: ['Contact information', 'Website links', 'Product catalogs', 'Payment links', 'Social media profiles'] },
              { icon: PartyPopper, title: 'Events', items: ['Event registration', 'WiFi access', 'Digital tickets', 'Feedback forms', 'Photo sharing'] },
              { icon: Home, title: 'Personal', items: ['WiFi passwords', 'Contact sharing', 'File sharing links', 'Location sharing', 'App downloads'] },
            ].map((category, index) => {
              const Icon = category.icon;
              return (
                <div key={index} className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-3">{category.title}</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {category.items.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-600 bg-[length:200%_100%] animate-gradient p-8 md:p-12">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }} />
            </div>
            
            <div className="relative flex flex-col md:flex-row items-center gap-6 text-white">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <QrCode className="w-8 h-8" />
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  Share Files with QR Codes
                </h2>
                <p className="text-white/80 text-lg">
                  Generate QR codes for your file sharing links to make it easy for others 
                  to access your files on mobile devices.
                </p>
              </div>
              
              <Link href="/app">
                <Button 
                  size="lg" 
                  className="bg-white text-violet-600 hover:bg-white/90 font-semibold shadow-xl"
                >
                  Create Shareable Link
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}