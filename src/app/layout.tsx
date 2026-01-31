import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PromptForge - AI-Powered Prompt Builder",
  description: "Turn rough ideas into perfect prompts. Create detailed, production-ready prompts that get exceptional results from ChatGPT, Claude, and more.",
  keywords: ["AI", "prompt engineering", "ChatGPT", "Claude", "prompt builder", "AI tools"],
  authors: [{ name: "PromptForge" }],
  openGraph: {
    title: "PromptForge - AI-Powered Prompt Builder",
    description: "Turn rough ideas into perfect prompts",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased bg-slate-950 text-white`}>
        {children}
      </body>
    </html>
  );
}
