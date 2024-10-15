import type { Metadata } from "next";

import "../styles/globals.css";
import { cn } from "@/lib/utils";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/toaster"

import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})
export const metadata: Metadata = {
  title: "Build Xpert",
  description: "Find the best service provider for your needs.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexClientProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn("font-sans antialiased", inter.variable)}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow pt-16">{children}</main>
              <Toaster />
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ConvexClientProvider>
  );
}