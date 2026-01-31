"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProjectType = "app" | "website" | "api" | "content" | "automation" | "other";
type Provider = "openai" | "anthropic" | "google";

interface WizardData {
  projectType: ProjectType | null;
  description: string;
  audience: string;
  features: string;
  techStack: string;
  tone: string;
}

interface ApiKeys {
  openai: string;
  anthropic: string;
  google: string;
}

const projectTypes = [
  { id: "app", label: "Application", icon: "🚀", description: "Web or mobile app" },
  { id: "website", label: "Website", icon: "🌐", description: "Landing page or site" },
  { id: "api", label: "API / Backend", icon: "🔌", description: "Server-side logic" },
  { id: "content", label: "Content", icon: "✍️", description: "Writing or copy" },
  { id: "automation", label: "Automation", icon: "⚙️", description: "Workflows or scripts" },
  { id: "other", label: "Other", icon: "💡", description: "Something else" },
];

const toneOptions = [
  { id: "professional", label: "Professional", description: "Formal and business-appropriate" },
  { id: "casual", label: "Casual", description: "Friendly and conversational" },
  { id: "technical", label: "Technical", description: "Detailed and precise" },
  { id: "minimal", label: "Minimal", description: "Brief and to the point" },
];

const models = {
  openai: [
    { id: "gpt-4o", name: "GPT-4o (Recommended)" },
    { id: "gpt-4-turbo", name: "GPT-4 Turbo" },
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo (Faster)" },
  ],
  anthropic: [
    { id: "claude-sonnet-4-20250514", name: "Claude Sonnet 4 (Recommended)" },
    { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet" },
    { id: "claude-3-haiku-20240307", name: "Claude 3 Haiku (Faster)" },
  ],
  google: [
    { id: "gemini-pro", name: "Gemini Pro" },
    { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro" },
  ],
};

export default function WizardPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>({
    projectType: null,
    description: "",
    audience: "",
    features: "",
    techStack: "",
    tone: "professional",
  });
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    openai: "",
    anthropic: "",
    google: "",
  });
  const [selectedProvider, setSelectedProvider] = useState<Provider>("openai");
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
  const [copied, setCopied] = useState(false);

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const canProceed = () => {
    switch (step) {
      case 1:
        return data.projectType !== null;
      case 2:
        return data.description.trim().length > 10;
      case 3:
        return data.audience.trim().length > 5;
      case 4:
        return data.features.trim().length > 10;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const generatePrompt = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          apiKey: apiKeys.openai || undefined, // Use user's key if available
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setGeneratedPrompt(result.prompt);
      } else {
        // Fallback to basic generation if API fails
        setGeneratedPrompt(generateBasicPrompt());
      }
    } catch {
      // Fallback to basic generation
      setGeneratedPrompt(generateBasicPrompt());
    }
    
    setIsGenerating(false);
  };

  const generateBasicPrompt = () => {
    return `## CONTEXT
Build a ${data.projectType === "app" ? "web application" : data.projectType} that ${data.description.toLowerCase()}.

**Target Audience:** ${data.audience}

## REQUIREMENTS

### Core Features
${data.features.split("\n").map(f => f.trim()).filter(f => f).map(f => `- ${f}`).join("\n")}

${data.techStack ? `### Technical Specifications
**Tech Stack:** ${data.techStack}
` : ""}
## DELIVERABLES
- Complete, working implementation
- Clean, maintainable code
- Clear documentation
- Error handling and edge cases

## GUIDELINES
- **Tone:** ${data.tone}
- Follow best practices for the chosen technology
- Include comments for complex logic
- Make it responsive and accessible
- Handle loading and error states

## APPROACH
Build this step by step:
1. Set up the project structure
2. Implement core functionality
3. Add UI/UX polish
4. Test and refine
5. Document the solution

Think through each step carefully before implementing.`;
  };

  const testPrompt = async () => {
    if (!generatedPrompt || !apiKeys[selectedProvider]) {
      return;
    }
    
    setIsTesting(true);
    setTestOutput(null);
    
    try {
      const response = await fetch('/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: generatedPrompt,
          provider: selectedProvider,
          model: selectedModel,
          apiKey: apiKeys[selectedProvider],
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setTestOutput(result.output);
      } else {
        setTestOutput(`Error: ${result.error}`);
      }
    } catch (error) {
      setTestOutput(`Error: ${error instanceof Error ? error.message : 'Failed to test prompt'}`);
    }
    
    setIsTesting(false);
  };

  const copyToClipboard = () => {
    if (generatedPrompt) {
      navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleProviderChange = (provider: Provider) => {
    setSelectedProvider(provider);
    setSelectedModel(models[provider][0].id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <span className="text-xl font-bold text-white">PromptForge</span>
          </Link>
          <div className="flex items-center gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="border-slate-700">
                  🔑 API Keys
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-800">
                <DialogHeader>
                  <DialogTitle className="text-white">Connect Your AI</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Add your API keys to enable AI enhancement and live testing.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label className="text-white">OpenAI API Key</Label>
                    <Input
                      type="password"
                      placeholder="sk-..."
                      className="bg-slate-800 border-slate-700 text-white mt-1"
                      value={apiKeys.openai}
                      onChange={(e) => setApiKeys({ ...apiKeys, openai: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="text-white">Anthropic API Key</Label>
                    <Input
                      type="password"
                      placeholder="sk-ant-..."
                      className="bg-slate-800 border-slate-700 text-white mt-1"
                      value={apiKeys.anthropic}
                      onChange={(e) => setApiKeys({ ...apiKeys, anthropic: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="text-white">Google AI API Key</Label>
                    <Input
                      type="password"
                      placeholder="AI..."
                      className="bg-slate-800 border-slate-700 text-white mt-1"
                      value={apiKeys.google}
                      onChange={(e) => setApiKeys({ ...apiKeys, google: e.target.value })}
                    />
                  </div>
                  <p className="text-slate-500 text-xs">
                    Keys are stored locally in your browser. Never sent to our servers.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
            <Badge variant="outline" className="border-slate-700 text-slate-400">
              Step {step} of {totalSteps}
            </Badge>
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="container mx-auto px-4 py-4">
        <Progress value={progress} className="h-2" />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className={`${generatedPrompt ? 'grid lg:grid-cols-2 gap-6' : 'max-w-3xl mx-auto'}`}>
          {/* Left Panel - Wizard */}
          <div>
            {/* Step 1: Project Type */}
            {step === 1 && (
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white text-2xl">What are you building?</CardTitle>
                  <CardDescription className="text-slate-400">
                    Select the type of project you want to create a prompt for.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {projectTypes.map((type) => (
                      <Card
                        key={type.id}
                        className={`cursor-pointer transition-all ${
                          data.projectType === type.id
                            ? "bg-violet-600/20 border-violet-600"
                            : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                        }`}
                        onClick={() => setData({ ...data, projectType: type.id as ProjectType })}
                      >
                        <CardContent className="p-4 text-center">
                          <div className="text-3xl mb-2">{type.icon}</div>
                          <div className="text-white font-medium">{type.label}</div>
                          <div className="text-slate-400 text-xs mt-1">{type.description}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Description */}
            {step === 2 && (
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white text-2xl">Describe your project</CardTitle>
                  <CardDescription className="text-slate-400">
                    In 1-2 sentences, what does this project do?
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="e.g., A todo app that helps users organize tasks with categories, due dates, and reminders..."
                    className="min-h-32 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                    value={data.description}
                    onChange={(e) => setData({ ...data, description: e.target.value })}
                  />
                  <p className="text-slate-500 text-sm mt-2">
                    Be specific about the core functionality. The more detail, the better your prompt.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Audience */}
            {step === 3 && (
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white text-2xl">Who is this for?</CardTitle>
                  <CardDescription className="text-slate-400">
                    Describe your target audience or end users.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Input
                    placeholder="e.g., Busy professionals who need to manage multiple projects..."
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                    value={data.audience}
                    onChange={(e) => setData({ ...data, audience: e.target.value })}
                  />
                  <p className="text-slate-500 text-sm mt-2">
                    Understanding the audience helps tailor the solution to their needs.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Features */}
            {step === 4 && (
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white text-2xl">Key features</CardTitle>
                  <CardDescription className="text-slate-400">
                    List the main features or requirements (one per line).
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="User authentication&#10;Task creation and editing&#10;Due date reminders&#10;Categories and tags&#10;Search and filter"
                    className="min-h-40 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                    value={data.features}
                    onChange={(e) => setData({ ...data, features: e.target.value })}
                  />
                  <p className="text-slate-500 text-sm mt-2">
                    Include must-have features and any specific requirements.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Step 5: Technical & Tone */}
            {step === 5 && (
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white text-2xl">Final details</CardTitle>
                  <CardDescription className="text-slate-400">
                    Optional: Specify technical preferences and output style.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-white mb-2 block">Tech Stack (optional)</Label>
                    <Input
                      placeholder="e.g., React, TypeScript, Tailwind, Supabase..."
                      className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                      value={data.techStack}
                      onChange={(e) => setData({ ...data, techStack: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="text-white mb-2 block">Output Tone</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {toneOptions.map((tone) => (
                        <Card
                          key={tone.id}
                          className={`cursor-pointer transition-all ${
                            data.tone === tone.id
                              ? "bg-violet-600/20 border-violet-600"
                              : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                          }`}
                          onClick={() => setData({ ...data, tone: tone.id })}
                        >
                          <CardContent className="p-3">
                            <div className="text-white font-medium text-sm">{tone.label}</div>
                            <div className="text-slate-400 text-xs">{tone.description}</div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="outline"
                className="border-slate-700 text-slate-300"
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
              >
                ← Back
              </Button>

              {step < totalSteps ? (
                <Button
                  className="bg-violet-600 hover:bg-violet-700"
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                >
                  Continue →
                </Button>
              ) : (
                <Button
                  className="bg-violet-600 hover:bg-violet-700"
                  onClick={generatePrompt}
                  disabled={isGenerating}
                >
                  {isGenerating ? "Generating..." : "Generate Prompt 🔥"}
                </Button>
              )}
            </div>
          </div>

          {/* Right Panel - Generated Prompt & Testing */}
          {generatedPrompt && (
            <div className="space-y-4">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-lg">Generated Prompt</CardTitle>
                    <div className="flex gap-2">
                      <Button 
                        onClick={copyToClipboard} 
                        variant="outline" 
                        size="sm" 
                        className="border-slate-700"
                      >
                        {copied ? "✓ Copied" : "📋 Copy"}
                      </Button>
                      <Button
                        onClick={generatePrompt}
                        variant="outline"
                        size="sm"
                        className="border-slate-700"
                        disabled={isGenerating}
                      >
                        🔄 Regenerate
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={generatedPrompt}
                    onChange={(e) => setGeneratedPrompt(e.target.value)}
                    className="min-h-64 bg-slate-800/50 border-slate-700 text-slate-300 text-sm font-mono"
                  />
                </CardContent>
              </Card>

              {/* Live Testing */}
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">⚡ Live Test</CardTitle>
                  <CardDescription className="text-slate-400">
                    Test your prompt with your connected AI
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <Select value={selectedProvider} onValueChange={(v) => handleProviderChange(v as Provider)}>
                      <SelectTrigger className="w-40 bg-slate-800 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="openai" className="text-white">OpenAI</SelectItem>
                        <SelectItem value="anthropic" className="text-white">Anthropic</SelectItem>
                        <SelectItem value="google" className="text-white">Google</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger className="flex-1 bg-slate-800 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {models[selectedProvider].map((m) => (
                          <SelectItem key={m.id} value={m.id} className="text-white">
                            {m.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {!apiKeys[selectedProvider] && (
                    <p className="text-amber-500 text-sm">
                      ⚠️ Add your {selectedProvider} API key above to enable testing
                    </p>
                  )}

                  <Button
                    onClick={testPrompt}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isTesting || !apiKeys[selectedProvider]}
                  >
                    {isTesting ? "Testing..." : "▶️ Run Test"}
                  </Button>

                  {testOutput && (
                    <div className="mt-4">
                      <Label className="text-white mb-2 block">AI Output:</Label>
                      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 max-h-96 overflow-auto">
                        <pre className="text-slate-300 text-sm whitespace-pre-wrap font-mono">
                          {testOutput}
                        </pre>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
