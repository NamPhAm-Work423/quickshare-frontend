'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Calculator, 
  HardDrive, 
  ArrowRight,
  FileText,
  Image,
  Music,
  Video,
  Folder,
  Database,
  Usb
} from 'lucide-react';

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
    <div className="relative">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-background to-pink-500/5" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-50 animate-pulse" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-xl flex items-center justify-center">
                <Calculator className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              File Size Calculator
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Convert between different file size units instantly. Calculate storage requirements 
              and estimate transfer times for your files.
            </p>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="container mx-auto px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-primary" />
              Calculate File Size
            </h2>
            
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
                  className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
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
                  className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none cursor-pointer"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5rem' }}
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
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-6 rounded-xl border border-purple-500/20">
                <h3 className="font-semibold mb-4">Conversion Results</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {units.map(unit => (
                    <div key={unit.value} className="text-center group">
                      <div className="text-sm text-muted-foreground mb-2">{unit.label}</div>
                      <div className="font-mono text-sm bg-background p-3 rounded-lg border border-border group-hover:border-primary/30 transition-colors">
                        {results[unit.value]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="container mx-auto px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Understanding File Sizes</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <span className="text-xl">📊</span>
                Common File Sizes
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <span><strong className="text-foreground">Text Document:</strong> <span className="text-muted-foreground">10-100 KB</span></span>
                </li>
                <li className="flex items-center gap-3">
                  <Image className="w-5 h-5 text-green-500" />
                  <span><strong className="text-foreground">High-res Photo:</strong> <span className="text-muted-foreground">2-10 MB</span></span>
                </li>
                <li className="flex items-center gap-3">
                  <Music className="w-5 h-5 text-purple-500" />
                  <span><strong className="text-foreground">Music File (MP3):</strong> <span className="text-muted-foreground">3-5 MB</span></span>
                </li>
                <li className="flex items-center gap-3">
                  <Video className="w-5 h-5 text-red-500" />
                  <span><strong className="text-foreground">HD Video (1 min):</strong> <span className="text-muted-foreground">50-100 MB</span></span>
                </li>
                <li className="flex items-center gap-3">
                  <Video className="w-5 h-5 text-orange-500" />
                  <span><strong className="text-foreground">4K Video (1 min):</strong> <span className="text-muted-foreground">200-400 MB</span></span>
                </li>
                <li className="flex items-center gap-3">
                  <Folder className="w-5 h-5 text-yellow-500" />
                  <span><strong className="text-foreground">Movie (HD):</strong> <span className="text-muted-foreground">1-4 GB</span></span>
                </li>
              </ul>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <span className="text-xl">💾</span>
                Storage Capacity
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <Usb className="w-5 h-5 text-blue-500" />
                  <span><strong className="text-foreground">USB Flash Drive:</strong> <span className="text-muted-foreground">8-128 GB</span></span>
                </li>
                <li className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-purple-500" />
                  <span><strong className="text-foreground">DVD:</strong> <span className="text-muted-foreground">4.7 GB</span></span>
                </li>
                <li className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-indigo-500" />
                  <span><strong className="text-foreground">Blu-ray:</strong> <span className="text-muted-foreground">25-50 GB</span></span>
                </li>
                <li className="flex items-center gap-3">
                  <HardDrive className="w-5 h-5 text-cyan-500" />
                  <span><strong className="text-foreground">Laptop SSD:</strong> <span className="text-muted-foreground">256 GB - 2 TB</span></span>
                </li>
                <li className="flex items-center gap-3">
                  <HardDrive className="w-5 h-5 text-gray-500" />
                  <span><strong className="text-foreground">External HDD:</strong> <span className="text-muted-foreground">1-8 TB</span></span>
                </li>
                <li className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-sky-500" />
                  <span><strong className="text-foreground">Cloud Storage:</strong> <span className="text-muted-foreground">5 GB - Unlimited</span></span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Binary vs Decimal */}
      <section className="container mx-auto px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
            <h2 className="text-xl font-bold mb-4">Binary vs Decimal Units</h2>
            <p className="text-muted-foreground mb-6">
              This calculator uses binary units (1024-based) which are standard in computing:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-background/50 p-4 rounded-xl">
                <h4 className="font-semibold mb-3 text-foreground">Binary (Computing)</h4>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li className="flex justify-between"><span>1 KB</span><span className="font-mono">1,024 bytes</span></li>
                  <li className="flex justify-between"><span>1 MB</span><span className="font-mono">1,024 KB</span></li>
                  <li className="flex justify-between"><span>1 GB</span><span className="font-mono">1,024 MB</span></li>
                  <li className="flex justify-between"><span>1 TB</span><span className="font-mono">1,024 GB</span></li>
                </ul>
              </div>
              <div className="bg-background/50 p-4 rounded-xl">
                <h4 className="font-semibold mb-3 text-foreground">Decimal (Marketing)</h4>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li className="flex justify-between"><span>1 KB</span><span className="font-mono">1,000 bytes</span></li>
                  <li className="flex justify-between"><span>1 MB</span><span className="font-mono">1,000 KB</span></li>
                  <li className="flex justify-between"><span>1 GB</span><span className="font-mono">1,000 MB</span></li>
                  <li className="flex justify-between"><span>1 TB</span><span className="font-mono">1,000 GB</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-[length:200%_100%] animate-gradient p-8 md:p-12">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }} />
            </div>
            
            <div className="relative flex flex-col md:flex-row items-center gap-6 text-white">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <Folder className="w-8 h-8" />
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  Need to Transfer Large Files?
                </h2>
                <p className="text-white/80 text-lg">
                  Use our secure file sharing service to send files of any size without worrying 
                  about email attachment limits or cloud storage restrictions.
                </p>
              </div>
              
              <Link href="/app">
                <Button 
                  size="lg" 
                  className="bg-white text-purple-600 hover:bg-white/90 font-semibold shadow-xl"
                >
                  Start File Transfer
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