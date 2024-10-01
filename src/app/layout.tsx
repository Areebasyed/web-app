import type { Metadata } from "next";
import { Montserrat } from 'next/font/google'
import "../styles/globals.css";
import { cn } from "@/lib/utils";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/toaster"

const roboto =Montserrat({
  weight: '400',
  subsets: ['latin-ext'],
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
        <body className={cn("font-sans antialiased", roboto.className)}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
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