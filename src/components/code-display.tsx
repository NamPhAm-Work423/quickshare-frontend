'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CodeDisplayProps {
  code: string;
}

export function CodeDisplay({ code }: CodeDisplayProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast({
        title: 'Đã sao chép!',
        description: 'Mã đã được sao chép vào clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Sao chép thất bại',
        description: 'Vui lòng sao chép mã thủ công',
        variant: 'destructive',
      });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Mã chia sẻ file',
      text: `Mã để nhận file: ${code}`,
      url: typeof window !== 'undefined' ? `${window.location.origin}/receive?code=${code}` : '',
    };

    try {
      // Try Web Share API if available
      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: 'Đã chia sẻ',
          description: 'Mã đã được chia sẻ thành công',
        });
      } else {
        // Fallback: copy link to clipboard
        const shareUrl = typeof window !== 'undefined' 
          ? `${window.location.origin}/receive?code=${code}`
          : code;
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: 'Đã sao chép link',
          description: 'Link chia sẻ đã được sao chép vào clipboard',
        });
      }
    } catch (error) {
      // User cancelled or error occurred
      if ((error as Error).name !== 'AbortError') {
        // Fallback: copy code to clipboard
        await handleCopy();
      }
    }
  };

  return (
    <Card className="overflow-hidden border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
      <CardHeader>
        <CardTitle>Mã chuyển file của bạn</CardTitle>
        <CardDescription>Chia sẻ mã này với người nhận</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted p-3 md:p-4 overflow-hidden">
          <code className="text-xl md:text-2xl font-mono font-bold tracking-wider truncate">
            {code}
          </code>
          <div className="flex gap-2 shrink-0">
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              title="Sao chép mã"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleShare}
              title="Chia sẻ mã"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button
          onClick={handleShare}
          className="w-full"
          variant="default"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Chia sẻ mã
        </Button>
      </CardContent>
    </Card>
  );
}

