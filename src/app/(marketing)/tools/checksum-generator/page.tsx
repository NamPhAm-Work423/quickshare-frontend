'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Hash, 
  FileCheck, 
  Copy, 
  CheckCircle, 
  Shield, 
  Zap, 
  ArrowRight,
  Upload,
  AlertTriangle
} from 'lucide-react';

type HashAlgorithm = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-512';

export default function ChecksumGeneratorPage() {
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>('SHA-256');
  const [textHash, setTextHash] = useState('');
  const [fileHash, setFileHash] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedFile, setCopiedFile] = useState(false);

  const calculateTextHash = useCallback(async (text: string, algo: HashAlgorithm) => {
    if (!text) {
      setTextHash('');
      return;
    }

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      
      let hashBuffer: ArrayBuffer;
      switch (algo) {
        case 'MD5':
          setTextHash('MD5 not available in browser (use SHA-256 instead)');
          return;
        case 'SHA-1':
          hashBuffer = await crypto.subtle.digest('SHA-1', data);
          break;
        case 'SHA-256':
          hashBuffer = await crypto.subtle.digest('SHA-256', data);
          break;
        case 'SHA-512':
          hashBuffer = await crypto.subtle.digest('SHA-512', data);
          break;
      }

      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setTextHash(hashHex);
    } catch {
      setTextHash('Error calculating hash');
    }
  }, []);

  const calculateFileHash = useCallback(async (file: File, algo: HashAlgorithm) => {
    setIsCalculating(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      
      let hashBuffer: ArrayBuffer;
      switch (algo) {
        case 'MD5':
          setFileHash('MD5 not available in browser (use SHA-256 instead)');
          setIsCalculating(false);
          return;
        case 'SHA-1':
          hashBuffer = await crypto.subtle.digest('SHA-1', arrayBuffer);
          break;
        case 'SHA-256':
          hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
          break;
        case 'SHA-512':
          hashBuffer = await crypto.subtle.digest('SHA-512', arrayBuffer);
          break;
      }

      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setFileHash(hashHex);
    } catch {
      setFileHash('Error calculating file hash');
    }
    setIsCalculating(false);
  }, []);

  const handleTextChange = (text: string) => {
    setInputText(text);
    calculateTextHash(text, algorithm);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      calculateFileHash(file, algorithm);
    } else {
      setSelectedFile(null);
      setFileHash('');
    }
  };

  const handleAlgorithmChange = (algo: HashAlgorithm) => {
    setAlgorithm(algo);
    if (inputText) {
      calculateTextHash(inputText, algo);
    }
    if (selectedFile) {
      calculateFileHash(selectedFile, algo);
    }
  };

  const copyToClipboard = (text: string, type: 'text' | 'file') => {
    navigator.clipboard.writeText(text);
    if (type === 'text') {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } else {
      setCopiedFile(true);
      setTimeout(() => setCopiedFile(false), 2000);
    }
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-background to-blue-500/5" />
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur-xl opacity-50 animate-pulse" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-xl flex items-center justify-center">
                <Hash className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Checksum Generator
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Generate cryptographic hashes and checksums for text and files. Verify file integrity 
              and detect changes using industry-standard algorithms.
            </p>
          </div>
        </div>
      </section>

      {/* Algorithm Selection */}
      <section className="container mx-auto px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Hash Algorithm
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(['MD5', 'SHA-1', 'SHA-256', 'SHA-512'] as HashAlgorithm[]).map(algo => (
                <button
                  key={algo}
                  onClick={() => handleAlgorithmChange(algo)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                    algorithm === algo
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-transparent shadow-lg shadow-cyan-500/25'
                      : 'bg-muted/50 text-foreground hover:bg-muted border-border hover:border-primary/30'
                  }`}
                >
                  {algo}
                </button>
              ))}
            </div>
            
            {algorithm === 'MD5' && (
              <div className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <p className="text-sm">
                  MD5 is not cryptographically secure. Use SHA-256 or SHA-512 for security purposes.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Text Hash Generator */}
      <section className="container mx-auto px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Text Hash Generator
            </h2>
            
            <div className="mb-4">
              <label htmlFor="text-input" className="block text-sm font-medium text-foreground mb-2">
                Enter Text to Hash
              </label>
              <textarea
                id="text-input"
                value={inputText}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Enter your text here..."
                rows={4}
                className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>

            {textHash && (
              <div className="bg-muted/50 p-4 rounded-xl border border-border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm">Text Hash ({algorithm})</h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(textHash, 'text')}
                    className="h-8 px-3 text-xs"
                  >
                    {copiedText ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <div className="font-mono text-sm bg-background p-3 rounded-lg border border-border break-all">
                  {textHash}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* File Hash Generator */}
      <section className="container mx-auto px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-primary" />
              File Hash Generator
            </h2>
            
            <div className="mb-4">
              <label htmlFor="file-input" className="block text-sm font-medium text-foreground mb-2">
                Select File to Hash
              </label>
              <div className="relative">
                <input
                  id="file-input"
                  type="file"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex items-center gap-4 px-4 py-4 border-2 border-dashed border-border rounded-xl bg-muted/30 hover:bg-muted/50 hover:border-primary/30 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Click to select a file</p>
                    <p className="text-sm text-muted-foreground">or drag and drop</p>
                  </div>
                </div>
              </div>
            </div>

            {selectedFile && (
              <div className="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-xl">
                <p className="text-sm">
                  <strong>Selected file:</strong> {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              </div>
            )}

            {isCalculating && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm">Calculating hash... Please wait.</p>
                </div>
              </div>
            )}

            {fileHash && !isCalculating && (
              <div className="bg-muted/50 p-4 rounded-xl border border-border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm">File Hash ({algorithm})</h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(fileHash, 'file')}
                    className="h-8 px-3 text-xs"
                  >
                    {copiedFile ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <div className="font-mono text-sm bg-background p-3 rounded-lg border border-border break-all">
                  {fileHash}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="container mx-auto px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Understanding Checksums</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span className="text-xl">🔍</span>
                What are Checksums?
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Checksums are unique digital fingerprints that help verify file integrity. 
                Even a tiny change in the file will produce a completely different checksum.
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Detect file corruption</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Verify download integrity</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Confirm file authenticity</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Monitor file changes</li>
              </ul>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span className="text-xl">🛡️</span>
                Security Levels
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><strong className="text-foreground">MD5:</strong> Fast but not secure (legacy use only)</li>
                <li><strong className="text-foreground">SHA-1:</strong> Deprecated for security applications</li>
                <li><strong className="text-foreground">SHA-256:</strong> Secure and widely used</li>
                <li><strong className="text-foreground">SHA-512:</strong> Maximum security, larger hash</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="container mx-auto px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Common Use Cases</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '📥', title: 'Download Verification', desc: 'Compare checksums to verify that downloaded files haven\'t been corrupted or tampered with during transfer.' },
              { icon: '🔐', title: 'Password Hashing', desc: 'Generate secure hashes for passwords and sensitive data (though specialized algorithms like bcrypt are preferred).' },
              { icon: '📊', title: 'Data Deduplication', desc: 'Identify duplicate files by comparing their checksums, useful for backup systems and storage optimization.' },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all">
                <span className="text-2xl mb-3 block">{item.icon}</span>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-500 to-cyan-600 bg-[length:200%_100%] animate-gradient p-8 md:p-12">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }} />
            </div>
            
            <div className="relative flex flex-col md:flex-row items-center gap-6 text-white">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <Shield className="w-8 h-8" />
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  Secure File Sharing
                </h2>
                <p className="text-white/80 text-lg">
                  When sharing important files, use our secure transfer service to ensure 
                  your files arrive intact and unmodified.
                </p>
              </div>
              
              <Link href="/app">
                <Button 
                  size="lg" 
                  className="bg-white text-cyan-600 hover:bg-white/90 font-semibold shadow-xl"
                >
                  Share Files Securely
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