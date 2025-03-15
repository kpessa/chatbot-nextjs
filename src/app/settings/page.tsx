"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useSettings } from "@/lib/stores/settings";
import { toast } from "sonner";

const API_PROVIDERS = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  deepseek: "DeepSeek",
} as const;

export default function SettingsPage() {
  const router = useRouter();
  const settings = useSettings();

  const handleApiKeyChange = (provider: keyof typeof API_PROVIDERS, value: string) => {
    if (value === "") {
      settings.removeApiKey(provider);
    } else {
      settings.setApiKey(provider, value);
    }
  };

  const handleSave = () => {
    toast.success("Settings saved successfully");
    router.back();
  };

  return (
    <div className="container max-w-3xl py-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()} 
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
                <Label htmlFor={`${provider}ApiKey`}>{label} API Key</Label>
                <Input
                  id={`${provider}ApiKey`}
                  type="password"
                  value={settings.apiKeys[provider as keyof typeof API_PROVIDERS] || ""}
                  onChange={(e) => handleApiKeyChange(provider as keyof typeof API_PROVIDERS, e.target.value)}
                  placeholder={`Enter your ${label} API key`}
                />
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
                onValueChange={(value: 'light' | 'dark' | 'system') => settings.updateSettings({ theme: value })}
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
                onValueChange={(value) => settings.updateSettings({ temperature: value[0] })}
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
                onValueChange={(value) => settings.updateSettings({ maxTokens: value[0] })}
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