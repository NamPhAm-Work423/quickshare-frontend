import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface TextPreviewProps {
  text: string;
}

export function TextPreview({ text }: TextPreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Text Content
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border bg-muted/50 p-4">
          <pre className="whitespace-pre-wrap break-words font-mono text-sm">
            {text}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}

