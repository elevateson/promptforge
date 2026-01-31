import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const templates = [
  { name: "SaaS MVP", icon: "🚀", description: "Full-stack application starter" },
  { name: "Landing Page", icon: "📄", description: "High-converting marketing page" },
  { name: "Mobile App", icon: "📱", description: "React Native or Flutter app" },
  { name: "REST API", icon: "🔌", description: "Backend API architecture" },
  { name: "Marketing Copy", icon: "✍️", description: "Compelling sales content" },
  { name: "Documentation", icon: "📚", description: "Technical docs and guides" },
];

const features = [
  {
    title: "Guided Wizard",
    description: "Step-by-step questions transform your rough idea into a structured, detailed prompt.",
    icon: "🧙‍♂️",
  },
  {
    title: "Live Testing",
    description: "Connect your OpenAI, Claude, or Gemini API keys and test prompts instantly.",
    icon: "⚡",
  },
  {
    title: "Template Library",
    description: "Start from proven templates for apps, APIs, content, and more.",
    icon: "📋",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <span className="text-xl font-bold text-white">PromptForge</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/templates" className="text-slate-400 hover:text-white transition-colors">
              Templates
            </Link>
            <Link href="/login">
              <Button variant="ghost" className="text-slate-400 hover:text-white">
                Log in
              </Button>
            </Link>
            <Link href="/wizard">
              <Button className="bg-violet-600 hover:bg-violet-700">
                Start Building →
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-24 text-center">
        <Badge className="mb-4 bg-violet-600/20 text-violet-400 border-violet-600/30">
          AI-Powered Prompt Engineering
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Turn rough ideas into
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">
            perfect prompts
          </span>
        </h1>
        <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
          Describe what you want to build. Our AI-powered wizard creates detailed, 
          production-ready prompts that get exceptional results from ChatGPT, Claude, and more.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/wizard">
            <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-lg px-8 py-6">
              Start Building — Free
            </Button>
          </Link>
          <Link href="/templates">
            <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 text-lg px-8 py-6">
              Browse Templates
            </Button>
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-violet-600/20 text-violet-400 flex items-center justify-center text-xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-white font-semibold mb-2">Describe</h3>
            <p className="text-slate-400 text-sm">
              Tell us what you want to build in plain English
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-violet-600/20 text-violet-400 flex items-center justify-center text-xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-white font-semibold mb-2">Enhance</h3>
            <p className="text-slate-400 text-sm">
              AI structures and enhances your prompt with best practices
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-violet-600/20 text-violet-400 flex items-center justify-center text-xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-white font-semibold mb-2">Test & Use</h3>
            <p className="text-slate-400 text-sm">
              Test with your AI, iterate, and export perfect prompts
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Everything you need to craft perfect prompts
        </h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature) => (
            <Card key={feature.title} className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <div className="text-4xl mb-2">{feature.icon}</div>
                <CardTitle className="text-white">{feature.title}</CardTitle>
                <CardDescription className="text-slate-400">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Templates Preview */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-4">
          Start from proven templates
        </h2>
        <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
          Don&apos;t start from scratch. Use battle-tested templates for common use cases.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
          {templates.map((template) => (
            <Card 
              key={template.name} 
              className="bg-slate-900/50 border-slate-800 hover:border-violet-600/50 transition-colors cursor-pointer"
            >
              <CardContent className="p-4 text-center">
                <div className="text-3xl mb-2">{template.icon}</div>
                <div className="text-white font-medium text-sm">{template.name}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/templates">
            <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
              View All Templates →
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-24">
        <Card className="bg-gradient-to-r from-violet-600/20 to-blue-600/20 border-violet-600/30 max-w-3xl mx-auto">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to build better prompts?
            </h2>
            <p className="text-slate-300 mb-8">
              Join developers and creators who ship faster with better AI outputs.
            </p>
            <Link href="/wizard">
              <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-lg px-8">
                Start Building — It&apos;s Free
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2026 PromptForge. Built with ❤️ for the AI community.</p>
        </div>
      </footer>
    </div>
  );
}
