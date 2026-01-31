"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  variables: { name: string; label: string; placeholder: string }[];
  basePrompt: string;
  useCount: number;
}

const templates: Template[] = [
  {
    id: "saas-mvp",
    name: "SaaS MVP Builder",
    description: "Build a complete SaaS application from scratch with auth, billing, and core features",
    category: "Development",
    icon: "🚀",
    variables: [
      { name: "appName", label: "App Name", placeholder: "e.g., TaskFlow" },
      { name: "coreProblem", label: "Problem it Solves", placeholder: "e.g., Team task management is chaotic" },
      { name: "targetUser", label: "Target User", placeholder: "e.g., Small team leads" },
      { name: "keyFeatures", label: "Key Features (one per line)", placeholder: "Task boards\nTeam collaboration\nDeadline tracking" },
    ],
    basePrompt: `Build a SaaS MVP called "{{appName}}" that solves: {{coreProblem}}

Target User: {{targetUser}}

Key Features:
{{keyFeatures}}

Requirements:
- User authentication (email/password + OAuth)
- Subscription billing with Stripe
- Clean, modern UI with dark mode
- Mobile responsive
- Fast and performant

Tech Stack: Next.js 14, TypeScript, Tailwind CSS, Supabase, Stripe

Build this step by step with production-quality code.`,
    useCount: 2847,
  },
  {
    id: "landing-page",
    name: "Landing Page Creator",
    description: "High-converting landing page with hero, features, testimonials, and CTA",
    category: "Development",
    icon: "📄",
    variables: [
      { name: "productName", label: "Product Name", placeholder: "e.g., PromptForge" },
      { name: "headline", label: "Main Headline", placeholder: "e.g., Turn ideas into perfect prompts" },
      { name: "valueProps", label: "Value Propositions (one per line)", placeholder: "Save hours\nBetter results\nEasy to use" },
      { name: "cta", label: "Call to Action", placeholder: "e.g., Start Free Trial" },
    ],
    basePrompt: `Create a high-converting landing page for "{{productName}}"

Headline: {{headline}}

Value Propositions:
{{valueProps}}

CTA: {{cta}}

Sections needed:
1. Hero with headline, subheadline, and CTA button
2. Social proof / logos
3. Features grid (3-6 features)
4. How it works (3 steps)
5. Testimonials (3 quotes)
6. Pricing (if applicable)
7. FAQ
8. Final CTA

Design: Modern, clean, dark mode, purple/blue accents
Tech: Next.js, Tailwind CSS, Framer Motion for animations
Make it fast, accessible, and mobile-first.`,
    useCount: 1923,
  },
  {
    id: "rest-api",
    name: "REST API Architect",
    description: "Design and build a complete REST API with authentication and documentation",
    category: "Development",
    icon: "🔌",
    variables: [
      { name: "apiName", label: "API Name", placeholder: "e.g., Inventory API" },
      { name: "resources", label: "Resources (one per line)", placeholder: "Products\nOrders\nCustomers" },
      { name: "authType", label: "Authentication Type", placeholder: "e.g., JWT, API Keys, OAuth" },
    ],
    basePrompt: `Design and build a REST API called "{{apiName}}"

Resources:
{{resources}}

Authentication: {{authType}}

Requirements:
- RESTful endpoints (GET, POST, PUT, DELETE)
- Input validation
- Error handling with proper HTTP status codes
- Rate limiting
- API documentation (OpenAPI/Swagger)
- Database schema
- Authentication middleware

Include:
- Endpoint documentation
- Request/response examples
- Error response formats
- Database migrations`,
    useCount: 1456,
  },
  {
    id: "mobile-app",
    name: "Mobile App Designer",
    description: "Design a mobile app with screens, navigation, and user flows",
    category: "Development",
    icon: "📱",
    variables: [
      { name: "appName", label: "App Name", placeholder: "e.g., FitTrack" },
      { name: "appPurpose", label: "App Purpose", placeholder: "e.g., Track workouts and nutrition" },
      { name: "mainScreens", label: "Main Screens (one per line)", placeholder: "Home\nWorkout\nProgress\nProfile" },
    ],
    basePrompt: `Design a mobile app called "{{appName}}"

Purpose: {{appPurpose}}

Main Screens:
{{mainScreens}}

Requirements:
- Native feel (iOS and Android)
- Smooth navigation and transitions
- Offline support
- Push notifications
- User authentication
- Data sync

Tech: React Native or Flutter
Include wireframes, component breakdown, and navigation flow.`,
    useCount: 1289,
  },
  {
    id: "marketing-copy",
    name: "Marketing Copy Generator",
    description: "Generate compelling marketing copy for emails, ads, and social media",
    category: "Content",
    icon: "✍️",
    variables: [
      { name: "product", label: "Product/Service", placeholder: "e.g., AI writing assistant" },
      { name: "audience", label: "Target Audience", placeholder: "e.g., Content marketers" },
      { name: "tone", label: "Tone", placeholder: "e.g., Professional but friendly" },
      { name: "goal", label: "Goal", placeholder: "e.g., Drive free trial signups" },
    ],
    basePrompt: `Write marketing copy for: {{product}}

Target Audience: {{audience}}
Tone: {{tone}}
Goal: {{goal}}

Create:
1. Email sequence (3 emails: welcome, value, conversion)
2. Social media posts (5 posts for different platforms)
3. Ad copy (Facebook/Google - 3 variations)
4. Landing page copy (headline, subheadline, body)

Make it compelling, benefit-focused, and action-oriented.
Include clear CTAs in each piece.`,
    useCount: 2156,
  },
  {
    id: "technical-docs",
    name: "Technical Documentation",
    description: "Create comprehensive technical documentation for your project",
    category: "Content",
    icon: "📚",
    variables: [
      { name: "projectName", label: "Project Name", placeholder: "e.g., PaymentAPI" },
      { name: "projectType", label: "Project Type", placeholder: "e.g., REST API, SDK, Library" },
      { name: "audience", label: "Documentation Audience", placeholder: "e.g., Backend developers" },
    ],
    basePrompt: `Create technical documentation for "{{projectName}}"

Type: {{projectType}}
Audience: {{audience}}

Include:
1. Getting Started guide
2. Installation instructions
3. Quick start tutorial
4. API reference (if applicable)
5. Code examples
6. Configuration options
7. Troubleshooting guide
8. FAQ
9. Changelog format

Style: Clear, concise, developer-friendly
Include code snippets with syntax highlighting.`,
    useCount: 987,
  },
  {
    id: "database-schema",
    name: "Database Schema Designer",
    description: "Design a complete database schema with relationships and indexes",
    category: "Development",
    icon: "🗄️",
    variables: [
      { name: "appName", label: "Application Name", placeholder: "e.g., E-commerce Platform" },
      { name: "entities", label: "Main Entities (one per line)", placeholder: "Users\nProducts\nOrders\nReviews" },
      { name: "dbType", label: "Database Type", placeholder: "e.g., PostgreSQL, MongoDB" },
    ],
    basePrompt: `Design a database schema for "{{appName}}"

Entities:
{{entities}}

Database: {{dbType}}

Include:
- Complete table/collection definitions
- Data types and constraints
- Primary and foreign keys
- Indexes for performance
- Relationships (1:1, 1:N, N:N)
- Migration scripts
- Seed data examples

Consider:
- Normalization
- Query patterns
- Scalability
- Data integrity`,
    useCount: 1567,
  },
  {
    id: "automation-workflow",
    name: "Automation Workflow",
    description: "Design automated workflows for business processes",
    category: "Automation",
    icon: "⚙️",
    variables: [
      { name: "workflowName", label: "Workflow Name", placeholder: "e.g., Lead Nurturing" },
      { name: "trigger", label: "Trigger Event", placeholder: "e.g., New form submission" },
      { name: "steps", label: "Workflow Steps (one per line)", placeholder: "Send welcome email\nAdd to CRM\nAssign to sales rep" },
    ],
    basePrompt: `Design an automation workflow: "{{workflowName}}"

Trigger: {{trigger}}

Steps:
{{steps}}

Include:
- Detailed step-by-step flow
- Conditional logic (if/then)
- Error handling
- Retry logic
- Notifications
- Logging

Tools: Consider Zapier, n8n, or custom implementation
Provide the workflow diagram and implementation details.`,
    useCount: 892,
  },
];

