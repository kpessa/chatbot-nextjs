"use client";

import * as React from "react";
import { Paperclip, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/Button";
import { FileAttachment } from "@/components/molecules/FileAttachment";
import { FilePreview } from "@/components/molecules/FilePreview";
import { UploadProgress } from "@/components/molecules/UploadProgress";
import { useChatQuery } from "@/lib/use-chat-query";
import { useChat } from "@/lib/chat-context";
import { useScreenshotPaste } from "@/lib/hooks/useScreenshotPaste";
import { Attachment } from "@/lib/types";
import { validateFile } from "@/lib/file-utils";

export interface ChatInputProps {
  placeholder?: string;
  disabled?: boolean;
  allowFiles?: boolean;
  maxFileSize?: number; // in MB
  allowedFileTypes?: string[];
  className?: string;
}

interface FileUploadState {
  file: File;
  progress: number;
  status: "uploading" | "processing" | "error" | "complete";
}

/**
 * ChatInput component for handling user input, file uploads, and sending messages
 * with support for text input, file attachments, and screenshot pasting.
 */
const ChatInput: React.FC<ChatInputProps> = ({
  placeholder = "Type your message...",
  disabled = false,
  allowFiles = true,
  maxFileSize = 10, // 10MB default
  allowedFileTypes = ["image/png", "image/jpeg", "application/pdf", "text/plain"],
  className,
}) => {
  const { state } = useChat();
  const { sendMessage, uploadFile, isProcessing } = useChatQuery();
  const [message, setMessage] = React.useState("");
  const [files, setFiles] = React.useState<File[]>([]);
  const [attachments, setAttachments] = React.useState<Attachment[]>([]);
  const [uploadStates, setUploadStates] = React.useState<Record<string, FileUploadState>>({});
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Disable the input if processing
  const isDisabled = disabled || isProcessing || Object.values(uploadStates).some(
    state => state.status === "uploading" || state.status === "processing"
  );

  // Use screenshot paste hook
  useScreenshotPaste({
    onPaste: (file) => {
      const validation = validateFile(file, maxFileSize * 1024 * 1024, allowedFileTypes);
      if (validation.isValid) {
        setFiles((prevFiles) => [...prevFiles, file]);
      } else {
        console.error(validation.error);
      }
    },
    maxSize: maxFileSize * 1024 * 1024,
    enabled: allowFiles && !isDisabled,
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || attachments.length > 0) {
      // Upload any files that haven't been uploaded yet
      if (files.length > 0) {
        try {
          const newAttachments = await Promise.all(
            files.map(async (file) => {
              // Create upload state for this file
              const fileId = `${file.name}-${Date.now()}`;
              setUploadStates(prev => ({
                ...prev,
                [fileId]: { file, progress: 0, status: "uploading" }
              }));

              try {
                // Simulate upload progress
                const progressInterval = setInterval(() => {
                  setUploadStates(prev => {
                    const current = prev[fileId];
                    if (current && current.status === "uploading" && current.progress < 90) {
                      return {
                        ...prev,
                        [fileId]: { ...current, progress: current.progress + 10 }
                      };
                    }
                    return prev;
                  });
                }, 500);

                // Upload the file
                const result = await uploadFile(file);

                // Clear interval and set complete
                clearInterval(progressInterval);
                setUploadStates(prev => ({
                  ...prev,
                  [fileId]: { file, progress: 100, status: "complete" }
                }));

                return result;
              } catch (error) {
                setUploadStates(prev => ({
                  ...prev,
                  [fileId]: { file, progress: 0, status: "error" }
                }));
                throw error;
              }
            })
          );
          
          // Add the new attachments to the existing ones
          const allAttachments = [...attachments, ...newAttachments];
          
          // Send the message with attachments
          await sendMessage(message.trim(), allAttachments);

          // Clear upload states
          setUploadStates({});
        } catch (error) {
          console.error("Error uploading files:", error);
        }
      } else {
        // Send the message with existing attachments
        await sendMessage(message.trim(), attachments.length > 0 ? attachments : undefined);
      }
      
      // Clear the input
      setMessage("");
      setFiles([]);
      setAttachments([]);
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      
      // Filter files by type and size
      const validFiles = selectedFiles.filter((file) => {
        const validation = validateFile(file, maxFileSize * 1024 * 1024, allowedFileTypes);
        if (!validation.isValid) {
          console.error(`Error with file ${file.name}:`, validation.error);
        }
        return validation.isValid;
      });
      
      setFiles((prevFiles) => [...prevFiles, ...validFiles]);
    }
    
    // Reset the input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle removing a file
  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Handle removing an attachment
  const handleRemoveAttachment = (id: string) => {
    setAttachments((prevAttachments) => prevAttachments.filter((attachment) => attachment.id !== id));
  };

  // Auto-resize textarea
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col space-y-2 w-full", className)}
    >
      {/* File previews */}
      {(files.length > 0 || attachments.length > 0) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-2 bg-muted/50 rounded-md">
          {files.map((file, index) => (
            <FilePreview
              key={`file-${index}`}
              file={file}
              onRemove={() => handleRemoveFile(index)}
            />
          ))}
          {attachments.map((attachment) => (
            <FileAttachment
              key={`attachment-${attachment.id}`}
              file={attachment}
              onRemove={() => handleRemoveAttachment(attachment.id)}
            />
          ))}
        </div>
      )}

      {/* Upload progress */}
      {Object.entries(uploadStates).length > 0 && (
        <div className="space-y-2">
          {Object.entries(uploadStates).map(([id, state]) => (
            <UploadProgress
              key={id}
              fileName={state.file.name}
              progress={state.progress}
              status={state.status}
            />
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="flex items-end space-x-2">
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={placeholder}
            disabled={isDisabled}
            className="w-full p-3 pr-10 resize-none min-h-[50px] max-h-[200px] rounded-md border border-input bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
        </div>

        {/* File upload button */}
        {allowFiles && (
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept={allowedFileTypes.join(",")}
              className="hidden"
              disabled={isDisabled}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={isDisabled}
              className="h-10 w-10"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
          </>
        )}

        {/* Send button */}
        <Button
          type="submit"
          disabled={isDisabled || (message.trim() === "" && files.length === 0 && attachments.length === 0)}
          className="h-10 w-10"
          size="icon"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};

export { ChatInput }; 