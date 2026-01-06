'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Loader from '@/components/shared/Loader';
import { startP2PReceive } from '@/lib/p2p-upload';
import { useToast } from '@/hooks/use-toast';
import { Download, Copy, AlertCircle, ArrowLeft } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

type TransferStatus = 'idle' | 'connecting' | 'transferring' | 'completed' | 'error';

function ReceiveContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get('code') || '';
  
  const [code, setCode] = useState(initialCode);
  const [transferStatus, setTransferStatus] = useState<TransferStatus>('idle');
  const [transferProgress, setTransferProgress] = useState(0);
  const [receivedFiles, setReceivedFiles] = useState<File[]>([]);
  const [receivedText, setReceivedText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasAutoStarted, setHasAutoStarted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Auto-start receive if valid code from URL
  useEffect(() => {
    if (initialCode.length === 6 && !hasAutoStarted) {
      setHasAutoStarted(true);
      handleReceive(initialCode);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCode, hasAutoStarted]);

  // Focus input when no auto-start
  useEffect(() => {
    if (!initialCode || initialCode.length !== 6) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [initialCode]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
  };

  const handleReceive = async (codeToUse?: string) => {
    const receiveCode = codeToUse || code;
    
    if (receiveCode.length !== 6) {
      toast({
        title: 'Invalid code',
        description: 'Please enter exactly 6 digits',
        variant: 'destructive',
      });
      return;
    }

    try {
      setTransferStatus('connecting');
      setError(null);
      setTransferProgress(0);
      setReceivedFiles([]);
      setReceivedText(null);

      await startP2PReceive({
        code: receiveCode,
        onFileReceived: async (file) => {
          // Check if it's text content
          if (file.type === 'text/plain' && file.name === 'text.txt') {
            const textContent = await file.text();
            setReceivedText(textContent);
            toast({
              title: 'Received!',
              description: 'Text content received',
            });
          } else {
            // Accumulate files for multi-file transfer
            setReceivedFiles(prev => [...prev, file]);
            toast({
              title: 'File received!',
              description: `${file.name} received`,
            });
          }
        },
        onProgress: (progress) => {
          setTransferProgress(progress);
          setTransferStatus('transferring');
        },
        onError: (errorMsg) => {
          setError(errorMsg);
          setTransferStatus('error');
        },
        onAllFilesComplete: () => {
          setTransferStatus('completed');
          toast({
            title: 'Transfer complete!',
            description: 'All content received successfully',
          });
        },
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unable to receive content';
      setError(errorMessage);
      setTransferStatus('error');

      // Log & show friendly error messages
      let toastMessage = errorMessage;
      if (errorMessage.toLowerCase().includes('không tìm thấy mã') || errorMessage.toLowerCase().includes('not found')) {
        toastMessage = 'Không tìm thấy mã. Vui lòng kiểm tra lại mã 6 số.';
      } else if (errorMessage.toLowerCase().includes('expired') || errorMessage.toLowerCase().includes('hết hạn')) {
        toastMessage = 'Mã đã hết hạn. Vui lòng yêu cầu mã mới.';
      } else if (errorMessage.toLowerCase().includes('invalid')) {
        toastMessage = 'Invalid code. Please check and try again.';
      } else if (errorMessage.toLowerCase().includes('rate limit')) {
        toastMessage = 'Too many attempts. Please wait a moment.';
      }

      toast({
        title: 'Error',
        description: toastMessage,
        variant: 'destructive',
      });
    }
  };

  const handleDownload = (file: File) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    receivedFiles.forEach(file => handleDownload(file));
  };

  const handleCopyText = () => {
    if (receivedText) {
      navigator.clipboard.writeText(receivedText);
      toast({
        title: 'Copied!',
        description: 'Text copied to clipboard',
      });
    }
  };

  const handleReset = () => {
    setCode('');
    setTransferStatus('idle');
    setTransferProgress(0);
    setReceivedFiles([]);
    setReceivedText(null);
    setError(null);
    setHasAutoStarted(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const isLoading = transferStatus === 'connecting' || transferStatus === 'transferring';

  return (
    <main className="container mx-auto min-h-screen px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-lg space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/app">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Receive Content</h1>
            <p className="text-sm text-muted-foreground">
              Enter the 6-digit code to receive files or text
            </p>
          </div>
        </div>

        <Card className="border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
          <CardHeader>
            <CardTitle>Transfer Code</CardTitle>
            <CardDescription>Enter the code shared by the sender</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Code input - show when idle or error */}
            {(transferStatus === 'idle' || transferStatus === 'error') && (
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={code}
                  onChange={handleCodeChange}
                  placeholder="000000"
                  className="text-center text-2xl font-mono tracking-widest"
                  maxLength={6}
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && code.length === 6) {
                      handleReceive();
                    }
                  }}
                />
                <Button
                  onClick={() => handleReceive()}
                  disabled={code.length !== 6 || isLoading}
                  size="lg"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Error display */}
            {transferStatus === 'error' && error && (
              <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <p className="text-sm font-medium text-destructive">{error}</p>
                </div>
              </div>
            )}

            {/* Connecting status */}
            {transferStatus === 'connecting' && (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <Loader className="h-8 w-8" />
                <span className="text-sm text-muted-foreground">
                  Connecting P2P with sender...
                </span>
              </div>
            )}

            {/* Transfer progress */}
            {transferStatus === 'transferring' && (
              <div className="space-y-4 py-4">
                <div className="flex items-center justify-center">
                  <Loader className="h-6 w-6 mr-2" />
                  <span className="text-sm text-muted-foreground">
                    Receiving data...
                  </span>
                </div>
                <Progress value={transferProgress} className="h-2" />
                <p className="text-center text-sm text-muted-foreground">
                  {Math.round(transferProgress)}%
                </p>
              </div>
            )}

            {/* Received files */}
            {transferStatus === 'completed' && receivedFiles.length > 0 && (
              <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
                <div className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-primary" />
                  <span className="font-medium">
                    {receivedFiles.length === 1 
                      ? `Received: ${receivedFiles[0].name}`
                      : `Received ${receivedFiles.length} files`
                    }
                  </span>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {receivedFiles.map((file, index) => (
                    <div key={`${file.name}-${index}`} className="flex items-center justify-between text-sm bg-background/50 p-2 rounded">
                      <span className="truncate flex-1">{file.name}</span>
                      <span className="text-muted-foreground ml-2">
                        {(file.size / 1024).toFixed(1)} KB
                      </span>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleDownload(file)}
                        className="ml-2"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleDownloadAll} className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Download {receivedFiles.length === 1 ? '' : 'All'}
                  </Button>
                  <Button variant="outline" onClick={handleReset}>
                    Receive More
                  </Button>
                </div>
              </div>
            )}

            {/* Received text */}
            {transferStatus === 'completed' && receivedText && (
              <div className="space-y-4">
                <div className="rounded-lg border bg-muted/50 p-4 max-h-64 overflow-y-auto">
                  <pre className="text-sm whitespace-pre-wrap break-words font-mono">
                    {receivedText}
                  </pre>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCopyText} className="flex-1">
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                  <Button variant="outline" onClick={handleReset}>
                    Receive More
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="rounded-lg border border-border/60 bg-background/60 p-4">
          <p className="text-sm text-muted-foreground text-center">
            Files are transferred directly between browsers via P2P connection.
          </p>
        </div>
      </div>
    </main>
  );
}

// Dynamic import to avoid SSR issues with useSearchParams
const DynamicReceiveContent = dynamic(() => Promise.resolve(ReceiveContent), {
  ssr: false,
  loading: () => (
    <main className="container mx-auto min-h-screen px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-lg flex items-center justify-center py-20">
        <Loader className="h-8 w-8" />
      </div>
    </main>
  )
});

export default function ReceivePage() {
  return <DynamicReceiveContent />;
}
