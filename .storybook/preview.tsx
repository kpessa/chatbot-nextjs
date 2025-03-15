import React from "react";
import type { Preview } from "@storybook/react";
import { withThemeByClassName } from "@storybook/addon-themes";
import "./reset.css";
import "../src/app/globals.css";
import "./storybook.css";
import "./components.css";
import { ChatProvider } from "../src/lib/chat-context";
import { QueryProvider } from "../src/lib/query-provider";
import { ThemeProvider } from "../src/components/theme-provider";
import type { Decorator } from "@storybook/react";

// Add any global decorators here
const withProviders: Decorator = (StoryFn) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>
        <ChatProvider>
          <div className="p-4">
            <div className="bg-background text-foreground rounded-md p-4">
              <StoryFn />
            </div>
          </div>
        </ChatProvider>
      </QueryProvider>
    </ThemeProvider>
  );
};

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        {
          name: "light",
          value: "#ffffff",
        },
        {
          name: "dark",
          value: "#13111c",
        },
      ],
    },
  },
  decorators: [
    withProviders,
    withThemeByClassName({
      themes: {
        light: "",
        dark: "dark",
      },
      defaultTheme: "light",
    }),
  ],
};

export default preview; 