"use client";

import { PaperPlaneIcon, ChatBubbleIcon, StopIcon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";
import { useAudioRecorder } from "@/hooks/use-audio-recorder";
import { Mic } from "lucide-react";


export interface Message {
  role: "agent" | "user";
  content: string;
}

export function ChatbotTabs() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "agent", content: "Hi, how can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const { isRecording, startRecording, stopRecording, isSendingAudio } = useAudioRecorder();

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isSendingAudio) {
      const typingMessage: Message = { role: "agent", content: "..." };
      setMessages((prevMessages) => [...prevMessages, { role: "user", content: "Sent audio message" }]);
      setMessages((prevMessages) => [...prevMessages, typingMessage]);
    } else {
      setMessages((prevMessages) => prevMessages.map((msg) => msg.content === "..." ? { ...msg, content: "Audio message received" } : msg));
    }
  }, [isSendingAudio]);


  const toggleChatbot = () => {
    if (isOpen) {
      setIsOpen(false);
      setTimeout(() => setIsVisible(false), 300);
    } else {
      setIsVisible(true);
      setIsOpen(true);
    }
  };

  const handleMessageSend = async (event: React.FormEvent) => {
    event.preventDefault();
    if (input.trim() === "") return;

    const userMessage: Message = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");

    // Show typing indicator
    const typingMessage: Message = { role: "agent", content: "..." };
    setMessages((prevMessages) => [...prevMessages, typingMessage]);

    try {
      const response = await fetch("/api/text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prevMessages) => [
          ...prevMessages.slice(0, -1), // Remove typing indicator
          { role: "agent", content: data.reply },
        ]);
      } else {
        console.error("Failed to send message");
        setMessages((prevMessages) => [
          ...prevMessages.slice(0, -1), // Remove typing indicator
          { role: "agent", content: "Sorry, something went wrong." },
        ]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prevMessages) => [
        ...prevMessages.slice(0, -1), // Remove typing indicator
        { role: "agent", content: "Sorry, something went wrong." },
      ]);
    }
  };

  return (
    <>
      <Button
        className={`fixed ${isOpen ? "hidden" : ""} bottom-10 right-10 z-50 rounded-full bg-primary text-white shadow-lg`}
        onClick={toggleChatbot}
      >
        <ChatBubbleIcon className="h-6 w-6" />
      </Button>

      {isVisible && (
        <Card className={`transition-all duration-500 ease-in-out transform ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} w-full h-full md:h-fit flex flex-col md:max-w-sm mx-auto fixed md:bottom-12 md:right-10 z-40`}>
          <ChatHeader toggleChatbot={toggleChatbot} />
          <hr className="border-t border-divider" />
          <CardContent className="flex flex-col flex-1 md:flex-auto md:h-80 overflow-y-hidden px-0">
            <ChatMessages messages={messages} messageEndRef={messageEndRef} />
          </CardContent>
          <CardFooter>
            <form onSubmit={handleMessageSend} className="flex w-full items-center space-x-2">
              <Input
                id="message"
                placeholder="Type your message..."
                className="flex-1"
                autoComplete="off"
                value={input}
                onChange={(event) => setInput(event.target.value)}
              />
              <Button type="submit" size="icon" disabled={!input.trim()}>
                <PaperPlaneIcon className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>

              <Button
                type="button"
                size="icon"
                onClick={isRecording ? stopRecording : startRecording}
                className={isRecording ? "bg-red-500" : ""}
              >
                {isRecording ? <StopIcon className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                <span className="sr-only">{isRecording ? "Stop Recording" : "Record Audio"}</span>
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
