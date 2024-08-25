"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Confetti from "react-confetti";
import { useSearchParams } from "next/navigation";
import { quizDatas } from "@/utils/constants/quiz";

export default function Component() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [quizEnded, setQuizEnded] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const searchParams = useSearchParams();
  const quizId = Number(searchParams.get("id"));

  const quizData =
    quizDatas.find((quiz) => quiz.id === quizId)?.questions || [];
  console.log("🚀 ~ Component ~ quizData:", quizData);

  useEffect(() => {
    if (timeLeft > 0 && !quizEnded) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setQuizEnded(true);
    }
  }, [timeLeft, quizEnded]);

  useEffect(() => {
    if (quizEnded && correctAnswers === quizData.length) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000); // Stop confetti after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [quizEnded, correctAnswers, quizData.length]);

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === quizData[currentQuestion]?.correctAnswer) {
      setCorrectAnswers(correctAnswers + 1);
    }
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setQuizEnded(true);
    }
  };

  const handlePlayAgain = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setTimeLeft(60);
    setQuizEnded(false);
    setCorrectAnswers(0);
    setShowConfetti(false);
  };

  const mintNFTCredential = () => {
    console.log("Minting NFT credential...");
  };

  // Early return if quizData is empty
  if (quizData.length === 0) {
    return <div>No quiz data available.</div>;
  }

  return (
    <>
      {showConfetti && <Confetti />}
      <div className="pt-10">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">
              Awesome Quiz Application
            </CardTitle>
            {!quizEnded && (
              <div className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
                Time Left {timeLeft}
              </div>
            )}
          </CardHeader>
          <CardContent>
            {!quizEnded ? (
              <>
                <h2 className="text-xl font-semibold mb-4">
                  {currentQuestion + 1}. {quizData[currentQuestion].question}
                </h2>
                <div className="space-y-2">
                  {quizData[currentQuestion].options.map((option, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedAnswer === index
                          ? "bg-green-100 dark:bg-green-800"
                          : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => handleAnswerSelect(index)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {currentQuestion + 1} of {quizData.length} Questions
                  </div>
                  <Button
                    onClick={handleNextQuestion}
                    disabled={selectedAnswer === null}
                  >
                    {currentQuestion === quizData.length - 1
                      ? "Finish"
                      : "Next Question"}
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Quiz Ended!</h2>
                <p className="mb-4">
                  You got {correctAnswers} out of {quizData.length} questions
                  correct.
                </p>
                {correctAnswers === quizData.length ? (
                  <div className="mb-4">
                    <p className="text-green-600 font-semibold mb-2">
                      Congratulations! You answered all questions correctly!
                    </p>
                    <Button onClick={mintNFTCredential}>
                      Mint NFT Credential
                    </Button>
                  </div>
                ) : (
                  <p className="text-yellow-600 mb-4">
                    Keep practicing to improve your score!
                  </p>
                )}
                <Button onClick={handlePlayAgain}>Play Again</Button>
              </div>
            )}
          </CardContent>
          {!quizEnded && (
            <Progress
              value={((currentQuestion + 1) / quizData.length) * 100}
              className="mt-4"
            />
          )}
        </Card>
      </div>
    </>
  );
}
