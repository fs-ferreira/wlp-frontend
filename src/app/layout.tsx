import { ThemeProvider } from "@/components/theme-provider";
import NextAuthSessionProvider from "@/providers/sessionProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from 'sonner';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "We Love Pizza",
  description: "Micro SaaS for Pizza Restaunrants situations",
  icons: "./favicon.ico"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${inter.className} min-h-screen bg-background antialiased`}
      >
        <NextAuthSessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster
              richColors
              closeButton={true}
              toastOptions={{ duration: 3000 }}
              position="top-right" />
          </ThemeProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
