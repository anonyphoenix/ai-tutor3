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
import { CreditsProvider } from "./contexts/CreditsContext";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Create Wagmi",
  description: "Generated by create-wagmi",
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
            <CreditsProvider>
              <Header />
              {props.children}
            </CreditsProvider>
          </AppKitProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
