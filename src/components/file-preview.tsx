import { File, FileText, Image, Video, Music, Archive } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface FilePreviewProps {
  file: File;
  className?: string;
}

function getFileIcon(type: string) {
  if (type.startsWith('image/')) return Image;
  if (type.startsWith('video/')) return Video;
  if (type.startsWith('audio/')) return Music;
  if (type.includes('zip') || type.includes('rar') || type.includes('archive')) return Archive;
  return FileText;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

export function FilePreview({ file, className }: FilePreviewProps) {
  const Icon = getFileIcon(file.type);

  if (!file) {
    return null;
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="flex items-center gap-3 p-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="min-w-0 flex-1 overflow-hidden">
          <p className="truncate font-medium text-sm">{file.name}</p>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <Badge variant="outline" className="text-xs shrink-0">
              {formatFileSize(file.size)}
            </Badge>
            {file.type && (
              <Badge variant="outline" className="text-xs shrink-0">
                {file.type.split('/')[1]?.toUpperCase() || 'FILE'}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

