import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { BookOpen, Brain, Search, Sparkles, Zap } from "lucide-react";
import { useState } from "react";
import Header from "./header";

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
      <Header />
      <main className="flex-grow p-6 space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <BookOpen className="mr-2" /> Top Tutors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                name: "Math Maestro",
                by: "@mathwhiz",
                desc: "Cracking complex calculations with ease!",
                views: "101.8k",
              },
              {
                name: "History Hero",
                by: "@timetravel",
                desc: "Journey through time with fascinating facts",
                views: "163.0m",
              },
              {
                name: "Science Sage",
                by: "@labgenius",
                desc: "Exploring the wonders of the universe",
                views: "99.1m",
              },
              {
                name: "Language Guru",
                by: "@polyglot",
                desc: "Master new languages in record time",
                views: "11.1k",
              },
            ].map(
              (
                tutor: {
                  name: string;
                  by: string;
                  desc: string;
                  views: string;
                },
                index: number
              ) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  whileHover="hover"
                  onHoverStart={() => setHoveredCard(index)}
                  onHoverEnd={() => setHoveredCard(null)}
                >
                  <Card className="bg-white bg-opacity-20 backdrop-blur-md border-none">
                    <CardContent className="p-4 flex items-start space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage
                          src={`/placeholder.svg?height=64&width=64`}
                        />
                        <AvatarFallback>{tutor.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold text-lg">{tutor.name}</h3>
                        <p className="text-sm text-purple-200">By {tutor.by}</p>
                        <p className="text-sm mt-1">{tutor.desc}</p>
                        <p className="text-xs text-purple-200 mt-2">
                          {tutor.views} students
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            )}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Zap className="mr-2" /> Quick Study Sessions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Math Blitz",
                user: "@quickmath",
                sessions: "33.6k",
                likes: "10.3k",
                topics: [
                  "Algebra in 5 minutes",
                  "Geometry shortcuts",
                  "Mental math tricks",
                ],
              },
              {
                title: "History Highlights",
                user: "@timewarp",
                sessions: "39.0k",
                likes: "4,676",
                topics: [
                  "Ancient civilizations crash course",
                  "Modern history in memes",
                  "Historical 'what ifs'",
                ],
              },
              {
                title: "Science Snacks",
                user: "@labrat",
                sessions: "63.8k",
                likes: "6,821",
                topics: [
                  "Mind-blowing physics facts",
                  "Biology hacks for everyday life",
                  "Chemistry experiments you can do at home",
                ],
              },
            ].map(
              (
                topic: {
                  title: string;
                  user: string;
                  sessions: string;
                  likes: string;
                  topics: string[];
                },
                index: number
              ) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  whileHover="hover"
                  onHoverStart={() => setHoveredCard(index + 4)}
                  onHoverEnd={() => setHoveredCard(null)}
                >
                  <Card className="bg-white bg-opacity-20 backdrop-blur-md border-none">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage
                            src={`/placeholder.svg?height=32&width=32`}
                          />
                          <AvatarFallback>{topic.title[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-bold">{topic.title}</h3>
                          <p className="text-xs text-purple-200">
                            {topic.user} • {topic.sessions} sessions •{" "}
                            {topic.likes} likes
                          </p>
                        </div>
                      </div>
                      <ul className="space-y-1">
                        {topic.topics.map((t: string, i: number) => (
                          <li key={i} className="text-sm flex items-center">
                            <Zap className="w-4 h-4 mr-1 text-yellow-300" /> {t}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            )}
          </div>
        </section>

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
