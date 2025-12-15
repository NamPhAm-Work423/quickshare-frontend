
 'use client';
 
 import { useEffect, useState } from 'react';
 import { UploadBox, CodeDisplay, FilePreview, CountdownTimer, ViewContentDialog, TransferProgress } from '@/components/shared';
 import { Progress } from '@/components/ui/progress';
 import { Button } from '@/components/ui/button';
 import { useAppStore } from '@/store/upload-store';
 import { useErrorHandler } from '@/hooks/use-error-handler';
 import { startP2PUpload } from '@/lib/p2p-upload';
 import { createFileRequiredError, normalizeError } from '@/lib/errors';
 import { Search } from 'lucide-react';
 
 export default function AppPage() {
   const {
     upload,
     setUploading,
     setUploadProgress,
     setCode,
     setExpirationTime,
     setUploadError,
     resetUpload,
     setTransferProgress,
   } = useAppStore();
 
   const {
     file,
     text,
     isUploading,
     uploadProgress,
     code,
     expirationTime,
     error,
     transferProgress: storeTransferProgress,
   } = upload;
 
   const { handleError, handleSuccess } = useErrorHandler();
   const [showViewDialog, setShowViewDialog] = useState(false);
   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
   const [transferStatus, setTransferStatus] = useState<
     'idle' | 'connecting' | 'transferring' | 'completed' | 'error'
   >('idle');
 
   const handleUpload = async (uploadFiles?: File[], uploadTextParam?: string | null) => {
     const filesToUpload = uploadFiles && uploadFiles.length > 0 ? uploadFiles : (file ? [file] : []);
     const textToUpload = filesToUpload.length === 0 ? (uploadTextParam || text) : null;
 
     if (filesToUpload.length > 0) {
       setSelectedFiles(filesToUpload);
     }
 
     if (filesToUpload.length === 0 && !textToUpload) {
       handleError(createFileRequiredError(), 'upload');
       return;
     }
 
     try {
       setUploading(true);
       setUploadError(null);
       setUploadProgress(0);
       setTransferStatus('connecting');
 
       if (filesToUpload.length > 0) {
         const fileToUpload = filesToUpload[0];
         useAppStore.getState().setFile(fileToUpload);
 
         await startP2PUpload({
           files: [fileToUpload],
           onSessionCreated: (sessionInfo) => {
             setCode(sessionInfo.code);
             setExpirationTime(sessionInfo.expiresAt);
             setSelectedFiles([]);
           },
           onProgress: (progress) => {
             setTransferProgress(progress);
             setUploadProgress(progress);
             setTransferStatus('transferring');
           },
           onComplete: () => {
             setTransferStatus('completed');
             setUploadProgress(100);
             handleSuccess('Transfer started. Keep this tab open until the receiver finishes.');
           },
           onError: (errorMsg) => {
             setTransferStatus('error');
             setUploadError(errorMsg);
             handleError(errorMsg, 'p2p-upload');
           },
         });
       } else if (textToUpload) {
         const textBlob = new Blob([textToUpload], { type: 'text/plain' });
         const textFile = new File([textBlob], 'text.txt', { type: 'text/plain' });
 
         await startP2PUpload({
           files: [textFile],
           onSessionCreated: (sessionInfo) => {
             setCode(sessionInfo.code);
             setExpirationTime(sessionInfo.expiresAt);
             setSelectedFiles([]);
           },
           onProgress: (progress) => {
             setTransferProgress(progress);
             setUploadProgress(progress);
             setTransferStatus('transferring');
           },
           onComplete: () => {
             setTransferStatus('completed');
             setUploadProgress(100);
             handleSuccess('Transfer started. Keep this tab open until the receiver finishes.');
           },
           onError: (errorMsg) => {
             setTransferStatus('error');
             setUploadError(errorMsg);
             handleError(errorMsg, 'p2p-text-upload');
           },
         });
       } else {
         throw createFileRequiredError();
       }
     } catch (err) {
       const standardError = normalizeError(err);
       setUploadError(standardError.userMessage);
       setTransferStatus('error');
       setUploading(false);
       setUploadProgress(0);
       handleError(standardError, 'upload-process');
     } finally {
       setUploading(false);
     }
   };
 
   useEffect(() => {
     return () => {
       resetUpload();
     };
     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);
 
   return (
     <main className="container mx-auto min-h-screen px-4 py-6 md:px-6 md:py-8">
       <div className="mx-auto max-w-3xl space-y-6 md:space-y-8">
         <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
           <div className="text-center sm:text-left">
             <h1 className="text-3xl md:text-4xl font-bold tracking-tight">QuickShare</h1>
             <p className="text-sm md:text-base text-muted-foreground">
               P2P file sharing with a simple 6-digit code.
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
             Find a transfer
           </Button>
         </div>
 
         {!code && <UploadBox onUpload={handleUpload} isUploading={isUploading} />}
 
         <ViewContentDialog open={showViewDialog} onOpenChange={setShowViewDialog} />
 
         {((selectedFiles.length > 0 || file || text) && !code) && (
           <div className="space-y-4">
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
                   <span>Uploading...</span>
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
             <CodeDisplay code={code} />
 
             {expirationTime && (
               <div className="flex justify-center">
                 <CountdownTimer expirationTime={expirationTime} />
               </div>
             )}
 
             {(transferStatus === 'connecting' || transferStatus === 'transferring') && (
               <TransferProgress
                 progress={storeTransferProgress}
                 status={transferStatus}
                 fileName={file?.name}
                 fileSize={file?.size}
               />
             )}
 
             <div className="rounded-lg border border-border/60 bg-background/60 p-4">
               <p className="text-sm text-muted-foreground">
                 Privacy notice: files are transferred directly between browsers. Our server is used for signaling only.
               </p>
             </div>
 
             <Button
               variant="outline"
               className="w-full"
               onClick={() => {
                 resetUpload();
                 setSelectedFiles([]);
                 setTransferStatus('idle');
               }}
             >
               Start a new transfer
             </Button>
           </div>
         )}
       </div>
     </main>
   );
 }

