'use client';

import { useState, useCallback } from 'react';

type HashAlgorithm = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-512';

export default function ChecksumGeneratorPage() {
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>('SHA-256');
  const [textHash, setTextHash] = useState('');
  const [fileHash, setFileHash] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);

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
          // MD5 is not available in Web Crypto API, show placeholder
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
    } catch (error) {
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
    } catch (error) {
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Checksum Generator
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Generate cryptographic hashes and checksums for text and files. Verify file integrity 
            and detect changes using industry-standard algorithms.
          </p>
        </header>

        <section className="mb-8">
          <div className="bg-card border border-border p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Hash Algorithm</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-3">
                Select Hash Algorithm
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(['MD5', 'SHA-1', 'SHA-256', 'SHA-512'] as HashAlgorithm[]).map(algo => (
                  <button
                    key={algo}
                    onClick={() => handleAlgorithmChange(algo)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      algorithm === algo
                        ? 'bg-blue-600 text-white'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {algo}
                  </button>
                ))}
              </div>
              {algorithm === 'MD5' && (
                <p className="text-sm text-orange-600 mt-2">
                  ⚠️ MD5 is not cryptographically secure. Use SHA-256 or SHA-512 for security purposes.
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="bg-card border border-border p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Text Hash Generator</h2>
            
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {textHash && (
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Text Hash ({algorithm})</h3>
                  <button
                    onClick={() => copyToClipboard(textHash)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Copy
                  </button>
                </div>
                <div className="font-mono text-sm bg-background p-3 rounded border border-border break-all">
                  {textHash}
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="mb-8">
          <div className="bg-card border border-border p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">File Hash Generator</h2>
            
            <div className="mb-4">
              <label htmlFor="file-input" className="block text-sm font-medium text-foreground mb-2">
                Select File to Hash
              </label>
              <input
                id="file-input"
                type="file"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {selectedFile && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm">
                  <strong>Selected file:</strong> {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              </div>
            )}

            {isCalculating && (
              <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                <p className="text-sm">Calculating hash... Please wait.</p>
              </div>
            )}

            {fileHash && !isCalculating && (
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">File Hash ({algorithm})</h3>
                  <button
                    onClick={() => copyToClipboard(fileHash)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Copy
                  </button>
                </div>
                <div className="font-mono text-sm bg-background p-3 rounded border border-border break-all">
                  {fileHash}
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Understanding Checksums</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg">
              <h3 className="font-semibold mb-3">🔍 What are Checksums?</h3>
              <p className="text-sm text-foreground mb-3">
                Checksums are unique digital fingerprints that help verify file integrity. 
                Even a tiny change in the file will produce a completely different checksum.
              </p>
              <ul className="space-y-1 text-sm text-foreground">
                <li>• Detect file corruption</li>
                <li>• Verify download integrity</li>
                <li>• Confirm file authenticity</li>
                <li>• Monitor file changes</li>
              </ul>
            </div>
            <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-lg">
              <h3 className="font-semibold mb-3">🛡️ Security Levels</h3>
              <ul className="space-y-2 text-sm text-foreground">
                <li><strong>MD5:</strong> Fast but not secure (legacy use only)</li>
                <li><strong>SHA-1:</strong> Deprecated for security applications</li>
                <li><strong>SHA-256:</strong> Secure and widely used</li>
                <li><strong>SHA-512:</strong> Maximum security, larger hash</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Common Use Cases</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card border border-border p-6 rounded-lg">
              <h3 className="font-semibold mb-3">📥 Download Verification</h3>
              <p className="text-sm text-muted-foreground">
                Compare checksums to verify that downloaded files haven't been corrupted 
                or tampered with during transfer.
              </p>
            </div>
            <div className="bg-card border border-border p-6 rounded-lg">
              <h3 className="font-semibold mb-3">🔐 Password Hashing</h3>
              <p className="text-sm text-muted-foreground">
                Generate secure hashes for passwords and sensitive data (though specialized 
                algorithms like bcrypt are preferred for passwords).
              </p>
            </div>
            <div className="bg-card border border-border p-6 rounded-lg">
              <h3 className="font-semibold mb-3">📊 Data Deduplication</h3>
              <p className="text-sm text-muted-foreground">
                Identify duplicate files by comparing their checksums, useful for 
                backup systems and storage optimization.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Secure File Sharing</h2>
          <p className="mb-6 opacity-90">
            When sharing important files, use our secure transfer service to ensure 
            your files arrive intact and unmodified.
          </p>
          <a 
            href="/app" 
            className="inline-block bg-background text-primary px-6 py-3 rounded-lg font-semibold hover:bg-muted transition-colors"
          >
            Share Files Securely
          </a>
        </section>
      </div>
    </div>
  );
}