import React from "react";
import { Message } from "./chatbot-tabs";

export function ChatMessages({ messages, messageEndRef }: { messages: Message[]; messageEndRef: React.RefObject<HTMLDivElement> }) {


  return (
    <div className="flex-1 space-y-4 overflow-y-scroll w-full px-3 py-2">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm ${message.role === "user"
              ? "ml-auto bg-primary text-primary-foreground"
              : "bg-muted"
            }`}
        >
          {message.content}
        </div>
      ))}
      <div ref={messageEndRef} />
    </div>
  );
}
