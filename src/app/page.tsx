import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Settings, Github } from "lucide-react";

export default function HomePage() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-screen py-12 px-4">
      <div className="flex flex-col items-center space-y-6 text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          LLM Chat Interface
        </h1>
        <p className="text-xl text-muted-foreground max-w-[600px]">
          A modern, customizable chat interface for interacting with large language models.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        <Card className="flex flex-col h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Start Chatting
            </CardTitle>
            <CardDescription>
              Begin a conversation with your preferred AI model
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-muted-foreground">
              Access a variety of powerful language models including GPT-4, Claude, and more. Upload files, customize settings, and get intelligent responses.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/chat" className="w-full">
              <Button className="w-full">
                Open Chat
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="flex flex-col h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configure Settings
            </CardTitle>
            <CardDescription>
              Customize your chat experience
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-muted-foreground">
              Set your API keys, adjust model parameters, configure themes, and personalize your chat interface to suit your preferences.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/settings" className="w-full">
              <Button variant="outline" className="w-full">
                Open Settings
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <footer className="mt-16 text-center">
        <div className="flex items-center justify-center space-x-4">
          <a 
            href="https://github.com/yourusername/llm-chat-interface" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="h-4 w-4" />
            <span>GitHub Repository</span>
          </a>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Built with Next.js, TypeScript, and ShadCN UI
        </p>
      </footer>
    </div>
  );
}
