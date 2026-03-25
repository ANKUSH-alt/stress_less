import type { Metadata } from "next";
import "./globals.css";
import BackgroundGlows from "@/components/shared/BackgroundGlows";
import Navigation from "@/components/layout/Navigation";

export const metadata: Metadata = {
  title: "StressLess - AI-Powered Intelligent Stress Companion",
  description: "A world-class, human-centered stress management platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased selection:bg-primary/30">
        <BackgroundGlows />
        <div className="relative min-h-screen flex flex-col md:flex-row">
          <Navigation />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 pb-24 md:pb-12 overflow-x-hidden">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
