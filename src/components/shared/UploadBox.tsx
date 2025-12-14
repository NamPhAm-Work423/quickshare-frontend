'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, Key } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import FilePreview from './FilePreview';
import Loader from './Loader';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/upload-store';

interface UploadBoxProps {
  onUpload?: (files?: File[], text?: string | null) => void;
  isUploading?: boolean;
}

const UploadBox = ({ onUpload, isUploading = false }: UploadBoxProps) => {
  // Store files in local state to avoid Zustand serialization issues
  const [localFiles, setLocalFiles] = useState<File[]>([]);
  const upload = useAppStore((state) => state.upload);
  const text = upload.text;
  const setFile = useAppStore((state) => state.setFile);
  const setText = useAppStore((state) => state.setText);
  const [textInput, setTextInput] = useState('');
  const pasteHandlerRef = useRef<(e: ClipboardEvent) => void>();

  // Use first file for store compatibility (single file upload to backend)
  const file = localFiles.length > 0 ? localFiles[0] : null;

  // Clear files and text when upload is successful (code is generated)
  // Only clear if we're not currently uploading (to avoid clearing during upload)
  useEffect(() => {
    if (upload.code && !isUploading && (localFiles.length > 0 || textInput.trim().length > 0)) {
      // Upload successful, clear the form
      setLocalFiles([]);
      setTextInput('');
      setFile(null);
      setText(null);
    }
  }, [upload.code, isUploading, localFiles.length, textInput, setFile, setText]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        // Add files to local state (store sync handled by effect)
        setLocalFiles((prev) => [...prev, ...acceptedFiles]);
        setText(null);
        setTextInput(''); // Clear text input when files are selected
      }
    },
    [setText]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true, // Allow multiple files
    noClick: false, // Allow clicking to select files
    noKeyboard: false, // Allow keyboard navigation
  });

  // Sync textInput with text from store on mount
  useEffect(() => {
    if (text && text !== textInput) {
      setTextInput(text);
    }
  }, []); // Only run on mount

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const clipboardData = e.clipboardData;
      if (!clipboardData) return;

      const items = Array.from(clipboardData.items);
      const textItem = items.find((item) => item.type === 'text/plain');

      if (textItem) {
        textItem.getAsString((textContent) => {
          if (textContent.trim().length > 0) {
            setTextInput(textContent);
            setText(textContent);
            // Clear files when pasting text
            setLocalFiles([]);
            setFile(null);
          }
        });
      }
    };

    pasteHandlerRef.current = handlePaste;
    document.addEventListener('paste', handlePaste);

    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [setText, setFile]);

  const handleClear = () => {
    setLocalFiles([]);
    setFile(null);
    setText(null);
    setTextInput('');
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setLocalFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleTextInputChange = (value: string) => {
    setTextInput(value);
    // Always sync to store, even if empty (to allow clearing)
    setText(value.trim().length > 0 ? value : null);
    // Don't clear files when typing - only clear when pasting or uploading
  };

  // Keep store in sync with first local file (runs after render)
  useEffect(() => {
    setFile(file);
    if (localFiles.length > 0) {
      setText(null);
    }
  }, [file, localFiles.length, setFile, setText]);

  // Check if there's content to upload (file or non-empty text)
  // Use textInput for immediate feedback, fallback to text from store
  const hasTextContent = Boolean(textInput.trim().length > 0 || (text && text.trim().length > 0));
  const hasContent = Boolean(localFiles.length > 0 || hasTextContent);
  // Ensure isUploading is properly checked - if it's undefined, treat as false
  const isCurrentlyUploading = isUploading === true;
  const canUpload = hasContent && !isCurrentlyUploading;

  return (
    <Card className="overflow-hidden border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
      <CardContent className="p-4 md:p-6 space-y-4 bg-gradient-to-b from-white/5 via-white/0 to-white/5">
        {/* Text area */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Enter text</label>
          <Textarea
            placeholder="Enter or paste your text here..."
            value={textInput}
            onChange={(e) => handleTextInputChange(e.target.value)}
            className="min-h-[150px] md:min-h-[200px] resize-none border-white/20 bg-white/10 text-foreground shadow-inner backdrop-blur-md focus-visible:ring-primary/70"
          />
          <p className="text-xs text-muted-foreground">
            {textInput.length} characters
          </p>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/20" />
          </div>
        </div>

        {/* File upload area */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Choose file</label>
          <div
            {...getRootProps()}
            className={cn(
              'flex cursor-pointer items-center justify-center gap-3 rounded-lg border-2 border-dashed p-4 transition-colors bg-gradient-to-br from-white/5 via-white/0 to-white/5 backdrop-blur-md shadow-lg',
              isDragActive
                ? 'border-primary bg-primary/10 shadow-primary/30'
                : 'border-white/20 hover:border-primary/60',
              isCurrentlyUploading && 'opacity-50 cursor-not-allowed'
            )}
            style={{ pointerEvents: isCurrentlyUploading ? 'none' : 'auto' }}
          >
            <input {...getInputProps()} disabled={isCurrentlyUploading} />
            <Upload className="h-5 w-5 text-muted-foreground shrink-0" />
            <div className="text-center flex-1 min-w-0">
              <p className="text-sm font-medium truncate px-2">
                {isDragActive
                  ? 'Drop file here'
                  : localFiles.length > 0
                    ? `${localFiles.length} file${localFiles.length > 1 ? 's' : ''} selected`
                    : 'Drag and drop file or click to select'}
              </p>
              {localFiles.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Total: {(localFiles.reduce((sum, f) => sum + f.size, 0) / 1024).toFixed(2)} KB
                </p>
              )}
            </div>
            {localFiles.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="h-6 w-6 shrink-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Preview selected files/text */}
        {localFiles.length > 0 && (
          <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
            {localFiles.map((f, index) => (
              <div key={`${f.name}-${index}`} className="relative">
                <FilePreview file={f} />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveFile(index)}
                  className="absolute top-2 right-2 h-6 w-6 bg-background/80 backdrop-blur-sm"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
        {(hasTextContent || textInput.trim().length > 0) && localFiles.length === 0 && (
          <div className="mt-2 rounded-lg border bg-muted/50 p-3 md:p-4 overflow-hidden">
            <div className="flex items-center justify-between mb-2 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm font-medium truncate">Text entered</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClear}
                className="h-6 w-6 shrink-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <div className="max-h-32 overflow-y-auto">
              <p className="text-sm text-muted-foreground break-words whitespace-pre-wrap">
                {text || textInput}
              </p>
            </div>
          </div>
        )}

        {/* Create transfer code button */}
        <Button
          onClick={() => {
            if (onUpload && canUpload && !isCurrentlyUploading) {
              // Upload all files - ensure we pass the full array, not just the first file
              // Create a new array to ensure we're passing all files, not a reference that might be stale
              const filesToUpload = localFiles.length > 0 ? [...localFiles] : undefined;
              const textToUpload = text || (textInput.trim().length > 0 ? textInput : null);
              onUpload(filesToUpload, textToUpload);
            }
          }}
          className="w-full"
          size="lg"
          disabled={!canUpload || isCurrentlyUploading}
        >
          {isUploading ? (
            <>
              <Loader className="mr-2 h-4 w-4" />
              Uploading...
            </>
          ) : (
            <>
              <Key className="mr-2 h-4 w-4" />
              {hasContent ? 'Create Transfer Code' : 'Please enter text or select file'}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default UploadBox;