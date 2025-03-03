import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import AppKitProvider from "@/providers/Web3Provider";
import { config } from "@/utils/config";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { headers } from "next/headers";
import { type ReactNode } from "react";
import { cookieToInitialState } from "wagmi";
import "./globals.css";
import { UserProvider } from "./contexts/UserContext";
import { Toaster } from "@/components/ui/toaster";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "AI Tutor",
  description: "AI-powered learning with blockchain credibility",
};

export default function RootLayout(props: { children: ReactNode }) {
  const initialState = cookieToInitialState(config, headers().get("cookie"));

  return (
    <html lang="en">
      <body
        className={cn("min-h-screen font-sans antialiased", fontSans.variable)}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AppKitProvider initialState={initialState}>
            <UserProvider>
              <Header />
              <div className="pt-20">{props.children}</div>
              <Toaster />
            </UserProvider>
          </AppKitProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
