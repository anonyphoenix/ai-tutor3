"use client";

import { type CoreMessage } from "ai";
import { useEffect, useState } from "react";
import { readStreamableValue } from "ai/rsc";
import { continueConversation } from "../actions/ai";
import { Tutor } from "@/components/frontpage/section1";
import { fetchPublicBotsAction } from "../actions/db";
import { useSearchParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export default function Chat() {
  const [messages, setMessages] = useState<CoreMessage[]>([]);
  const [input, setInput] = useState("");
  const searchParams = useSearchParams();
  const botId = searchParams.get("botId");

  const [tutor, setTutor] = useState<Tutor | null>(null);

  useEffect(() => {
    const fetchTutor = async () => {
      if (!botId) return;

      try {
        const publicBots = await fetchPublicBotsAction();
        const selectedTutor: Tutor = publicBots.find(
          (t: { id: number }) => t.id === parseInt(botId)
        );
        setTutor(selectedTutor);

        if (selectedTutor) {
          const initialPrompt = `You are talking to ${selectedTutor.name}.`;
          const result = await continueConversation([
            { content: initialPrompt, role: "assistant" },
          ]);
          const welcomeMessage = await readStreamableValue(result);
          setMessages([
            { content: selectedTutor.prompt, role: "system" },
            { content: initialPrompt, role: "assistant" },
            // { content: welcomeMessage as string, role: "assistant" },
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch public bots:", error);
      }
    };

    fetchTutor();
  }, [botId]);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-hidden">
        <div className="h-full py-24 mx-auto max-w-xl">
          <ScrollArea className="h-full rounded-md border p-4">
            {messages.map((m, i) => (
              <div key={i} className="whitespace-pre-wrap">
                {m.role === "user" ? "User: " : "AI: "}
                {m.content as string}
              </div>
            ))}
          </ScrollArea>
        </div>
      </div>
      <div className="flex justify-center items-center p-4">
        <form
          className="w-full max-w-md"
          onSubmit={async (e) => {
            e.preventDefault();
            const newMessages: CoreMessage[] = [
              ...messages,
              { content: input, role: "user" },
            ];

            setMessages(newMessages);
            setInput("");

            const result = await continueConversation(newMessages);

            for await (const content of readStreamableValue(result)) {
              setMessages([
                ...newMessages,
                {
                  role: "assistant",
                  content: content as string,
                },
              ]);
            }
          }}
        >
          <input
            className="w-full p-2 border border-gray-300 rounded shadow-xl"
            value={input}
            placeholder="Say something..."
            onChange={(e) => setInput(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
}
