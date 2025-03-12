"use client";

import React from "react";
import styles from "./storybook.module.css";
import { cn } from "@/lib/utils";

interface StorybookDecoratorProps {
  children: React.ReactNode;
  isDark?: boolean;
}

/**
 * A decorator component for Storybook stories to ensure proper styling
 */
export const StorybookDecorator: React.FC<StorybookDecoratorProps> = ({
  children,
  isDark = false,
}) => {
  return (
    <div className={cn(styles["storybook-wrapper"], isDark && styles.dark)}>
      {children}
    </div>
  );
}; 