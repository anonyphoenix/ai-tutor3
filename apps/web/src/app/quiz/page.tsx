"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BASE_URL } from "@/utils/constants";
import {
  CERTIFICATE_CONTRACT_ABI,
  CERTIFICATE_CONTRACT_ADDRESS,
} from "@/utils/constants/certificate";
import { quizDatas } from "@/utils/constants/quiz";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { createNFTMetadataAction } from "../actions/db";
import { useMutation } from "@tanstack/react-query";
import { processGlifAction } from "../actions/tools";

function useProcessGlif() {
  const CERTIFICATE_GLIF = "cm09imbfh00004dbzfcch2w61";
  return useMutation({
    mutationFn: async (variables: { name: string; quiz: string }) =>
      processGlifAction(CERTIFICATE_GLIF, [variables.name, variables.quiz]),
  });
}

export default function Component() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [quizEnded, setQuizEnded] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const searchParams = useSearchParams();
  const quizId = Number(searchParams.get("id"));
  const { address } = useAccount();
  const {
    writeContract,
    data: hash,
    isPending: isPendingTx,
  } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({
    hash,
  });
  const router = useRouter();
  const {
    mutateAsync: genCertificateImageAsync,
    isPending: isGenCertificate,
    error,
    isError,
  } = useProcessGlif();
  const [certificateName, setCertificateName] = useState("");

  useEffect(() => {
    if (isSuccess) {
      console.log("NFT minted successfully:", hash);
      router.push("/profile");
    }
  }, [isSuccess]);

  const quizData =
    quizDatas.find((quiz) => quiz.id === quizId)?.questions || [];

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

  const mintNFTCredential = async () => {
    const quizTitle = quizDatas.find((quiz) => quiz.id === quizId)?.title;
    if (!quizTitle || !certificateName.trim()) {
      throw new Error("Invalid quiz data or certificate name");
    }

    // Step 1: Create image URL
    const imageData = await genCertificateImageAsync({
      name: certificateName,
      quiz: quizTitle ?? "AI TUTOR",
    });

    // Step 2: Create metadata URI
    const { id: tokenId } = await createNFTMetadataAction(
      `${quizTitle} Completion Certificate`,
      `Congratulations to ${certificateName} on completing the ${quizTitle} quiz!`,
      imageData.output
    );
    const tokenURI = `${BASE_URL}/api/?id=${tokenId}`;

    // Step 3: Mint NFT
    writeContract({
      address: CERTIFICATE_CONTRACT_ADDRESS,
      abi: CERTIFICATE_CONTRACT_ABI,
      functionName: "mintNFT",
      args: [address, tokenURI],
    });
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
                    <input
                      type="text"
                      placeholder="Enter name for the certificate"
                      className="mb-2 p-2 border border-gray-300 rounded w-full"
                      value={certificateName}
                      onChange={(e) => setCertificateName(e.target.value)}
                    />
                    <Button
                      onClick={mintNFTCredential}
                      disabled={
                        isGenCertificate ||
                        isPendingTx ||
                        !certificateName.trim()
                      }
                    >
                      {isGenCertificate || isPendingTx
                        ? "Minting..."
                        : "Mint NFT Credential"}
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
