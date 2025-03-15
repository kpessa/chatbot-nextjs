import { describe, it, expect, vi } from 'vitest';
import { 
  validateFile,
  uploadFile,
  formatFileSize,
  createFilePreview,
  revokeFilePreview
} from '../file-utils';

describe('File Utilities', () => {
  describe('validateFile', () => {
    it('should accept valid files', () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 }); // 1MB
      const result = validateFile(file, 2 * 1024 * 1024, ['text/plain']);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject files over max size', () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      Object.defineProperty(file, 'size', { value: 3 * 1024 * 1024 }); // 3MB
      const result = validateFile(file, 2 * 1024 * 1024, ['text/plain']);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('File size exceeds');
    });

    it('should reject files with disallowed types', () => {
      const file = new File(['test'], 'test.exe', { type: 'application/x-msdownload' });
      const result = validateFile(file, 10 * 1024 * 1024, ['image/png', 'image/jpeg']);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('File type');
    });
  });

  describe('uploadFile', () => {
    it('should successfully upload a file', async () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const mockResponse = { id: '123', name: 'test.txt', url: 'http://example.com/test.txt' };
      
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await uploadFile(file);
      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith('/api/upload', expect.any(Object));
    });

    it('should handle upload errors', async () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: 'Upload failed' })
      });

      await expect(uploadFile(file)).rejects.toThrow('Upload failed');
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(500)).toBe('500 B');
      expect(formatFileSize(1024)).toBe('1.0 KB');
      expect(formatFileSize(1024 * 1024)).toBe('1.0 MB');
    });
  });

  describe('createFilePreview and revokeFilePreview', () => {
    it('should create and revoke object URLs', () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const mockUrl = 'blob:http://example.com/123';
      
      global.URL.createObjectURL = vi.fn().mockReturnValue(mockUrl);
      global.URL.revokeObjectURL = vi.fn();

      const url = createFilePreview(file);
      expect(url).toBe(mockUrl);
      expect(URL.createObjectURL).toHaveBeenCalledWith(file);

      revokeFilePreview(url);
      expect(URL.revokeObjectURL).toHaveBeenCalledWith(url);
    });
  });
}); 