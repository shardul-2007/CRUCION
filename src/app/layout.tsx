import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CrucionStoreProvider } from "@/lib/store";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CRUCION — Universal Software Engineering Ecosystem",
  description:
    "One Container. Every Technology. From Idea to Enterprise. Unified engineering command center, autonomous AgentOS, microVM cloud platform, and zero-downtime canary pipelines.",
  keywords: [
    "CRUCION",
    "Universal Container",
    "Software Engineering",
    "AgentOS",
    "MicroVM Cloud",
    "DevOps",
    "Enterprise AI",
  ],
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-white text-slate-900 antialiased selection:bg-[#0284c7]/20 selection:text-slate-900">
        <CrucionStoreProvider>
          {children}
        </CrucionStoreProvider>
      </body>
    </html>
  );
}
