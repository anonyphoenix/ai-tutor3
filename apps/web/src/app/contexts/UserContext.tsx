// app/contexts/UserContext.tsx
"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { useAccount } from "wagmi";
import { getUserCreditsAction, getUserAction } from "@/app/actions/db";

interface UserType {
  address: string;
  lastActive: Date;
  totalCredits: number;
  xp: string;
}

interface UserContextType {
  credits: number | null;
  user: UserType | null;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [credits, setCredits] = useState<number | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const { address } = useAccount();

  const refreshUser = async () => {
    if (address) {
      try {
        const { credits: creditsData } = await getUserCreditsAction(address);
        const userData = await getUserAction(address);
        setCredits(creditsData);
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    }
  };

  useEffect(() => {
    refreshUser();
  }, [address]);

  return (
    <UserContext.Provider value={{ credits, user, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
