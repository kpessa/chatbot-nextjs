import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/lib/query-provider";
import { ChatProvider } from "@/lib/chat-context";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LLM Chat Interface",
  description: "A modern, customizable chat interface for interacting with large language models",
  keywords: ["AI", "chat", "LLM", "GPT", "Claude", "Next.js", "React"],
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  publisher: "Your Name",
  openGraph: {
    title: "LLM Chat Interface",
    description: "A modern, customizable chat interface for interacting with large language models",
    url: "https://llm-chat-interface.vercel.app",
    siteName: "LLM Chat Interface",
    images: [
      {
        url: "https://llm-chat-interface.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "LLM Chat Interface",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LLM Chat Interface",
    description: "A modern, customizable chat interface for interacting with large language models",
    images: ["https://llm-chat-interface.vercel.app/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <ChatProvider>
              {children}
              <Toaster />
            </ChatProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
