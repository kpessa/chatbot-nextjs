import React from "react";
import type { Preview } from "@storybook/react";
import { withThemeByClassName } from "@storybook/addon-themes";
import "./reset.css";
import "../src/app/globals.css";
import "./storybook.css";
import "./components.css";
import { cn } from "../src/lib/utils";

// Add any global decorators here
const withThemeProvider = (Story, context) => {
  return (
    <div className="p-4">
      <div className="bg-background text-foreground rounded-md p-4">
        <Story />
      </div>
    </div>
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
    withThemeProvider,
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