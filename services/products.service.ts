import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

export interface MealRecommendation {
  $id: string;
  name: string;
  course: string;
  description: string;
  imageUrl?: string;
}

export interface MealRecommendationsResponse {
  $id: string;
  $values: MealRecommendation[];
}

export interface BlogPost {
  $id: string;
  id: string;
  title: string;
  category: string;
  text: string;
}

export interface BlogResponse {
  $id: string;
  content: BlogPost[];
}

export interface MealPlan {
  id: string;
  name: string;
  description: string;
  meals: Array<{
    id: string;
    name: string;
    time: string;
    items: Array<{
      id: string;
      name: string;
      amount: string;
    }>;
  }>;
}

export interface NutritionInfo {
  calories: string;
  carbs: string;
  protein: string;
  fat: string;
  fiber: string;
  sodium: string;
}

export interface MealDetails {
  mealName: string;
  generalHealthScore: number;
  personalizedHealthScore: number;
  description: string;
  tags: {
    $id?: string;
    $values: string[];
  };
  nutrition: NutritionInfo;
  recipeSteps: {
    $id?: string;
    $values: string[];
  };
  usage: string;
  alternatives: {
    $id?: string;
    $values: string[];
  };
}

export class ProductService {
  private api: AxiosInstance;
  private static instance: ProductService;
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

  public static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  private getProfileId(): string {
    const profileId = Cookies.get('profileID');
    if (!profileId) {
      throw new Error('Profile ID not found in cookies');
    }
    return profileId;
  }

  public async getRecommendedMeals(): Promise<MealRecommendation[]> {
    try {
      const profileId = this.getProfileId();
      const response = await this.api.get<MealRecommendationsResponse>('/api/MealRecommendation/GenerateMeals', {
        params: { profileId }
      });
      return response.data?.$values || [];
    } catch (error) {
      console.error('Error fetching recommended meals:', error);
      return [];
    }
  }

  public async generateMealPlan(): Promise<MealPlan | null> {
    try {
      const profileId = this.getProfileId();
      const response = await this.api.get('/api/MealPlan/GenMeal', {
        params: { profileId }
      });
      return response.data || null;
    } catch (error) {
      console.error('Error generating meal plan:', error);
      return null;
    }
  }

  public async getAllBlogs(): Promise<BlogPost[]> {
    try {
      const response = await this.api.get<BlogResponse>('/api/Blog/GenerateAllBlogs');
      return response.data?.content || [];
    } catch (error) {
      console.error('Error fetching blogs:', error);
      return [];
    }
  }

  public async getBlogById(id: string): Promise<BlogPost | null> {
    try {
      const response = await this.api.get<BlogPost>(`/api/Blog/${id}`);
      return response.data || null;
    } catch (error) {
      console.error('Error fetching blog post:', error);
      return null;
    }
  }

  public async getMealDetails(mealName: string, profileId: string): Promise<{ data: MealDetails | null; error: string | null }> {
    try {
      const response = await this.api.get<MealDetails>('/api/MealRecommendation/generate', {
        params: { mealName, profileId }
      });

      // If we have data, return it regardless of isSuccessful flag
      if (response.data) {
        return { data: response.data, error: null };
      }
      
      return { data: null, error: 'No meal data received' };
    } catch (error: any) {
      console.error('Error fetching meal details:', error);
      return { 
        data: null, 
        error: error.response?.data?.message || 'Failed to fetch meal details' 
      };
    }
  }

    
}

export const productService = ProductService.getInstance();