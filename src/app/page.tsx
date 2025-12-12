'use client';

import { useEffect, useState } from 'react';
import { UploadBox } from '@/components/upload-box';
import { CodeDisplay } from '@/components/code-display';
import { FilePreview } from '@/components/file-preview';
import { CountdownTimer } from '@/components/countdown-timer';
import { ViewContentDialog } from '@/components/view-content-dialog';
import { Loader } from '@/components/loader';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/upload-store';
import { useToast } from '@/hooks/use-toast';
import { startP2PUpload } from '@/lib/p2p-upload';
import { createSession } from '@/lib/api';
import { TransferProgress } from '@/components/transfer-progress';
import { ArrowUp, Search, FileText } from 'lucide-react';

export default function UploadPage() {
  const {
    upload,
    setUploading,
    setUploadProgress,
    setCode,
    setExpirationTime,
    setUploadError,
    resetUpload,
    setSession,
    setConnected,
    setTransferProgress,
  } = useAppStore();
  const { file, text, isUploading, uploadProgress, code, expirationTime, error, transferProgress: storeTransferProgress, isConnected } = upload;
  const { toast } = useToast();
  const [showViewDialog, setShowViewDialog] = useState(false);
  // Store all selected files locally to display all of them, not just the first one
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [transferStatus, setTransferStatus] = useState<'idle' | 'connecting' | 'transferring' | 'completed' | 'error'>('idle');

  const handleUpload = async (uploadFiles?: File[], uploadTextParam?: string | null) => {
    // Use files from parameter if provided, otherwise use files from store
    // IMPORTANT: Always prioritize uploadFiles parameter over store's file
    // This ensures all selected files are uploaded, not just the first one
    const filesToUpload = uploadFiles && uploadFiles.length > 0 ? uploadFiles : (file ? [file] : []);
    // Only use text if no files are selected (files have priority)
    const textToUpload = filesToUpload.length === 0 ? (uploadTextParam || text) : null;

    // Store all files in local state for display
    if (filesToUpload.length > 0) {
      setSelectedFiles(filesToUpload);
    }

    if (filesToUpload.length === 0 && !textToUpload) {
      toast({
        title: 'No content',
        description: 'Please select a file or paste text',
        variant: 'destructive',
      });
      return;
    }

    try {
      setUploading(true);
      setUploadError(null);
      setUploadProgress(0);
      setTransferStatus('connecting');

      if (filesToUpload.length > 0) {
        // For now, handle single file P2P upload
        // TODO: Support multiple files (create multiple sessions)
        const fileToUpload = filesToUpload[0];
        useAppStore.getState().setFile(fileToUpload);

        // Create session first to get code
        const sessionResponse = await createSession({
          single_use: true,
          metadata: {
            file_name: fileToUpload.name,
            file_size: fileToUpload.size,
            file_type: fileToUpload.type,
          },
        });

        setCode(sessionResponse.code);
        setExpirationTime(new Date(Date.now() + 10 * 60 * 1000)); // 10 minutes default

        // Convert ICE servers
        const iceServers: RTCConfiguration = {
          iceServers: sessionResponse.ice_servers.ice_servers.map((server) => ({
            urls: server.urls,
            username: server.username,
            credential: server.credential,
          })),
        };

        setSession(
          sessionResponse.session_id,
          crypto.randomUUID(),
          sessionResponse.ws_url,
          iceServers
        );

        // Start P2P upload
        setTransferStatus('transferring');
        await startP2PUpload({
          file: fileToUpload,
          onProgress: (progress) => {
            setTransferProgress(progress);
            setUploadProgress(progress);
          },
          onComplete: () => {
            setTransferStatus('completed');
            setUploadProgress(100);
            toast({
              title: 'Upload successful!',
              description: 'File sent via P2P connection',
            });
          },
          onError: (errorMsg) => {
            setTransferStatus('error');
            setUploadError(errorMsg);
            toast({
              title: 'Upload failed',
              description: errorMsg,
              variant: 'destructive',
            });
          },
        });
      } else if (textToUpload) {
        // Text sharing - create session but note: P2P is for files
        // For text, we could still use P2P by converting to blob
        const textBlob = new Blob([textToUpload], { type: 'text/plain' });
        const textFile = new File([textBlob], 'text.txt', { type: 'text/plain' });

        const sessionResponse = await createSession({
          single_use: true,
          metadata: {
            file_name: 'text.txt',
            file_size: textBlob.size,
            file_type: 'text/plain',
          },
        });

        setCode(sessionResponse.code);
        setExpirationTime(new Date(Date.now() + 10 * 60 * 1000));

        const iceServers: RTCConfiguration = {
          iceServers: sessionResponse.ice_servers.ice_servers.map((server) => ({
            urls: server.urls,
            username: server.username,
            credential: server.credential,
          })),
        };

        setSession(
          sessionResponse.session_id,
          crypto.randomUUID(),
          sessionResponse.ws_url,
          iceServers
        );

        setTransferStatus('transferring');
        await startP2PUpload({
          file: textFile,
          onProgress: (progress) => {
            setTransferProgress(progress);
            setUploadProgress(progress);
          },
          onComplete: () => {
            setTransferStatus('completed');
            setUploadProgress(100);
            toast({
              title: 'Upload successful!',
              description: 'Text sent via P2P connection',
            });
          },
          onError: (errorMsg) => {
            setTransferStatus('error');
            setUploadError(errorMsg);
            toast({
              title: 'Upload failed',
              description: errorMsg,
              variant: 'destructive',
            });
          },
        });
      } else {
        throw new Error('No content to upload');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setUploadError(errorMessage);
      setTransferStatus('error');
      setUploading(false); // Ensure uploading state is reset on error
      setUploadProgress(0);
      toast({
        title: 'Upload failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Only reset on unmount, not on every render
  useEffect(() => {
    return () => {
      // Only reset when component actually unmounts (navigate away)
      resetUpload();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run cleanup on unmount

  return (
    <main className="container mx-auto min-h-screen px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-3xl space-y-6 md:space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Quickshare</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Upload files or share notes with a simple 6-digit code
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => setShowViewDialog(true)}
            className="gap-2 w-full sm:w-auto"
          >
            <Search className="h-4 w-4" />
            Tìm nội dung đã share
          </Button>
        </div>

        <UploadBox onUpload={handleUpload} isUploading={isUploading} />

        <ViewContentDialog
          open={showViewDialog}
          onOpenChange={setShowViewDialog}
        />

        {((selectedFiles.length > 0 || file || text) && !code) && (
          <div className="space-y-4">
            {/* Display all selected files */}
            {selectedFiles.length > 0 ? (
              <div className="space-y-2">
                {selectedFiles.map((f, index) => (
                  <FilePreview key={`${f.name}-${index}`} file={f} />
                ))}
              </div>
            ) : file ? (
              <FilePreview file={file} />
            ) : null}
            {(transferStatus === 'connecting' || transferStatus === 'transferring') && (
              <TransferProgress
                progress={storeTransferProgress || uploadProgress}
                status={transferStatus}
                fileName={file?.name || selectedFiles[0]?.name}
                fileSize={file?.size || selectedFiles[0]?.size}
              />
            )}
            {isUploading && transferStatus === 'idle' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Đang tải lên...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}
            {error && (
              <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
          </div>
        )}

        {code && (
          <div className="space-y-4">
            {/* Hiển thị preview file/text đã upload */}
            {selectedFiles.length > 0 ? (
              <div className="space-y-2">
                {selectedFiles.map((f, index) => (
                  <FilePreview key={`${f.name}-${index}`} file={f} />
                ))}
              </div>
            ) : file ? (
              <FilePreview file={file} />
            ) : null}
            {text && selectedFiles.length === 0 && !file && (
              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Nội dung văn bản đã upload</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {text.substring(0, 200)}
                  {text.length > 200 && '...'}
                </p>
              </div>
            )}
            
            <CodeDisplay code={code} />
            {expirationTime && (
              <div className="flex justify-center">
                <CountdownTimer expirationTime={expirationTime} />
              </div>
            )}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                resetUpload();
                setSelectedFiles([]);
                toast({
                  title: 'Reset',
                  description: 'Ready for a new upload',
                });
              }}
            >
              Upload Another File
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
