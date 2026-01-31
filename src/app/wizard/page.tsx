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

type ProjectType = "app" | "website" | "api" | "content" | "automation" | "other";

interface WizardData {
  projectType: ProjectType | null;
  description: string;
  audience: string;
  features: string;
  techStack: string;
  tone: string;
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

  const generatePrompt = () => {
    setIsGenerating(true);
    
    // Simulate generation (will be replaced with AI enhancement)
    setTimeout(() => {
      const prompt = `## CONTEXT
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

      setGeneratedPrompt(prompt);
      setIsGenerating(false);
    }, 1500);
  };

  const copyToClipboard = () => {
    if (generatedPrompt) {
      navigator.clipboard.writeText(generatedPrompt);
    }
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
          <Badge variant="outline" className="border-slate-700 text-slate-400">
            Step {step} of {totalSteps}
          </Badge>
        </div>
      </header>

      {/* Progress */}
      <div className="container mx-auto px-4 py-4">
        <Progress value={progress} className="h-2" />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-3xl">
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

        {/* Generated Prompt */}
        {generatedPrompt && (
          <Card className="bg-slate-900/50 border-slate-800 mt-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-xl">Your Generated Prompt</CardTitle>
                <Button onClick={copyToClipboard} variant="outline" size="sm" className="border-slate-700">
                  📋 Copy
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="bg-slate-800/50 p-4 rounded-lg text-slate-300 text-sm whitespace-pre-wrap overflow-x-auto">
                {generatedPrompt}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
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
              disabled={isGenerating || generatedPrompt !== null}
            >
              {isGenerating ? "Generating..." : generatedPrompt ? "Generated ✓" : "Generate Prompt 🔥"}
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
