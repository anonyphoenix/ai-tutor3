"use client";

import { fetchPublicBotsAction } from "@/app/actions/db";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

type Tutor = {
  id: number;
  name: string;
  creatorAddress: string | null;
  description: string | null;
  prompt: string;
  imageUrl: string;
  likes: number;
  isPublic: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

const shortenEthAddress = (address: string | null): string => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export default function Component() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [tutors, setTutors] = useState<Tutor[]>([]);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const publicBots = await fetchPublicBotsAction();
        setTutors(publicBots);
      } catch (error) {
        console.error("Failed to fetch public bots:", error);
      }
    };

    fetchTutors();
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    const container = document.getElementById("scroll-container");
    if (container) {
      const scrollAmount = direction === "left" ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      setScrollPosition(container.scrollLeft + scrollAmount);
    }
  };

  return (
    <div className="relative">
      <div
        id="scroll-container"
        className="flex overflow-x-auto scrollbar-hide space-x-4 p-4"
      >
        {tutors.map((tutor, index) => (
          <motion.div
            key={index}
            className="flex-shrink-0 w-72"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-purple-900 text-white overflow-hidden h-96">
              <CardContent className="p-0 h-full">
                <div className="p-4 h-1/3">
                  <h3 className="font-bold text-xl mb-1">{tutor.name}</h3>
                  <p className="text-purple-300 text-sm mb-4">
                    {shortenEthAddress(tutor.creatorAddress)}
                  </p>
                </div>
                <div className="relative h-1/3">
                  <img
                    src={tutor.imageUrl}
                    alt={tutor.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-purple-500 text-white px-2 py-1 rounded-full text-xs">
                    {tutor.likes} ❤️
                  </div>
                </div>
                <div className="p-4 h-1/3">
                  <p className="text-sm">{tutor.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <button
        onClick={() => handleScroll("left")}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2"
        style={{ display: scrollPosition > 0 ? "block" : "none" }}
      >
        <ChevronLeft className="text-purple-900" />
      </button>
      <button
        onClick={() => handleScroll("right")}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2"
      >
        <ChevronRight className="text-purple-900" />
      </button>
    </div>
  );
}
