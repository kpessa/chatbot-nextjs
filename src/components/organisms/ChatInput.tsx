"use client";

import * as React from "react";
import { Paperclip, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/Button";
import { FileAttachment } from "@/components/molecules/FileAttachment";
import { useChatQuery } from "@/lib/use-chat-query";
import { useChat } from "@/lib/chat-context";
import { Attachment } from "@/lib/types";

export interface ChatInputProps {
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
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || attachments.length > 0) {
      // Upload any files that haven't been uploaded yet
      if (files.length > 0) {
        setIsUploading(true);
        try {
          const newAttachments = await Promise.all(
            files.map(async (file) => {
              return await uploadFile(file);
            })
          );
          
          // Add the new attachments to the existing ones
          const allAttachments = [...attachments, ...newAttachments];
          
          // Send the message with attachments
          await sendMessage(message.trim(), allAttachments);
        } catch (error) {
          console.error("Error uploading files:", error);
        } finally {
          setIsUploading(false);
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
        const isValidType = allowedFileTypes.includes(file.type) || allowedFileTypes.includes("*");
        const isValidSize = file.size <= maxFileSize * 1024 * 1024;
        return isValidType && isValidSize;
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

  // Handle pasting files (e.g., screenshots)
  const handlePaste = (e: React.ClipboardEvent) => {
    if (!allowFiles) return;
    
    const items = e.clipboardData.items;
    const imageItems = Array.from(items).filter((item) => item.type.startsWith("image/"));
    
    if (imageItems.length > 0) {
      const files = imageItems.map((item) => item.getAsFile()).filter(Boolean) as File[];
      setFiles((prevFiles) => [...prevFiles, ...files]);
    }
  };

  // Auto-resize textarea
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  // Disable the input if processing or uploading
  const isDisabled = disabled || isProcessing || isUploading;

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col space-y-2 w-full", className)}
    >
      {/* File attachments */}
      {(files.length > 0 || attachments.length > 0) && (
        <div className="flex flex-wrap gap-2 p-2 bg-muted/50 rounded-md">
          {files.map((file, index) => (
            <FileAttachment
              key={`file-${index}`}
              file={{
                name: file.name,
                type: file.type,
                url: URL.createObjectURL(file),
                size: file.size,
              }}
              onRemove={() => handleRemoveFile(index)}
            />
          ))}
          {attachments.map((attachment) => (
            <FileAttachment
              key={`attachment-${attachment.id}`}
              file={{
                name: attachment.name,
                type: attachment.type,
                url: attachment.url,
                size: attachment.size,
              }}
              onRemove={() => handleRemoveAttachment(attachment.id)}
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
            onPaste={handlePaste}
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