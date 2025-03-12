import { Attachment } from "./types";

/**
 * Validates a file against size and type constraints
 */
export const validateFile = (
  file: File,
  maxSize: number = 10 * 1024 * 1024,
  allowedTypes: string[] = ["image/png", "image/jpeg", "application/pdf", "text/plain"]
): { isValid: boolean; error?: string } => {
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size exceeds ${Math.round(maxSize / (1024 * 1024))}MB limit`,
    };
  }

  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(", ")}`,
    };
  }

  return { isValid: true };
};

/**
 * Uploads a file to the server
 */
export const uploadFile = async (file: File): Promise<Attachment> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to upload file");
  }

  return response.json();
};

/**
 * Formats a file size in bytes to a human-readable string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * Creates an object URL for a file for preview purposes
 */
export const createFilePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Revokes an object URL to prevent memory leaks
 */
export const revokeFilePreview = (url: string): void => {
  URL.revokeObjectURL(url);
}; 