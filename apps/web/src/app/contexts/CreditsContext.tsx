// app/contexts/CreditsContext.tsx
"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { useAccount } from "wagmi";
import { getUserCreditsAction } from "@/app/actions/db";

interface CreditsContextType {
  credits: number | null;
  refreshCredits: () => Promise<void>;
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

export const CreditsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [credits, setCredits] = useState<number | null>(null);
  const { address } = useAccount();

  const refreshCredits = async () => {
    if (address) {
      try {
        const { credits } = await getUserCreditsAction(address);
        setCredits(credits);
      } catch (error) {
        console.error("Failed to fetch credits:", error);
      }
    }
  };

  useEffect(() => {
    refreshCredits();
  }, [address]);

  return (
    <CreditsContext.Provider value={{ credits, refreshCredits }}>
      {children}
    </CreditsContext.Provider>
  );
};

export const useCredits = () => {
  const context = useContext(CreditsContext);
  if (context === undefined) {
    throw new Error("useCredits must be used within a CreditsProvider");
  }
  return context;
};
