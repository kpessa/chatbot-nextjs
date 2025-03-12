import { useCallback, useEffect } from 'react';
import { validateFile } from '../file-utils';

interface UseScreenshotPasteOptions {
  onPaste?: (file: File) => void;
  maxSize?: number;
  enabled?: boolean;
}

/**
 * Custom hook for handling screenshot paste functionality
 * Listens for paste events and handles image data
 */
export const useScreenshotPaste = ({
  onPaste,
  maxSize = 10 * 1024 * 1024, // 10MB default
  enabled = true,
}: UseScreenshotPasteOptions = {}) => {
  const handlePaste = useCallback(
    (event: ClipboardEvent) => {
      if (!enabled || !onPaste) return;

      const items = event.clipboardData?.items;
      if (!items) return;

      // Find the first image item in the clipboard
      const imageItem = Array.from(items).find(
        (item) => item.type.startsWith('image/')
      );

      if (imageItem) {
        const file = imageItem.getAsFile();
        if (!file) return;

        // Validate file size
        const validation = validateFile(file, maxSize, ['image/png', 'image/jpeg']);
        if (!validation.isValid) {
          console.error(validation.error);
          return;
        }

        // Generate a more descriptive filename
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const newFile = new File([file], `screenshot-${timestamp}.png`, {
          type: 'image/png',
        });

        onPaste(newFile);
      }
    },
    [enabled, maxSize, onPaste]
  );

  useEffect(() => {
    if (enabled) {
      document.addEventListener('paste', handlePaste);
      return () => document.removeEventListener('paste', handlePaste);
    }
  }, [enabled, handlePaste]);

  return null;
}; 