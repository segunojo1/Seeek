"use client";

import ChatInputForm from "@/components/home/chat-input-form";
import { HelpCircle } from "lucide-react";
import Image from "next/image";
import { useChatStore } from "@/store/chat.store";
import { ChatMessageList } from "@/components/chats/message-list";
import { WelcomeScreen } from "@/components/chats/welcome-screen";

const Chat = () => {
  const { messages, isLoading, sendMessage } = useChatStore();

  const handleSend = async (message: string) => {
    if (!message.trim()) return;
    await sendMessage(message);
  };

  return (
    <div className="w-full flex flex-col items-center bg-[#FAFAFA] dark:bg-[#262626] max-h-screen h-full">
      <Image
        src="/assets/logo.png"
        alt=""
        width={103}
        height={90}
        className="mx-auto mb-[55px]"
      />

      <div className="flex flex-col justify-between h-full max-w-[750px] pb-10">
        {messages.length === 0 ? (
          <WelcomeScreen onSend={handleSend} />
        ) : (
          <ChatMessageList messages={messages} isLoading={isLoading} />
        )}
        <ChatInputForm onSend={handleSend} disabled={isLoading} />
      </div>
      <HelpCircle className="absolute bottom-5 right-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
    </div>
  );
};

export default Chat;
