"use client";

import ChatInputForm from "@/components/home/chat-input-form";
import { HelpCircle } from "lucide-react";
import Image from "../../../frontend/node_modules/next/image";
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
    <div className="w-full flex flex-col items-center bg-[#FAFAFA] dark:bg-[#262626] h-screen overflow-hidden">
      <div className="flex-shrink-0 pt-4">
        <Image
          src="/assets/logo.png"
          alt=""
          width={103}
          height={90}
          className="mx-auto"
        />
      </div>

      <div className="flex flex-col flex-1 min-h-0 w-full max-w-[750px] pb-4">
        <div className="flex-1 min-h-0 overflow-hidden">
          {messages.length === 0 ? (
            <WelcomeScreen onSend={handleSend} />
          ) : (
            <ChatMessageList
              messages={messages}
              isLoading={isLoading}
              onSend={handleSend}
            />
          )}
        </div>
        <div className="flex-shrink-0">
          <ChatInputForm onSend={handleSend} disabled={isLoading} />
        </div>
      </div>
      <HelpCircle className="absolute bottom-5 right-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
    </div>
  );
};

export default Chat;
