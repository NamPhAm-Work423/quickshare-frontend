'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/loader';
import { TextPreview } from '@/components/text-preview';
import { useAppStore } from '@/store/upload-store';
import { useToast } from '@/hooks/use-toast';
import { Download, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { startP2PReceive } from '@/lib/p2p-upload';
import { TransferProgress } from '@/components/transfer-progress';

export default function ReceivePage() {
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transferStatus, setTransferStatus] = useState<'idle' | 'connecting' | 'transferring' | 'completed' | 'error'>('idle');
  const [transferProgress, setTransferProgress] = useState(0);
  const [receivedFile, setReceivedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    e.preventDefault();
    
    if (code.length !== 6) {
      toast({
        title: 'Invalid code',
        description: 'Please enter a 6-digit code',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setTransferStatus('connecting');
      setError(null);
      setTransferProgress(0);

      await startP2PReceive({
        code,
        onFileReceived: (file) => {
          setReceivedFile(file);
          setTransferStatus('completed');
          toast({
            title: 'File received!',
            description: `Successfully received ${file.name}`,
          });
        },
        onProgress: (progress) => {
          setTransferProgress(progress);
          setTransferStatus('transferring');
        },
        onError: (errorMsg) => {
          setError(errorMsg);
          setTransferStatus('error');
        },
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Receive failed';
      setError(errorMessage);
      setTransferStatus('error');
      
      let toastMessage = errorMessage;
      if (errorMessage.toLowerCase().includes('expired')) {
        toastMessage = 'This code has expired';
      } else if (errorMessage.toLowerCase().includes('invalid')) {
        toastMessage = 'Invalid code. Please check and try again.';
      } else if (errorMessage.toLowerCase().includes('rate limit')) {
        toastMessage = 'Too many attempts. Please try again later.';
      }

      toast({
        title: 'Error',
        description: toastMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Get code from URL parameter if available
    const codeParam = searchParams.get('code');
    if (codeParam && codeParam.length === 6 && /^\d+$/.test(codeParam)) {
      setCode(codeParam);
      // Auto-submit if code is valid
      setTimeout(() => {
        handleSubmit();
      }, 100);
    } else {
      inputRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <main className="container mx-auto min-h-screen px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-2xl space-y-6 md:space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1 space-y-2 min-w-0">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Receive File</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Enter the 6-digit code to download your file or view text
            </p>
          </div>
          <div className="shrink-0">
            <ThemeToggle />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Enter Code</CardTitle>
            <CardDescription>
              The code should be 6 digits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  disabled={isSubmitting || transferStatus === 'transferring' || transferStatus === 'connecting'}
                />
                <Button
                  type="submit"
                  disabled={code.length !== 6 || isSubmitting || transferStatus === 'transferring' || transferStatus === 'connecting'}
                  size="lg"
                >
                  {isSubmitting || transferStatus === 'transferring' ? (
                    <>
                      <Loader className="mr-2" />
                      {transferStatus === 'connecting' ? 'Connecting...' : 'Receiving...'}
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Receive
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {(transferStatus === 'connecting' || transferStatus === 'transferring') && (
          <TransferProgress
            progress={transferProgress}
            status={transferStatus}
            fileName={receivedFile?.name}
            fileSize={receivedFile?.size}
          />
        )}

        {error && transferStatus === 'error' && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
                <p className="text-sm font-medium text-destructive">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {transferStatus === 'completed' && receivedFile && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  File received successfully via P2P connection!
                </p>
                <Button
                  onClick={() => {
                    const url = URL.createObjectURL(receivedFile);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = receivedFile.name;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download {receivedFile.name}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}

