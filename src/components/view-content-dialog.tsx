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
import { Loader } from '@/components/loader';
import { TextPreview } from '@/components/text-preview';
import { downloadByCode } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Download, Search } from 'lucide-react';

interface ViewContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewContentDialog({ open, onOpenChange }: ViewContentDialogProps) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contentType, setContentType] = useState<'file' | 'text' | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [textContent, setTextContent] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      // Reset state when dialog opens
      setCode('');
      setContentType(null);
      setDownloadUrl(null);
      setTextContent(null);
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

  const handleSearch = async () => {
    if (code.length !== 6) {
      toast({
        title: 'Mã không hợp lệ',
        description: 'Vui lòng nhập đúng 6 chữ số',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      setContentType(null);
      setDownloadUrl(null);
      setTextContent(null);

      const response = await downloadByCode(code);

      if (response.type === 'file' && response.url) {
        setContentType('file');
        setDownloadUrl(response.url);
        toast({
          title: 'Tìm thấy file',
          description: 'Bạn có thể tải xuống file',
        });
      } else if (response.type === 'text' && response.content) {
        setContentType('text');
        setTextContent(response.content);
        toast({
          title: 'Tìm thấy nội dung',
          description: 'Nội dung văn bản đã được hiển thị',
        });
      } else {
        throw new Error('Phản hồi không hợp lệ từ server');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không tìm thấy nội dung';
      
      let toastMessage = errorMessage;
      if (errorMessage.toLowerCase().includes('expired')) {
        toastMessage = 'Mã này đã hết hạn';
      } else if (errorMessage.toLowerCase().includes('invalid')) {
        toastMessage = 'Mã không hợp lệ hoặc không tồn tại';
      } else if (errorMessage.toLowerCase().includes('attempt')) {
        toastMessage = 'Quá nhiều lần thử. Vui lòng thử lại sau.';
      }

      toast({
        title: 'Lỗi',
        description: toastMessage,
        variant: 'destructive',
      });
      setContentType(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tìm nội dung đã share</DialogTitle>
          <DialogDescription>
            Nhập mã 6 số để xem nội dung đã được chia sẻ
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
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
                  handleSearch();
                }
              }}
            />
            <Button
              onClick={handleSearch}
              disabled={code.length !== 6 || isLoading}
              size="lg"
            >
              {isLoading ? (
                <Loader className="h-4 w-4" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader className="h-8 w-8" />
              <span className="ml-2 text-sm text-muted-foreground">
                Đang tìm kiếm...
              </span>
            </div>
          )}

          {contentType === 'file' && downloadUrl && (
            <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5 text-primary" />
                <span className="font-medium">File đã được tìm thấy</span>
              </div>
              <Button onClick={handleDownload} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Tải xuống file
              </Button>
            </div>
          )}

          {contentType === 'text' && textContent && (
            <div className="space-y-2">
              <TextPreview text={textContent} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

