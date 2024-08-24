import { fetchPublicBotsAction } from "@/app/actions/db";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BookOpen, Brain, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import Section1 from "./section1";

export default function FrontPage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const cardVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white flex flex-col">
      <main className="flex-grow p-6 space-y-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <BookOpen className="mr-2" /> Top Tutors
        </h2>
        <Section1 />

        <section className="text-center py-8">
          <div className="flex justify-center space-x-4 mb-4">
            <Brain className="text-yellow-300 w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Create Your Own AI Tutor</h2>
          <p className="text-purple-100 mb-4">
            Design a custom AI tutor tailored to your learning style and goals.
            Personalize everything from teaching methods to subject expertise!
          </p>
          <Button className="bg-white text-purple-600 hover:bg-purple-100 text-lg px-6 py-3 rounded-full">
            Create Your Tutor
          </Button>
        </section>
      </main>

      <footer className="p-4 text-center text-sm">
        <div className="flex justify-center mb-2">
          <a
            href="#"
            className="px-4 py-2 rounded-md hover:outline hover:outline-gray-200"
          >
            Learn More
          </a>
          <a
            href="#"
            className="px-4 py-2 rounded-md hover:outline hover:outline-gray-200"
          >
            Careers
          </a>
          <a
            href="#"
            className="px-4 py-2 rounded-md hover:outline hover:outline-gray-200"
          >
            Success Stories
          </a>
          <a
            href="#"
            className="px-4 py-2 rounded-md hover:outline hover:outline-gray-200"
          >
            Our Mission
          </a>
        </div>
        <div className="flex justify-center">
          <a
            href="#"
            className="px-4 py-2 rounded-md hover:outline hover:outline-gray-200"
          >
            Legal
          </a>
          <a
            href="#"
            className="px-4 py-2 rounded-md hover:outline hover:outline-gray-200"
          >
            Support
          </a>
        </div>
      </footer>
    </div>
  );
}
