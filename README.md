# LLM Chat Interface

A modern, customizable chat interface for interacting with large language models, built with Next.js and ShadCN UI.

## Features

- 🤖 Support for multiple LLM providers (OpenAI, Anthropic, DeepSeek)
- 🎨 Beautiful UI with ShadCN components
- 🌓 Light/Dark mode with system preference support
- ⚡ Real-time streaming responses
- 📁 File attachment support
- ⚙️ Customizable model settings
- 💾 Persistent chat history
- 🔒 Secure API key management
- 📱 Responsive design

## Tech Stack

- [Next.js 14](https://nextjs.org/) - React framework
- [ShadCN UI](https://ui.shadcn.com/) - Component library
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Zustand](https://zustand-demo.pmnd.rs/) - State management
- [React Query](https://tanstack.com/query/latest) - Data fetching
- [Sonner](https://sonner.emilkowal.ski/) - Toast notifications

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/llm-chat-interface.git
   cd llm-chat-interface
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment variables file:
   ```bash
   cp .env.example .env.local
   ```

4. Configure your environment variables in `.env.local`

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

### Deploying to Vercel

1. Push your code to a GitHub repository

2. Visit [Vercel](https://vercel.com) and create a new project

3. Import your GitHub repository

4. Configure environment variables in Vercel project settings:
   - Add all variables from `.env.example`
   - Update `NEXT_PUBLIC_APP_URL` to your production URL

5. Deploy!

### Environment Variables

Required environment variables:

- `NEXT_PUBLIC_APP_URL`: Your application URL
- `RATE_LIMIT_MAX_REQUESTS`: Maximum API requests per window
- `RATE_LIMIT_WINDOW_MS`: Rate limiting window in milliseconds
- At least one of:
  - `OPENAI_API_KEY`: OpenAI API key
  - `ANTHROPIC_API_KEY`: Anthropic API key
  - `DEEPSEEK_API_KEY`: DeepSeek API key

Optional environment variables:
- `NEXT_PUBLIC_ANALYTICS_ID`: Analytics tracking ID
- `OPENAI_ORG_ID`: OpenAI organization ID

## Development

### Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
│   ├── ui/          # ShadCN UI components
│   └── ...          # Custom components
├── lib/             # Utilities and hooks
│   ├── stores/      # Zustand stores
│   └── ...          # Other utilities
└── styles/          # Global styles
```

### Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [ShadCN UI](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Storybook](https://storybook.js.org/)
- [Lucide Icons](https://lucide.dev/)
