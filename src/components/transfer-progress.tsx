'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader } from '@/components/loader';
import { FileText, CheckCircle2, XCircle } from 'lucide-react';

interface TransferProgressProps {
  progress: number;
  status: 'connecting' | 'transferring' | 'completed' | 'error';
  fileName?: string;
  fileSize?: number;
  error?: string;
}

export function TransferProgress({
  progress,
  status,
  fileName,
  fileSize,
  error,
}: TransferProgressProps) {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center gap-3">
          {status === 'connecting' && <Loader className="h-5 w-5" />}
          {status === 'transferring' && <FileText className="h-5 w-5 text-primary" />}
          {status === 'completed' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
          {status === 'error' && <XCircle className="h-5 w-5 text-destructive" />}

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {status === 'connecting' && 'Connecting to peer...'}
              {status === 'transferring' && (fileName || 'Transferring file...')}
              {status === 'completed' && 'Transfer completed!'}
              {status === 'error' && (error || 'Transfer failed')}
            </p>
            {status === 'transferring' && fileSize && (
              <p className="text-xs text-muted-foreground">
                {formatBytes((progress / 100) * fileSize)} / {formatBytes(fileSize)}
              </p>
            )}
          </div>
        </div>

        {status === 'transferring' && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-center text-muted-foreground">
              {Math.round(progress)}%
            </p>
          </div>
        )}

        {status === 'completed' && (
          <p className="text-sm text-muted-foreground">
            File has been successfully transferred via P2P connection.
          </p>
        )}

        {status === 'error' && error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </CardContent>
    </Card>
  );
}
