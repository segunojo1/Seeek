import { ChatMessage } from '@/lib/types';
import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

export class ChatService {
  private api: AxiosInstance;
  private static instance: ChatService;
  private readonly COOKIE_OPTIONS = {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    expires: 7
  };

  private constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use(
      (config) => {
        const token = Cookies.get('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  private getProfileId(): string {
    const profileId = Cookies.get('profileID');
    if (!profileId) {
      throw new Error('Profile ID not found in cookies');
    }
    return profileId;
  }

  public async sendMessage(message: string): Promise<ChatMessage> {
    try {
      const profileId = this.getProfileId();
      const response = await this.api.post('/api/ChatBot/ChatBot', null, {
        params: {
          profileId,
          request: message,
        },
      });

      return {
        role: 'assistant',
        content: response.data || 'No response from server',
      };
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  public async getPreviousInteractions(): Promise<ChatMessage[]> {
    try {
      const profileId = this.getProfileId();
      const response = await this.api.get('/api/ChatBot/PreviousInteractions', {
        params: { id: profileId }
      });

      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching previous interactions:', error);
      return [];
    }
  }
}

export const chatService = ChatService.getInstance();