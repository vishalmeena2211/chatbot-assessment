"use client"

import { PaperPlaneIcon, ChatBubbleIcon, Cross1Icon } from "@radix-ui/react-icons"; // Import ChatIcon for the floating button
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useRef, useState } from "react";

export function ChatbotTabs() {
  const [messages, setMessages] = useState([
    { role: "agent", content: "Hi, how can I help you today?" },
    { role: "user", content: "Hey, I'm having trouble with my account." },
    { role: "agent", content: "What seems to be the problem?" },
    { role: "user", content: "I can't log in." },
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false); // State to manage chatbot visibility
  const [isVisible, setIsVisible] = useState(false); // State to manage visibility with transition

  const handleMessageSend = (event) => {
    event.preventDefault();
    if (input.trim() === "") return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: input },
    ]);
    setInput("");
  };

  const messageEndRef = useRef(null); // Create a ref for the end of the messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleChatbot = () => {
    if (isOpen) {
      setIsOpen(false);
      setTimeout(() => setIsVisible(false), 300); // Delay hiding to allow transition
    } else {
      setIsVisible(true);
      setIsOpen(true);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <Button
        className={`fixed ${isOpen ? "hidden" : ""} bottom-10 right-10 z-50 rounded-full bg-primary text-white shadow-lg`}
        onClick={toggleChatbot} // Toggle chatbot visibility
      >
        <ChatBubbleIcon className="h-6 w-6" />
      </Button>

      {/* Chatbot Component */}
      {isVisible && ( // Render chatbot only if visible
        <Card
          className={`transition-all duration-500 ease-in-out transform ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            } w-full h-full md:h-fit flex flex-col md:max-w-sm mx-auto fixed md:bottom-12 md:right-10 z-40`}
        >
          <CardHeader className="flex flex-row items-center p-3">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="/avatars/01.png" alt="Image" />
                <AvatarFallback>OM</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">Sofia Davis</p>
                <p className="text-sm text-muted-foreground">m@example.com</p>
              </div>
            </div>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    className="ml-auto rounded-full"
                    onClick={toggleChatbot} // Toggle close button
                  >
                    <Cross1Icon className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent sideOffset={10}>Close</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardHeader>
          <hr />
          <CardContent className="flex flex-col flex-1 md:flex-auto md:h-80 overflow-y-hidden px-0">
            <div className="flex-1 space-y-4 overflow-y-scroll w-full px-3 py-2">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                    message.role === "user"
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {message.content}
                </div>
              ))}
              <div ref={messageEndRef} /> {/* Scroll target */}
            </div>
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
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
