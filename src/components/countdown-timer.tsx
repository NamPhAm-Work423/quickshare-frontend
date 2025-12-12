'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  expirationTime: Date | null;
  onExpire?: () => void;
}

export function CountdownTimer({ expirationTime, onExpire }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!expirationTime) {
      setTimeLeft('');
      return;
    }

    const updateTimer = () => {
      const now = new Date().getTime();
      const expiration = new Date(expirationTime).getTime();
      const difference = expiration - now;

      if (difference <= 0) {
        setTimeLeft('Expired');
        onExpire?.();
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      } else if (minutes > 0) {
        setTimeLeft(`${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(`${seconds}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [expirationTime, onExpire]);

  if (!expirationTime || !timeLeft) {
    return null;
  }

  return (
    <Badge variant="secondary" className="gap-2">
      <Clock className="h-3 w-3" />
      <span>Expires in: {timeLeft}</span>
    </Badge>
  );
}

