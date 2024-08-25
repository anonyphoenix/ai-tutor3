"use client";

import { useUserContext } from "@/app/contexts/UserContext";
import { Coins, Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { Button } from "./ui/button";
import XpBar from "./xp-bar";

interface HeaderProps {
  // Add any props you want to pass to the Header component
}

const Header = (props: HeaderProps) => {
  const { address } = useAccount();
  const { credits, user } = useUserContext();

  return (
    <header className="fixed z-50 top-0 left-0 w-full flex justify-between items-center p-4 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="flex items-center">
        <Link href="/" passHref>
          <div className="text-2xl font-bold flex items-center cursor-pointer mr-6">
            <Sparkles className="mr-2" />
            AI Tutor
          </div>
        </Link>
        <nav className="flex items-center space-x-4">
          {address && <XpBar xp={user?.xp ?? "0"} />}
          <Link href="/resume" passHref>
            <Button variant="link">Resume Builder</Button>
          </Link>
          <Link href="/select-quiz" passHref>
            <Button variant="link">Quiz</Button>
          </Link>
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <Link href="/credits" passHref>
            {address ? (
              <Button variant="outline" size="sm" className="flex items-center">
                <Plus className="h-4 w-4 mr-1" />
                <span className="font-semibold ml-4 mr-2">
                  {credits ?? "Loading..."}
                </span>
                <Coins className="text-yellow-400 w-4" />
              </Button>
            ) : (
              <span className="font-semibold ml-4 mr-2">
                {/* Connect First */}
              </span>
            )}
          </Link>
        </div>
        <w3m-button />
      </div>
    </header>
  );
};

export default Header;
