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
    "One Container. Every Technology. From Idea to Enterprise. The unified high-performance engineering command center, autonomous AgentOS, and microVM cloud platform.",
  keywords: [
    "CRUCION",
    "Universal Container",
    "Software Engineering",
    "AgentOS",
    "Cloud Infrastructure",
    "MicroVM",
    "DevOps",
  ],
};

export const viewport: Viewport = {
  themeColor: "#0B0D14",
  colorScheme: "dark",
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
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} dark`}
      style={{ colorScheme: "dark" }}
    >
      <head>
        <meta name="color-scheme" content="dark" />
      </head>
      <body className="min-h-screen bg-[#0B0D14] text-slate-100 antialiased selection:bg-[#8B5CF6]/30 selection:text-white">
        <CrucionStoreProvider>
          {children}
        </CrucionStoreProvider>
      </body>
    </html>
  );
}
