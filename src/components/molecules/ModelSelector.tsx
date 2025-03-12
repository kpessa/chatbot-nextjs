"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type Model = {
  id: string;
  name: string;
  provider: "openai" | "anthropic" | "deepseek" | "other";
  description?: string;
  maxTokens?: number;
  supportsFiles?: boolean;
  fileTypes?: string[];
};

export interface ModelSelectorProps {
  models: Model[];
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  className?: string;
  disabled?: boolean;
}

/**
 * ModelSelector component for selecting different LLM models
 * with a dropdown interface and model information.
 */
const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  selectedModel,
  onModelChange,
  className,
  disabled = false,
}) => {
  const [open, setOpen] = React.useState(false);
  const selectedModelData = models.find((model) => model.id === selectedModel);

  // Get provider icon based on the provider name
  const getProviderIcon = (provider: Model["provider"]) => {
    switch (provider) {
      case "openai":
        return (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-green-600"
          >
            <path
              d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.051 6.051 0 0 0 6.0572-2.9001 5.9894 5.9894 0 0 0 3.9977-2.9 6.0557 6.0557 0 0 0-.7475-7.0966 5.9894 5.9894 0 0 0 -.2854-1.2823ZM13.2599 22.5983a4.5675 4.5675 0 0 1-2.2537-.5917v-3.1574a.5984.5984 0 0 0-.5983-.5983h-1.4482a.5983.5983 0 0 1-.5983-.5984v-1.4482a.5983.5983 0 0 1 .5983-.5983h1.4482a.5984.5984 0 0 0 .5983-.5984v-4.2339a.5984.5984 0 0 1 .5984-.5983h1.4482a.5984.5984 0 0 1 .5983.5983v4.2339a.5984.5984 0 0 0 .5984.5984h3.3294a.5984.5984 0 0 1 .5983.5983v1.4482a.5984.5984 0 0 1-.5983.5984h-3.3294a.5984.5984 0 0 0-.5984.5983v3.1574a4.5675 4.5675 0 0 1-2.2537.5917Zm8.5306-3.4145a4.4755 4.4755 0 0 1-3.1431 1.3231v-1.8674a1.7951 1.7951 0 0 1 1.7951-1.7951h.5983a.5984.5984 0 0 0 .5984-.5983v-1.4482a.5984.5984 0 0 0-.5984-.5984h-.5983a1.7951 1.7951 0 0 1-1.7951-1.7951v-.8875a1.7952 1.7952 0 0 1 1.7951-1.7951h.5983a.5984.5984 0 0 0 .5984-.5984v-1.4482a.5984.5984 0 0 0-.5984-.5983h-.5983a1.7952 1.7952 0 0 1-1.7951-1.7952v-.3923a4.4708 4.4708 0 0 1 3.1431 1.3232 4.4708 4.4708 0 0 1 1.3232 3.1431 4.4759 4.4759 0 0 1-.269 1.5206 4.4912 4.4912 0 0 1 1.612 1.8344 4.5067 4.5067 0 0 1 .4009 3.4145 4.4761 4.4761 0 0 1-1.3232 3.1431ZM4.8263 19.7549a4.4755 4.4755 0 0 1-1.3232-3.1431 4.5066 4.5066 0 0 1 .4009-3.4145 4.4912 4.4912 0 0 1 1.612-1.8344 4.4758 4.4758 0 0 1-.269-1.5206 4.4708 4.4708 0 0 1 1.3232-3.1431 4.4708 4.4708 0 0 1 3.1431-1.3232v.3923a1.7952 1.7952 0 0 1-1.7951 1.7952h-.5983a.5984.5984 0 0 0-.5984.5983v1.4482a.5984.5984 0 0 0 .5984.5984h.5983a1.7952 1.7952 0 0 1 1.7951 1.7951v.8875a1.7951 1.7951 0 0 1-1.7951 1.7951h-.5983a.5984.5984 0 0 0-.5984.5984v1.4482a.5984.5984 0 0 0 .5984.5983h.5983a1.7951 1.7951 0 0 1 1.7951 1.7951v1.8674a4.4755 4.4755 0 0 1-3.1431-1.3231Z"
              fill="currentColor"
            />
          </svg>
        );
      case "anthropic":
        return (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-purple-600"
          >
            <path
              d="M12 2L4 6V18L12 22L20 18V6L12 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 22V14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20 6L12 14L4 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 18L12 14L20 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "deepseek":
        return (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-blue-600"
          >
            <path
              d="M21 16.5C21 18.9853 18.9853 21 16.5 21H7.5C5.01472 21 3 18.9853 3 16.5V7.5C3 5.01472 5.01472 3 7.5 3H16.5C18.9853 3 21 5.01472 21 7.5V16.5Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7 14.5L10 11.5L7 8.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13 14.5H17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      default:
        return (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-600"
          >
            <path
              d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 2V4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 20V22"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4.93 4.93L6.34 6.34"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17.66 17.66L19.07 19.07"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 12H4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20 12H22"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.34 17.66L4.93 19.07"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19.07 4.93L17.66 6.34"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
    }
  };

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center justify-between w-full px-3 py-2 text-sm border rounded-md",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
          "bg-background border-input"
        )}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby="model-selector"
      >
        <div className="flex items-center gap-2">
          {selectedModelData && getProviderIcon(selectedModelData.provider)}
          <span>{selectedModelData?.name || "Select a model"}</span>
        </div>
        <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
      </button>

      {open && !disabled && (
        <div
          className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg border-input"
          role="listbox"
        >
          <ul className="py-1 overflow-auto max-h-60">
            {models.map((model) => (
              <li
                key={model.id}
                className={cn(
                  "flex items-center px-3 py-2 text-sm cursor-pointer",
                  "hover:bg-accent hover:text-accent-foreground",
                  model.id === selectedModel && "bg-accent text-accent-foreground"
                )}
                onClick={() => {
                  onModelChange(model.id);
                  setOpen(false);
                }}
                role="option"
                aria-selected={model.id === selectedModel}
              >
                <div className="flex items-center gap-2 flex-1">
                  {getProviderIcon(model.provider)}
                  <div className="flex flex-col">
                    <span className="font-medium">{model.name}</span>
                    {model.description && (
                      <span className="text-xs text-muted-foreground">{model.description}</span>
                    )}
                  </div>
                </div>
                {model.id === selectedModel && <Check className="w-4 h-4 ml-2" />}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export { ModelSelector }; 