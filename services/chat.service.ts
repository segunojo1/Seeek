import { ChatMessage } from "@/lib/types";
import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";

export class ChatService {
  private api: AxiosInstance;
  private static instance: ChatService;

  private constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.api.interceptors.request.use(
      (config) => {
        const token = Cookies.get("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );
  }

  public static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  /**
   * Build a chatHistory string array from messages.
   * Format: ["User: ...", "Model: ...", ...]
   */
  private buildChatHistory(messages: ChatMessage[]): string[] {
    return messages.map((msg) => {
      const prefix = msg.role === "user" ? "User" : "Model";
      return `${prefix}: ${msg.content}`;
    });
  }

  public async sendMessage(
    currentMessage: string,
    previousMessages: ChatMessage[],
  ): Promise<ChatMessage> {
    try {
      const chatHistory = this.buildChatHistory(previousMessages);

      const response = await this.api.post("/api/v1/sendChat", {
        chatHistory,
        currentMessage,
      });

      const data = response.data;

      // The API wraps everything under response.data.response
      const payload = data?.response || data;

      // Extract the text content
      let content: string;
      if (typeof payload === "string") {
        content = payload;
      } else if (payload?.chat_response) {
        content = payload.chat_response;
      } else {
        content = "No response from server";
      }

      return {
        role: "assistant",
        content,
        recommended_meals: payload?.recommended_meals || undefined,
        follow_up_suggestions: payload?.follow_up_suggestions || undefined,
      };
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }
}

export const chatService = ChatService.getInstance();
