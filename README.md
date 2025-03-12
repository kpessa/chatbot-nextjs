# LLM Chat Interface

A modern, customizable chat interface for interacting with large language models. Built with Next.js, TypeScript, Tailwind CSS, and ShadCN UI components.

![LLM Chat Interface Screenshot](https://via.placeholder.com/800x450.png?text=LLM+Chat+Interface)

## Features

- 🤖 Support for multiple AI models (OpenAI, Anthropic, Deepseek, etc.)
- 📁 File attachment support for images, PDFs, and text files
- 🎨 Customizable themes with light and dark mode
- ⚙️ Configurable settings for API keys and model parameters
- 📱 Responsive design for desktop and mobile
- 🧩 Component-driven architecture with Storybook
- 🔄 Real-time streaming responses
- 💾 Local storage for chat history

## Getting Started

### Prerequisites

- Node.js 18.0.0 or later
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
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your API keys:

```
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_ANTHROPIC_API_KEY=your_anthropic_api_key
NEXT_PUBLIC_DEEPSEEK_API_KEY=your_deepseek_api_key
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
/
├── public/              # Static assets
├── src/
│   ├── app/             # Next.js app router pages
│   ├── components/      # React components
│   │   ├── atoms/       # Basic UI components
│   │   ├── molecules/   # Composite components
│   │   ├── organisms/   # Complex components
│   │   ├── templates/   # Page layouts
│   │   └── ui/          # ShadCN UI components
│   ├── lib/             # Utility functions and hooks
│   └── styles/          # Global styles
├── .storybook/          # Storybook configuration
└── stories/             # Storybook stories
```

## Component Architecture

The project follows the Atomic Design methodology:

- **Atoms**: Basic building blocks like buttons, inputs, and labels
- **Molecules**: Groups of atoms functioning together (e.g., ModelSelector)
- **Organisms**: Complex UI components (e.g., ChatInput, MessageList)
- **Templates**: Page layouts that arrange organisms (e.g., ChatInterface)
- **Pages**: Specific instances of templates with real data

## Development

### Running Storybook

To view and develop components in isolation:

```bash
npm run storybook
# or
yarn storybook
```

Then open [http://localhost:6006](http://localhost:6006) in your browser.

### Building for Production

```bash
npm run build
# or
yarn build
```

## Customization

### Themes

The application uses Tailwind CSS for styling with ShadCN UI components. You can customize the theme in the `tailwind.config.js` file.

### Adding New Models

To add support for new AI models, update the models array in the chat page component.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [ShadCN UI](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Storybook](https://storybook.js.org/)
- [Lucide Icons](https://lucide.dev/)
