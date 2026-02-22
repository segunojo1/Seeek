import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";

export interface MealRecommendation {
  meal_name: string;
  origin: string;
  description: string;
  health_score: number;
  key_benefits: string[];
  why_it_fits: string;
}

export interface MealRecommendationsResponse {
  response: {
    recommendations: MealRecommendation[];
  };
}

export interface BlogPost {
  title: string;
  category: string;
  brief_outline: string;
  estimated_reading_time: string;
  target_audience: string;
}

export interface BlogResponse {
  blog_topics: BlogPost[];
}

export interface BlogDetail {
  title: string;
  content: string;
  seo_keywords: string[];
  word_count: number;
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

export interface MealDetails {
  meal_identity: {
    name: string;
    origin: string;
    estimated_calories: string;
  };
  ingredient_list: string[];
  nutritional_deconstruction: {
    macros: string;
    glycemic_index_estimate: string;
    key_vitamins_minerals: string[];
  };
  health_impact_metrics: {
    overall_score: number;
    digestive_load: string;
    energy_sustainability: string;
  };
  personalized_optimizations: Array<{
    original_ingredient: string;
    recommended_swap: string;
    benefit_to_user_goals: string;
  }>;
  risk_and_ailment_report: Array<{
    potential_issue: string;
    trigger_ingredient: string;
    mitigation_strategy: string;
  }>;
}

export interface ImageScanRiskItem {
  ailment: string;
  trigger_ingredient: string;
  severity_level: string;
}

export interface ImageScanAlternative {
  original_component: string;
  suggestion: string;
  goal_benefit: string;
  cultural_relevance: string;
}

export interface ImageScanResponse {
  response: {
    identified_dish: string;
    identified_ingredients: string[];
    risk_assessment: ImageScanRiskItem[];
    educational_questions: string[];
    personalized_alternatives: ImageScanAlternative[];
    detailed_information_about_the_dish: string;
  };
}

export interface QrCodeAnalysisResponse {
  response: {
    identified_dish: string;
    identified_ingredients: string[];
    risk_assessment: ImageScanRiskItem[];
    educational_questions: string[];
    personalized_alternatives: ImageScanAlternative[];
    detailed_information_about_the_dish: string;
  };
}

export class ProductService {
  private api: AxiosInstance;
  private static instance: ProductService;
  private readonly COOKIE_OPTIONS = {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    expires: 7, // 7 days
  };

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

  public static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  public async getRecommendedMeals(): Promise<MealRecommendation[]> {
    try {
      const response = await this.api.get<MealRecommendationsResponse>(
        "/api/v1/recommendMeals",
      );
      return response.data?.response?.recommendations || [];
    } catch (error) {
      console.error("Error fetching recommended meals:", error);
      return [];
    }
  }

  // private getProfileId(): string {
  //   const profileId = Cookies.get("profileID");
  //   if (!profileId) {
  //     throw new Error("Profile ID not found in cookies");
  //   }
  //   return profileId;
  // }

  // public async generateMealPlan(): Promise<MealPlan | null> {
  //   try {
  //     const profileId = this.getProfileId();
  //     const response = await this.api.get("/api/MealPlan/GenMeal", {
  //       params: { profileId },
  //     });
  //     return response.data || null;
  //   } catch (error) {
  //     console.error("Error generating meal plan:", error);
  //     return null;
  //   }
  // }

  public async getAllBlogs(): Promise<BlogPost[]> {
    try {
      const response = await this.api.get<BlogResponse>("/api/v1/blog");
      return response.data?.blog_topics || [];
    } catch (error) {
      console.error("Error fetching blogs:", error);
      return [];
    }
  }

  public async getBlogDetail(blog: BlogPost): Promise<BlogDetail | null> {
    try {
      const response = await this.api.post<BlogDetail>("/api/v1/blog", {
        topic: blog.title,
        category: blog.category,
        reading_time: blog.estimated_reading_time,
        target_audience: blog.target_audience,
      });
      return response.data || null;
    } catch (error) {
      console.error("Error fetching blog detail:", error);
      return null;
    }
  }

  public async getMealDetails(
    mealName: string,
  ): Promise<{ data: MealDetails | null; error: string | null }> {
    try {
      const response = await this.api.post<{ response: MealDetails }>(
        "/api/v1/getAnalysis",
        {
          mealName,
        },
      );

      const mealData = (response.data as any)?.response ?? response.data;
      if (mealData?.meal_identity) {
        return { data: mealData as MealDetails, error: null };
      }

      return { data: null, error: "No meal data received" };
    } catch (error: any) {
      console.error("Error fetching meal details:", error);
      return {
        data: null,
        error: error.response?.data?.message || "Failed to fetch meal details",
      };
    }
  }

  public async scanImage(
    file: File,
  ): Promise<{ data: ImageScanResponse | null; error: string | null }> {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await this.api.post<ImageScanResponse>(
        "/api/v1/imageScan",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data) {
        return { data: response.data, error: null };
      }

      return { data: null, error: "No scan data received" };
    } catch (error: any) {
      console.error("Error scanning image:", error);
      return {
        data: null,
        error: error.response?.data?.message || "Failed to scan image",
      };
    }
  }

  public async analyzeQrCode(
    scanData: string,
    userProfile: { allergies: string[]; isPregnant: boolean },
  ): Promise<{ data: QrCodeAnalysisResponse | null; error: string | null }> {
    try {
      const response = await this.api.post<QrCodeAnalysisResponse>(
        "/api/v1/analyzeQrCode",
        { scanData, userProfile },
      );

      if (response.data) {
        return { data: response.data, error: null };
      }

      return { data: null, error: "No QR code analysis data received" };
    } catch (error: any) {
      console.error("Error analyzing QR code:", error);
      return {
        data: null,
        error:
          error.response?.data?.message || "Failed to analyze QR code data",
      };
    }
  }
}

export const productService = ProductService.getInstance();
