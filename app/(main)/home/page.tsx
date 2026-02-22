"use client";
import Calendar from "@/components/home/Calendar";
import ChatInputForm from "@/components/home/chat-input-form";
import Streaks from "@/components/home/streaks";
import { Clock } from "lucide-react";
import Image from "../../../frontend/node_modules/next/image";
import {
  useRouter,
  useSearchParams,
} from "../../../frontend/node_modules/next/navigation";
import Recents from "@/components/home/recents";
import RecommendedProducts from "@/components/home/recommended-products";
import { useChatStore } from "@/store/chat.store";
import { useUserStore } from "@/store/user.store";

const HomePage = () => {
  const searchParams = useSearchParams();
  const { sendMessage } = useChatStore();
  const { user } = useUserStore();

  const route = useRouter();
  const handleSend = async (message: string) => {
    route.push("/chat");
    if (!message.trim()) return;
    await sendMessage(message);
  };
  return (
    <div className="w-full flex flex-col items-center bg-[#FAFAFA] dark:bg-[#262626]">
      <Image
        src="/assets/logo.png"
        alt=""
        width={103}
        height={90}
        className="mx-auto mb-[55px]"
      />
      <div className="flex items-center gap-5 mb-[51px]">
        <Image
          src="/assets/user-dark.svg"
          alt=""
          width={45}
          height={45}
          className=""
        />
        <h1 className="text-[30px]/[120%] font-bold satoshi">
          What are you curious about today, {user?.firstName || "there"}?{" "}
        </h1>
      </div>
      <div className="flex flex-col items-start ">
        <ChatInputForm onSend={handleSend} />
        <Recents />
        <RecommendedProducts />
        <div className="flex items-center justify-between w-full mt-[50px] mb-[30px]">
          <div className="text-[#A3A3A3] flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4" />
            <p className="text-sm font-medium">Streaks</p>
          </div>

          <div className="text-[#A3A3A3] flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4" />
            <p className="text-sm font-medium">Routine</p>
          </div>
        </div>
        <div className="flex bg-white dark:bg-[#2C2C2C] p-4 rounded-md items-center justify-between w-full">
          <Streaks />
          <div className="w-[1px] h-[226px] bg-[#F0F0EF] dark:bg-[#404040] mx-[24px]"></div>
          <Calendar />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
