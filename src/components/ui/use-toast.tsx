"use client"

import * as React from "react"
import { toast } from "sonner"

export interface ToastProps {
  title?: React.ReactNode
  description?: React.ReactNode
  duration?: number
  variant?: "default" | "destructive"
  className?: string
  action?: React.ReactNode
}

export function useToast() {
  const customToast = React.useCallback(
    ({
      title,
      description,
      duration = 5000,
      variant = "default",
      className,
      action,
    }: ToastProps) => {
      // If we have a title and description, we'll use the title as the main message
      // and the description as the description option
      if (title && description) {
        return toast(title, {
          description: description as string,
          duration,
          className: `${variant === "destructive" ? "destructive" : ""} ${className || ""}`,
          action,
        })
      }
      
      // If we only have a description, use it as the main message
      return toast(description || title || "", {
        duration,
        className: `${variant === "destructive" ? "destructive" : ""} ${className || ""}`,
        action,
      })
    },
    []
  )

  return {
    toast: customToast,
  }
} 