"use client";

import { useEffect } from "react";
import { Button } from "@/components/atoms/Button";

export default function ChatError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Chat error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4 text-center">
      <h2 className="text-2xl font-semibold">Something went wrong!</h2>
      <p className="text-muted-foreground max-w-md">
        {error.message || "An error occurred while loading the chat interface."}
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()}>Try again</Button>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Reload page
        </Button>
      </div>
    </div>
  );
} 