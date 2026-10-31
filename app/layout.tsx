import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { TestModeBadge } from "@/components/TestModeBadge";

export const metadata: Metadata = {
  title: "PromptWear — AI Custom Apparel Marketplace",
  description: "Describe apparel with AI, fit to your measurements, and buy or publish.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("theme")==="light"){var d=document.documentElement;d.classList.remove("dark");d.classList.add("light")}}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-zinc-100 antialiased selection:bg-primary selection:text-black">
        <TestModeBadge />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
