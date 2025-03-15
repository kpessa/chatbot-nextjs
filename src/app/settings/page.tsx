"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useSettings } from "@/lib/stores/settings";
import { toast } from "sonner";
import { useState } from "react";

const API_PROVIDERS = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  deepseek: "DeepSeek",
} as const;

export default function SettingsPage() {
  const router = useRouter();
  const settings = useSettings();
  const [testingProvider, setTestingProvider] = useState<string | null>(null);

  const handleApiKeyChange = (provider: keyof typeof API_PROVIDERS, value: string) => {
    if (value === "") {
      settings.removeApiKey(provider);
    } else {
      settings.setApiKey(provider, value);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleTemperatureChange = (value: number[]) => {
    settings.updateSettings({ temperature: value[0] });
  };

  const handleMaxTokensChange = (value: number[]) => {
    settings.updateSettings({ maxTokens: value[0] });
  };

  const handleThemeChange = (value: "system" | "light" | "dark") => {
    settings.updateSettings({ theme: value });
  };

  const testApiConnection = async (provider: string) => {
    setTestingProvider(provider);
    
    try {
      const apiKey = settings.apiKeys[provider as keyof typeof settings.apiKeys];
      
      if (!apiKey) {
        toast.error(`No API key provided for ${provider}`);
        setTestingProvider(null);
        return;
      }
      
      // Create a simple test request based on the provider
      const response = await fetch('/api/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider,
          apiKey,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success(`Successfully connected to ${provider} API`);
      } else {
        toast.error(`Failed to connect to ${provider} API: ${data.message}`);
      }
    } catch (error) {
      toast.error(`Error testing connection: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setTestingProvider(null);
    }
  };

  return (
    <div className="container max-w-3xl py-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleBack} 
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>
              Configure your API keys for different LLM providers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(API_PROVIDERS).map(([provider, label]) => (
              <div key={provider} className="space-y-2">
                <Label htmlFor={`${provider}-api-key`}>{label} API Key</Label>
                <div className="flex gap-2">
                  <Input
                    id={`${provider}-api-key`}
                    type="password"
                    value={settings.apiKeys[provider as keyof typeof settings.apiKeys] || ""}
                    onChange={(e) => handleApiKeyChange(provider as keyof typeof API_PROVIDERS, e.target.value)}
                    placeholder={`Enter your ${label} API key`}
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => testApiConnection(provider)}
                    disabled={testingProvider === provider}
                  >
                    {testingProvider === provider ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      'Test'
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interface Settings</CardTitle>
            <CardDescription>
              Customize your chat interface experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select
                value={settings.theme}
                onValueChange={handleThemeChange}
              >
                <SelectTrigger id="theme">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature: {settings.temperature}</Label>
              <Slider
                id="temperature"
                min={0}
                max={2}
                step={0.1}
                value={[settings.temperature]}
                onValueChange={handleTemperatureChange}
              />
              <p className="text-sm text-muted-foreground">
                Lower values make responses more deterministic, higher values make them more creative
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxTokens">Max Tokens: {settings.maxTokens}</Label>
              <Slider
                id="maxTokens"
                min={100}
                max={8000}
                step={100}
                value={[settings.maxTokens]}
                onValueChange={handleMaxTokensChange}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="streamResponse">Stream Response</Label>
                <p className="text-sm text-muted-foreground">
                  Show responses as they are generated
                </p>
              </div>
              <Switch
                id="streamResponse"
                checked={settings.streamResponse}
                onCheckedChange={(checked) => settings.updateSettings({ streamResponse: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="saveHistory">Save Chat History</Label>
                <p className="text-sm text-muted-foreground">
                  Save your chat history locally
                </p>
              </div>
              <Switch
                id="saveHistory"
                checked={settings.saveHistory}
                onCheckedChange={(checked) => settings.updateSettings({ saveHistory: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoSendCode">Auto-send Code Blocks</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically send code blocks when detected
                </p>
              </div>
              <Switch
                id="autoSendCode"
                checked={settings.autoSendCode}
                onCheckedChange={(checked) => settings.updateSettings({ autoSendCode: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reset Settings</CardTitle>
            <CardDescription>
              Reset all settings to their default values
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="destructive" 
              onClick={() => {
                settings.resetSettings();
                toast.success("Settings reset to default values");
              }}
            >
              Reset All Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 