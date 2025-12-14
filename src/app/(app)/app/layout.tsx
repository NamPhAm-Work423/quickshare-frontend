import { ThemeProvider } from '@/components/shared';
import { Toaster } from '@/components/ui/toaster';
import { WormholeBackground } from '@/components/shared';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="file-transfer-theme">
      <div className="relative min-h-screen overflow-hidden">
        <WormholeBackground />
        <div className="relative z-10">
          {children}
          <Toaster />
        </div>
      </div>
    </ThemeProvider>
  );
}
