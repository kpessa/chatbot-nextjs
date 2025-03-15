"use client";

import { useState } from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Download, FileText, FileJson, FileCode, FileDown } from "lucide-react";
import { Message } from "@/lib/types";
import { 
  exportAsText, 
  exportAsJSON, 
  exportAsHTML, 
  exportAsMarkdown, 
  downloadFile 
} from "@/lib/export-utils";
import { cn } from "@/lib/utils";

/**
 * Export menu component that provides options to export chat in different formats
 */
interface ExportMenuProps {
  messages: Message[];
  className?: string;
}

export function ExportMenu({ messages, className }: ExportMenuProps) {
  const [isExporting, setIsExporting] = useState(false);
  
  const handleExport = async (format: 'text' | 'json' | 'html' | 'markdown') => {
    if (messages.length === 0) return;
    
    setIsExporting(true);
    
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      
      switch (format) {
        case 'text':
          downloadFile(
            exportAsText(messages),
            `chat-export-${timestamp}.txt`,
            'text/plain'
          );
          break;
        case 'json':
          downloadFile(
            exportAsJSON(messages),
            `chat-export-${timestamp}.json`,
            'application/json'
          );
          break;
        case 'html':
          downloadFile(
            exportAsHTML(messages),
            `chat-export-${timestamp}.html`,
            'text/html'
          );
          break;
        case 'markdown':
          downloadFile(
            exportAsMarkdown(messages),
            `chat-export-${timestamp}.md`,
            'text/markdown'
          );
          break;
      }
    } catch (error) {
      console.error('Error exporting chat:', error);
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={cn("flex items-center gap-2", className)}
          disabled={isExporting || messages.length === 0}
        >
          <Download className="h-4 w-4" />
          <span>Export</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => handleExport('text')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <FileText className="h-4 w-4" />
          <span>Export as Text</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleExport('json')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <FileJson className="h-4 w-4" />
          <span>Export as JSON</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleExport('html')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <FileCode className="h-4 w-4" />
          <span>Export as HTML</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleExport('markdown')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <FileDown className="h-4 w-4" />
          <span>Export as Markdown</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 