"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { GENERATE_RESUME_COST } from "@/utils/constants";
import { useMutation } from "@tanstack/react-query";
import { Heart, Share2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { addXpAction, spendCreditsAction } from "../actions/db";
import { processGlifAction } from "../actions/tools";
import { useUserContext } from "../contexts/UserContext";

function useProcessGlif() {
  const RESUME_GLIF = "cm088lzdy00083vxrs7vpsc8r";
  return useMutation({
    mutationFn: (inputString: string) =>
      processGlifAction(RESUME_GLIF, [inputString, "resume"]),
  });
}

export default function Component() {
  const [resumeContent, setResumeContent] = useState("");
  const [liked, setLiked] = useState(false);
  const {
    mutate: processGlif,
    isPending,
    error,
    isError,
    data: generatedResumeUrl,
  } = useProcessGlif();
  const { user, refreshUser } = useUserContext();

  useEffect(() => {
    if (isError) {
      console.error("Error generating resume:", error);
      toast({
        title: "Error",
        description: "Failed to generate resume. Please try again.",
        variant: "destructive",
      });
    }
  }, [isError, error]);

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleShare = () => {
    // Placeholder for share functionality
    console.log("Sharing resume...");
  };

  return (
    <Card className="w-full max-w-6xl mx-auto h-[calc(100vh-124px)] flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-2xl font-bold">Resume Builder</h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={handleLike}>
            <Heart className={liked ? "fill-current text-red-500" : ""} />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleShare}>
            <Share2 />
          </Button>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 p-4 bg-yellow-100 flex flex-col">
          <Textarea
            placeholder="James Smith Experienced software developer with a passion for creating efficient and user-friendly applications. Skilled in multiple programming languages and frameworks, with a strong background in web development and database management. Senior Software Engineer Over 8 years of experience in software development, including 3 years as a team lead at TechCorp where I managed a team of 5 developers and successfully delivered 10+ major projects. Previously worked as a Full Stack Developer at InnoSoft for 5 years, contributing to the development of scalable web applications. maria.rossi@email.com +33 1 23 45 67 89 15 Rue de la Paix, 75002 Paris, France linkedin.com/in/mariarossi JavaScript, Python, Java, React, Node.js, SQL, Git, Agile methodologies, Cloud computing (AWS), Docker École Polytechnique Master's Degree Computer Science and Engineering 2015 Université Paris-Saclay Bachelor's Degree Computer Science 2013 French (Native), English (Fluent), Italian (Intermediate)"
            className="flex-1 mb-4 resize-none"
            value={resumeContent}
            onChange={(e) => setResumeContent(e.target.value)}
          />
          <Button
            onClick={async () => {
              if (user) {
                await addXpAction(user.address, GENERATE_RESUME_COST * 5);
                await spendCreditsAction(user.address, GENERATE_RESUME_COST);
                await refreshUser();

                processGlif(resumeContent);
              }
            }}
            className="w-full bg-black text-white hover:bg-gray-800"
            disabled={isPending || !resumeContent}
          >
            {isPending ? "Generating..." : "Generate Resume"}
          </Button>
          <span className="text-gray-400">
            🪄 {GENERATE_RESUME_COST} credits
          </span>
        </div>
        <div className="w-1/2 p-4 bg-white border-l flex flex-col">
          <h3 className="text-lg font-semibold mb-2">Generated Resume</h3>
          <div className="flex-1 overflow-y-auto flex items-center justify-center">
            {generatedResumeUrl ? (
              <div className="rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={generatedResumeUrl.output}
                  alt="Generated Resume"
                  width={500}
                  height={700}
                  objectFit="contain"
                />
              </div>
            ) : (
              <p className="text-gray-500">
                Your generated resume will appear here
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