const categories = ["All", "Development", "Content", "Automation"];

export default function TemplatesPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});

  const filteredTemplates = templates.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const generateFromTemplate = () => {
    if (!selectedTemplate) return "";
    
    let prompt = selectedTemplate.basePrompt;
    Object.entries(variables).forEach(([key, value]) => {
      prompt = prompt.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    return prompt;
  };

  const copyPrompt = () => {
    const prompt = generateFromTemplate();
    navigator.clipboard.writeText(prompt);
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
          <nav className="flex items-center gap-4">
            <Link href="/wizard">
              <Button className="bg-violet-600 hover:bg-violet-700">
                Custom Wizard →
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Template Library</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Start with battle-tested templates. Fill in your details and get a production-ready prompt in seconds.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto">
          <Input
            placeholder="Search templates..."
            className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex gap-2">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                className={selectedCategory === cat 
                  ? "bg-violet-600 hover:bg-violet-700" 
                  : "border-slate-700 text-slate-300 hover:bg-slate-800"
                }
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filteredTemplates.map((template) => (
            <Card 
              key={template.id}
              className="bg-slate-900/50 border-slate-800 hover:border-violet-600/50 transition-all cursor-pointer"
              onClick={() => {
                setSelectedTemplate(template);
                setVariables({});
              }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="text-4xl mb-2">{template.icon}</div>
                  <Badge variant="outline" className="border-slate-700 text-slate-400">
                    {template.category}
                  </Badge>
                </div>
                <CardTitle className="text-white">{template.name}</CardTitle>
                <CardDescription className="text-slate-400">
                  {template.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>{template.variables.length} variables</span>
                  <span>Used {template.useCount.toLocaleString()}x</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Template Modal */}
        <Dialog open={selectedTemplate !== null} onOpenChange={() => setSelectedTemplate(null)}>
          <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedTemplate && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{selectedTemplate.icon}</span>
                    <div>
                      <DialogTitle className="text-white text-xl">
                        {selectedTemplate.name}
                      </DialogTitle>
                      <DialogDescription className="text-slate-400">
                        {selectedTemplate.description}
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                  {selectedTemplate.variables.map((v) => (
                    <div key={v.name}>
                      <label className="text-white text-sm font-medium block mb-1">
                        {v.label}
                      </label>
                      {v.placeholder.includes('\n') ? (
                        <textarea
                          className="w-full bg-slate-800/50 border border-slate-700 rounded-md p-2 text-white placeholder:text-slate-500 min-h-24"
                          placeholder={v.placeholder}
                          value={variables[v.name] || ""}
                          onChange={(e) => setVariables({ ...variables, [v.name]: e.target.value })}
                        />
                      ) : (
                        <Input
                          className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                          placeholder={v.placeholder}
                          value={variables[v.name] || ""}
                          onChange={(e) => setVariables({ ...variables, [v.name]: e.target.value })}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Preview */}
                <div className="mt-6">
                  <label className="text-white text-sm font-medium block mb-2">
                    Generated Prompt Preview
                  </label>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-md p-4 max-h-48 overflow-y-auto">
                    <pre className="text-slate-300 text-sm whitespace-pre-wrap font-mono">
                      {generateFromTemplate()}
                    </pre>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    className="flex-1 bg-violet-600 hover:bg-violet-700"
                    onClick={copyPrompt}
                  >
                    📋 Copy Prompt
                  </Button>
                  <Link href="/wizard" className="flex-1">
                    <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800">
                      🧙‍♂️ Customize in Wizard
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
