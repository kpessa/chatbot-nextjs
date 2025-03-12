import type { StorybookConfig } from "@storybook/nextjs";
import type { Configuration } from 'webpack';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@chromatic-com/storybook",
    "@storybook/experimental-addon-test",
    "@storybook/addon-themes"
  ],
  "framework": {
    "name": "@storybook/nextjs",
    "options": {}
  },
  "staticDirs": [
    "../public"
  ],
  "docs": {
    "autodocs": true
  },
  webpackFinal: async (config: Configuration) => {
    // This is to ensure Storybook can handle Tailwind's modern CSS features
    if (config.module?.rules) {
      // Find the CSS rule
      const cssRule = config.module.rules.find((rule) => {
        if (typeof rule !== 'string' && rule && rule.test instanceof RegExp) {
          return rule.test.toString().includes('css');
        }
        return false;
      });
      
      // If found, modify it
      if (cssRule && typeof cssRule !== 'string' && cssRule.use && Array.isArray(cssRule.use)) {
        const postcssLoaderIndex = cssRule.use.findIndex((use) => {
          if (typeof use === 'object' && use && 'loader' in use) {
            return use.loader && use.loader.toString().includes('postcss-loader');
          }
          return false;
        });
        
        if (postcssLoaderIndex !== -1) {
          // Ensure postcss-loader uses the same config as the project
          cssRule.use[postcssLoaderIndex] = {
            loader: 'postcss-loader',
            options: {
              implementation: require('postcss'),
            },
          };
        }
      }
    }
    
    return config;
  },
};

export default config;