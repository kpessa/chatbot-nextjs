import * as React from "react";
import { useToast as useShadcnToast } from "@/components/ui/use-toast";

interface UseToastOptions {
  duration?: number;
}

/**
 * Custom hook for managing toast notifications
 * Wraps ShadcnUI's useToast hook with common notification patterns
 */
export const useToast = (options: UseToastOptions = {}) => {
  const { toast } = useShadcnToast();
  const { duration = 3000 } = options;

  const showSuccess = React.useCallback(
    (message: string) => {
      toast({
        title: "Success",
        description: message,
        duration,
        variant: "default",
      });
    },
    [toast, duration]
  );

  const showError = React.useCallback(
    (message: string) => {
      toast({
        title: "Error",
        description: message,
        duration,
        variant: "destructive",
      });
    },
    [toast, duration]
  );

  const showWarning = React.useCallback(
    (message: string) => {
      toast({
        title: "Warning",
        description: message,
        duration,
        variant: "default",
        className: "bg-yellow-100 dark:bg-yellow-900",
      });
    },
    [toast, duration]
  );

  const showInfo = React.useCallback(
    (message: string) => {
      toast({
        description: message,
        duration,
        variant: "default",
      });
    },
    [toast, duration]
  );

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}; 