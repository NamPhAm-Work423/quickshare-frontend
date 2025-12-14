'use client';

import { useCallback } from 'react';
import { useToast } from './use-toast';
import { StandardError, normalizeError, ErrorLogger } from '@/lib/errors';

export const useErrorHandler = () => {
  const { toast } = useToast();

  const handleError = useCallback((error: any, context?: string) => {
    const standardError = normalizeError(error);
    
    // Log lỗi
    ErrorLogger.error(standardError, context);
    
    // Hiển thị toast notification
    toast({
      variant: 'destructive',
      title: 'Lỗi',
      description: standardError.userMessage,
      duration: 5000,
    });

    return standardError;
  }, [toast]);

  const handleSuccess = useCallback((message: string) => {
    toast({
      title: 'Thành công',
      description: message,
      duration: 3000,
    });
  }, [toast]);

  const handleWarning = useCallback((message: string) => {
    toast({
      variant: 'default',
      title: 'Cảnh báo',
      description: message,
      duration: 4000,
    });
  }, [toast]);

  return {
    handleError,
    handleSuccess,
    handleWarning,
  };
};
