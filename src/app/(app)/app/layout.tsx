import { Toaster } from '@/components/ui/toaster';
import { WormholeBackground } from '@/components/shared';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <WormholeBackground />
      <div className="relative z-10">
        {children}
        <Toaster />
      </div>
    </div>
  );
}
