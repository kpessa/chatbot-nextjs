import * as React from "react";
import { toast } from "sonner";

interface UseToastOptions {
  duration?: number;
}

/**
 * Custom hook for managing toast notifications
 * Wraps sonner's toast function with common notification patterns
 */
export const useToast = (options: UseToastOptions = {}) => {
  const { duration = 3000 } = options;

  const showSuccess = React.useCallback(
    (message: string) => {
      toast.success(message, {
        duration,
      });
    },
    [duration]
  );

  const showError = React.useCallback(
    (message: string) => {
      toast.error(message, {
        duration,
      });
    },
    [duration]
  );

  const showWarning = React.useCallback(
    (message: string) => {
      toast(message, {
        duration,
        className: "bg-yellow-100 dark:bg-yellow-900",
      });
    },
    [duration]
  );

  const showInfo = React.useCallback(
    (message: string) => {
      toast(message, {
        duration,
      });
    },
    [duration]
  );

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}; 