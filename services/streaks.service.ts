import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

export interface StreakData {
  $id: string;
  profileId: number;
  streakCount: number;
}

export class StreakService {
  private api: AxiosInstance;
  private static instance: StreakService;
  private readonly COOKIE_OPTIONS = {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    expires: 7 // 7 days
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

  public static getInstance(): StreakService {
    if (!StreakService.instance) {
      StreakService.instance = new StreakService();
    }
    return StreakService.instance;
  }

  private getProfileId(): string {
    const profileId = Cookies.get('profileId');
    if (!profileId) {
      throw new Error('Profile ID not found in cookies');
    }
    return profileId;
  }

  public async getStreakCount(): Promise<number> {
    try {
      const profileId = this.getProfileId();
      const response = await this.api.get<StreakData>(`/api/Streak/GetStreakCount/${profileId}`);
      return response.data?.streakCount || 0;
    } catch (error) {
      console.error('Error fetching streak count:', error);
      return 0;
    }
  }
}

export const streakService = StreakService.getInstance();