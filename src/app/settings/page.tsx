"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

// Define the settings interface
interface Settings {
  apiKey: string;
  theme: string;
  temperature: number;
  maxTokens: number;
  streamResponse: boolean;
  saveHistory: boolean;
  autoSendCode: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<Settings>({
    apiKey: "",
    theme: "system",
    temperature: 0.7,
    maxTokens: 2000,
    streamResponse: true,
    saveHistory: true,
    autoSendCode: false,
  });

  const handleChange = (field: keyof Settings, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // In a real app, we would save these settings to localStorage or a backend
    console.log("Saving settings:", settings);
    
    // Show a success message (in a real app, use a toast notification)
    alert("Settings saved successfully!");
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

      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>
            Configure your API settings for the chat interface
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={settings.apiKey}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("apiKey", e.target.value)}
              placeholder="Enter your API key"
            />
            <p className="text-sm text-muted-foreground">
              Your API key is stored locally and never sent to our servers
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select
              value={settings.theme}
              onValueChange={(value: string) => handleChange("theme", value)}
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
              onValueChange={(value: number[]) => handleChange("temperature", value[0])}
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
              onValueChange={(value: number[]) => handleChange("maxTokens", value[0])}
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
              onCheckedChange={(checked: boolean) => handleChange("streamResponse", checked)}
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
              onCheckedChange={(checked: boolean) => handleChange("saveHistory", checked)}
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
              onCheckedChange={(checked: boolean) => handleChange("autoSendCode", checked)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 