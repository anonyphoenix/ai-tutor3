"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Code, Clock, FlaskConical } from "lucide-react";
import { useRouter } from "next/navigation";

const botQuizzes = [
  {
    id: 1,
    name: "Math Maestro",
    icon: <Lightbulb className="w-6 h-6" />,
    description: "Cracking complex calculations with ease!",
  },
  {
    id: 2,
    name: "History Hero",
    icon: <Clock className="w-6 h-6" />,
    description: "Journey through time with fascinating facts",
  },
  {
    id: 3,
    name: "Science Sage",
    icon: <FlaskConical className="w-6 h-6" />,
    description: "Exploring the wonders of the universe",
  },
  {
    id: 4,
    name: "Coding Wizard",
    icon: <Code className="w-6 h-6" />,
    description: "Mastering the art of programming",
  },
];

export default function SelectQuiz() {
  const router = useRouter();

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Select Your Quiz</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {botQuizzes.map((quiz, index) => (
          <Card key={index} className="border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {quiz.icon}
                <span>{quiz.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{quiz.description}</p>
              <Button
                className="w-full"
                onClick={() => router.push(`/quiz/?id=${quiz.id}`)}
              >
                Start Quiz
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
