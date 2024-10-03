import { ChatbotTabs } from "@/components/chatbot-tabs";
import { RocketIcon } from "lucide-react";


export default function Home() {
  return (
    <div className='flex flex-col justify-center items-center h-screen w-screen bg-gray-100'>
      <div className='bg-white p-6 rounded-lg shadow-lg text-center'>
        <RocketIcon className='text-6xl text-blue-500 mb-4' />
        <p className='mb-4 text-lg font-semibold'>
          Please click the floating icon to open the chatbot and chat with it.
        </p>
      </div>
      <ChatbotTabs />
    </div>
  );
}
