import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/ui/Header";

export const metadata: Metadata = {
  title: "AI Database Analyzer",
  description: "Analyze your database with AI-powered insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="min-h-[calc(100vh-64px)]">{children}</main>
      </body>
    </html>
  );
}
