import type { Metadata } from "next";
import "@/styles/globals.css";
import { content } from "@/lib/content";
import { TopBar } from "@/components/chrome/TopBar";
import { Footer } from "@/components/chrome/Footer";
import { ResetBoundary } from "@/components/chrome/ResetBoundary";

export const metadata: Metadata = {
  title: `AION Green IT — ${content.meta.title}`,
  description:
    "E-waste and carbon accounting in IT — the learner working companion for Module 2, Day 3.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-paper">
        <TopBar />
        <main className="mx-auto w-full max-w-[1100px] flex-1 px-4 md:px-6">
          <ResetBoundary>{children}</ResetBoundary>
        </main>
        <Footer />
      </body>
    </html>
  );
}
