"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { FileIcon, ImageIcon, FileTextIcon } from "lucide-react";
import { formatFileSize } from "@/lib/file-utils";

interface FilePreviewProps {
  file: File;
  onRemove?: () => void;
  className?: string;
}

/**
 * FilePreview component for displaying file previews before upload
 * Supports images, PDFs, and text files with appropriate icons and previews
 */
export const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  onRemove,
  className,
}) => {
  const [preview, setPreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const renderIcon = () => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="h-8 w-8 text-primary" />;
    }
    if (file.type === "application/pdf") {
      return <FileTextIcon className="h-8 w-8 text-primary" />;
    }
    return <FileIcon className="h-8 w-8 text-primary" />;
  };

  return (
    <div
      className={cn(
        "relative group border rounded-lg overflow-hidden bg-background",
        className
      )}
    >
      <div className="p-4">
        {preview ? (
          <div className="relative w-full aspect-video">
            <Image
              src={preview}
              alt={file.name}
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center aspect-video bg-muted">
            {renderIcon()}
          </div>
        )}
        <div className="mt-2">
          <p className="text-sm font-medium truncate">{file.name}</p>
          <p className="text-xs text-muted-foreground">
            {formatFileSize(file.size)}
          </p>
        </div>
      </div>

      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 p-1 rounded-full bg-background/80 text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Remove file"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}; 