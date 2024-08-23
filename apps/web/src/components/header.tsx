"use client";

import { getUserCreditsAction } from "@/app/actions/db";
import { Coins, Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Button } from "./ui/button";
import { useCredits } from "@/app/contexts/CreditsContext";

interface HeaderProps {
  // Add any props you want to pass to the Header component
}

const Header = (props: HeaderProps) => {
  const { address } = useAccount();
  const { credits } = useCredits();

  return (
    <header className="flex justify-between items-center p-4 bg-white bg-opacity-10 backdrop-blur-md">
      <Link href="/" passHref>
        <div className="text-2xl font-bold flex items-center cursor-pointer">
          <Sparkles className="mr-2" />
          AI Tutor
        </div>
      </Link>
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <Coins className="mr-1 text-yellow-400" />
          {address ? (
            <span className="font-semibold mr-2">
              {credits ?? "Loading..."}
            </span>
          ) : (
            <span className="font-semibold mr-2">{/* Connect First */}</span>
          )}
          <Link href="/credits" passHref>
            <Button variant="outline" size="sm" className="flex items-center">
              <Plus className="h-4 w-4 mr-1" />
              Top up
            </Button>
          </Link>
        </div>
        <w3m-button />
      </div>
    </header>
  );
};

export default Header;
