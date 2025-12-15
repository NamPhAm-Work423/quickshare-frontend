'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Loader from './Loader';
import { TextPreview } from './TextPreview';
import { startP2PReceive } from '@/lib/p2p-upload';
import { useToast } from '@/hooks/use-toast';
import { Download, Search, Copy, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ViewContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type TransferStatus = 'idle' | 'connecting' | 'transferring' | 'completed' | 'error';

const ViewContentDialog = ({ open, onOpenChange }: ViewContentDialogProps) => {
  const [code, setCode] = useState('');
  const [transferStatus, setTransferStatus] = useState<TransferStatus>('idle');
  const [transferProgress, setTransferProgress] = useState(0);
  const [receivedFiles, setReceivedFiles] = useState<File[]>([]);
  const [receivedText, setReceivedText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      // Reset state when dialog opens
      setCode('');
      setTransferStatus('idle');
      setTransferProgress(0);
      setReceivedFiles([]);
      setReceivedText(null);
      setError(null);
      // Focus input after a short delay
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
  };

  const handleReceive = async () => {
    if (code.length !== 6) {
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
        code,
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
            description: 'All files received successfully',
          });
        },
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unable to receive content';
      setError(errorMessage);
      setTransferStatus('error');

      // Log & show friendly error messages
      let toastMessage = errorMessage;
      if (errorMessage.toLowerCase().includes('expired') || errorMessage.toLowerCase().includes('not found')) {
        toastMessage = 'Code not found or expired';
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
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const isLoading = transferStatus === 'connecting' || transferStatus === 'transferring';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] border border-white/10 bg-background/95 shadow-2xl backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle>Receive Shared Content</DialogTitle>
          <DialogDescription>
            Enter the 6-digit code to receive files or text via P2P connection
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
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
                onClick={handleReceive}
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewContentDialog;