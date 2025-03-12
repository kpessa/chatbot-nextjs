"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface UploadProgressProps {
  fileName: string;
  progress: number;
  status: "uploading" | "processing" | "error" | "complete";
  className?: string;
}

/**
 * UploadProgress component for showing file upload status and progress
 */
export const UploadProgress: React.FC<UploadProgressProps> = ({
  fileName,
  progress,
  status,
  className,
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium truncate flex-1">{fileName}</p>
        <div className="flex items-center gap-2">
          {status === "uploading" && (
            <span className="text-xs text-muted-foreground">{progress}%</span>
          )}
          {status === "processing" && (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          )}
          {status === "error" && (
            <span className="text-xs text-destructive">Failed</span>
          )}
          {status === "complete" && (
            <span className="text-xs text-primary">Complete</span>
          )}
        </div>
      </div>
      <Progress
        value={progress}
        className={cn(
          "h-1",
          status === "error" && "bg-destructive/30 [&>div]:bg-destructive",
          status === "complete" && "bg-primary/30 [&>div]:bg-primary"
        )}
      />
    </div>
  );
}; 