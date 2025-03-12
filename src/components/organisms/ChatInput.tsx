"use client";

import * as React from "react";
import { Paperclip, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/Button";
import { FileAttachment } from "@/components/molecules/FileAttachment";

export interface ChatInputProps {
  onSendMessage: (message: string, files?: File[]) => void;
  placeholder?: string;
  disabled?: boolean;
  allowFiles?: boolean;
  maxFileSize?: number; // in MB
  allowedFileTypes?: string[];
  className?: string;
}

/**
 * ChatInput component for handling user input, file uploads, and sending messages
 * with support for text input, file attachments, and screenshot pasting.
 */
const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  placeholder = "Type your message...",
  disabled = false,
  allowFiles = true,
  maxFileSize = 10, // 10MB default
  allowedFileTypes = ["image/png", "image/jpeg", "application/pdf", "text/plain"],
  className,
}) => {
  const [message, setMessage] = React.useState("");
  const [files, setFiles] = React.useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || files.length > 0) {
      onSendMessage(message.trim(), files.length > 0 ? files : undefined);
      setMessage("");
      setFiles([]);
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      
      // Filter files by type and size
      const validFiles = selectedFiles.filter(file => {
        const isValidType = allowedFileTypes.includes(file.type) || allowedFileTypes.includes("*");
        const isValidSize = file.size <= maxFileSize * 1024 * 1024;
        return isValidType && isValidSize;
      });
      
      setFiles(prev => [...prev, ...validFiles]);
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Handle file removal
  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Handle paste event for screenshots
  const handlePaste = (e: React.ClipboardEvent) => {
    if (!allowFiles) return;
    
    const items = e.clipboardData.items;
    
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file && file.size <= maxFileSize * 1024 * 1024) {
          setFiles(prev => [...prev, file]);
        }
      }
    }
  };

  // Auto-resize textarea
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className={cn("border-t", className)}>
      {/* File attachments */}
      {files.length > 0 && (
        <div className="p-2 border-b">
          <div className="flex flex-wrap gap-2">
            {files.map((file, index) => (
              <div key={`${file.name}-${index}`} className="w-full sm:w-48">
                <FileAttachment
                  file={{
                    name: file.name,
                    type: file.type,
                    url: URL.createObjectURL(file),
                    size: file.size,
                  }}
                  onRemove={() => handleRemoveFile(index)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input form */}
      <form onSubmit={handleSubmit} className="p-2">
        <div className="flex items-end gap-2">
          <div className="relative flex-1">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onPaste={handlePaste}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                "ring-offset-background placeholder:text-muted-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "resize-none min-h-[40px] max-h-[200px] overflow-y-auto"
              )}
              rows={1}
            />
            
            {/* File attachment button */}
            {allowFiles && (
              <div className="absolute bottom-2 right-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  multiple
                  accept={allowedFileTypes.join(",")}
                  className="hidden"
                  id="file-upload"
                  disabled={disabled}
                />
                <label
                  htmlFor="file-upload"
                  className={cn(
                    "inline-flex items-center justify-center rounded-md p-1",
                    "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    "cursor-pointer",
                    disabled && "opacity-50 cursor-not-allowed pointer-events-none"
                  )}
                >
                  <Paperclip className="w-4 h-4" />
                </label>
              </div>
            )}
          </div>
          
          {/* Send button */}
          <Button
            type="submit"
            disabled={disabled || (!message.trim() && files.length === 0)}
            size="icon"
            className="h-10 w-10"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export { ChatInput }; 