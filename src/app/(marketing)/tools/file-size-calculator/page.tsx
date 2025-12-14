'use client';

import { useState } from 'react';

const units = [
  { label: 'Bytes', value: 'bytes', multiplier: 1 },
  { label: 'KB', value: 'kb', multiplier: 1024 },
  { label: 'MB', value: 'mb', multiplier: 1024 * 1024 },
  { label: 'GB', value: 'gb', multiplier: 1024 * 1024 * 1024 },
  { label: 'TB', value: 'tb', multiplier: 1024 * 1024 * 1024 * 1024 },
];

export default function FileSizeCalculatorPage() {
  const [inputValue, setInputValue] = useState('');
  const [inputUnit, setInputUnit] = useState('mb');
  const [results, setResults] = useState<Record<string, string>>({});

  const calculateSizes = (value: string, unit: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0) {
      setResults({});
      return;
    }

    const inputMultiplier = units.find(u => u.value === unit)?.multiplier || 1;
    const bytes = numValue * inputMultiplier;

    const newResults: Record<string, string> = {};
    units.forEach(u => {
      const converted = bytes / u.multiplier;
      newResults[u.value] = converted.toLocaleString('en-US', {
        maximumFractionDigits: converted < 1 ? 6 : 2
      });
    });

    setResults(newResults);
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    calculateSizes(value, inputUnit);
  };

  const handleUnitChange = (unit: string) => {
    setInputUnit(unit);
    if (inputValue) {
      calculateSizes(inputValue, unit);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            File Size Calculator
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Convert between different file size units instantly. Calculate storage requirements 
            and estimate transfer times for your files.
          </p>
        </header>

        <section className="mb-8">
          <div className="bg-card border border-border p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Calculate File Size</h2>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="file-size-input" className="block text-sm font-medium text-foreground mb-2">
                  Enter File Size
                </label>
                <input
                  id="file-size-input"
                  type="number"
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="Enter size..."
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="unit-select" className="block text-sm font-medium text-foreground mb-2">
                  Select Unit
                </label>
                <select
                  id="unit-select"
                  value={inputUnit}
                  onChange={(e) => handleUnitChange(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                >
                  {units.map(unit => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {Object.keys(results).length > 0 && (
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-4">Conversion Results</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {units.map(unit => (
                    <div key={unit.value} className="text-center">
                      <div className="text-sm text-muted-foreground mb-1">{unit.label}</div>
                      <div className="font-mono text-sm bg-background p-2 rounded border border-border">
                        {results[unit.value]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Understanding File Sizes</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg">
              <h3 className="font-semibold mb-3">📊 Common File Sizes</h3>
              <ul className="space-y-2 text-sm">
                <li><strong>Text Document:</strong> 10-100 KB</li>
                <li><strong>High-res Photo:</strong> 2-10 MB</li>
                <li><strong>Music File (MP3):</strong> 3-5 MB</li>
                <li><strong>HD Video (1 min):</strong> 50-100 MB</li>
                <li><strong>4K Video (1 min):</strong> 200-400 MB</li>
                <li><strong>Movie (HD):</strong> 1-4 GB</li>
              </ul>
            </div>
            <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-lg">
              <h3 className="font-semibold mb-3">💾 Storage Capacity</h3>
              <ul className="space-y-2 text-sm">
                <li><strong>USB Flash Drive:</strong> 8-128 GB</li>
                <li><strong>DVD:</strong> 4.7 GB</li>
                <li><strong>Blu-ray:</strong> 25-50 GB</li>
                <li><strong>Laptop SSD:</strong> 256 GB - 2 TB</li>
                <li><strong>External HDD:</strong> 1-8 TB</li>
                <li><strong>Cloud Storage:</strong> 5 GB - Unlimited</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Binary vs Decimal Units</h2>
          <div className="bg-yellow-50 dark:bg-yellow-950/20 p-6 rounded-lg">
            <p className="text-foreground mb-4">
              This calculator uses binary units (1024-based) which are standard in computing:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Binary (Computing)</h4>
                <ul className="text-sm space-y-1">
                  <li>1 KB = 1,024 bytes</li>
                  <li>1 MB = 1,024 KB</li>
                  <li>1 GB = 1,024 MB</li>
                  <li>1 TB = 1,024 GB</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Decimal (Marketing)</h4>
                <ul className="text-sm space-y-1">
                  <li>1 KB = 1,000 bytes</li>
                  <li>1 MB = 1,000 KB</li>
                  <li>1 GB = 1,000 MB</li>
                  <li>1 TB = 1,000 GB</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Need to Transfer Large Files?</h2>
          <p className="mb-6 opacity-90">
            Use our secure file sharing service to send files of any size without worrying 
            about email attachment limits or cloud storage restrictions.
          </p>
          <a 
            href="/app" 
            className="inline-block bg-background text-primary px-6 py-3 rounded-lg font-semibold hover:bg-muted transition-colors"
          >
            Start File Transfer
          </a>
        </section>
      </div>
    </div>
  );
}