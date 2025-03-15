"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Attachment } from "@/lib/types";

export interface FileAttachmentProps {
  file: Attachment;
  className?: string;
  onRemove?: () => void;
}

/**
 * FileAttachment component for displaying attached files in the chat
 * with support for images, documents, and other file types.
 */
const FileAttachment: React.FC<FileAttachmentProps> = ({
  file,
  className,
  onRemove,
}) => {
  const isImage = file.type.startsWith("image/");
  const isPDF = file.type === "application/pdf";
  const isText = file.type === "text/plain";

  // Format file size
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div
      className={cn(
        "border rounded-md overflow-hidden flex flex-col",
        className
      )}
    >
      {isImage ? (
        <div className="relative w-full h-48">
          <Image
            src={file.url || '/placeholder-image.png'}
            alt={file.name}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="bg-secondary/30 p-4 flex items-center justify-center h-24">
          {isPDF ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <path d="M9 15v-2h6v2" />
              <path d="M9 18v-2h6v2" />
              <path d="M9 12v-2h2v2" />
            </svg>
          ) : isText ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="8" y1="13" x2="16" y2="13" />
              <line x1="8" y1="17" x2="16" y2="17" />
              <line x1="8" y1="9" x2="11" y2="9" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          )}
        </div>
      )}
      <div className="p-3 bg-background flex items-center justify-between">
        <div className="truncate">
          <p className="text-sm font-medium truncate">{file.name}</p>
          <p className="text-xs text-muted-foreground">
            {formatFileSize(file.size)}
          </p>
        </div>
        {onRemove && (
          <button
            onClick={onRemove}
            className="ml-2 text-muted-foreground hover:text-destructive"
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
    </div>
  );
};

export { FileAttachment }; 