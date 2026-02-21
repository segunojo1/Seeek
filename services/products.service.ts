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
      const response = await this.api.get<BlogResponse>(
        "/api/Blog/GenerateAllBlogs",
      );
      return response.data?.content || [];
    } catch (error) {
      console.error("Error fetching blogs:", error);
      return [];
    }
  }

  public async getBlogById(id: string): Promise<BlogPost | null> {
    try {
      const response = await this.api.get<BlogPost>(`/api/Blog/${id}`);
      return response.data || null;
    } catch (error) {
      console.error("Error fetching blog post:", error);
      return null;
    }
  }

  public async getMealDetails(
    mealName: string,
  ): Promise<{ data: MealDetails | null; error: string | null }> {
    try {
      const response = await this.api.post<MealDetails>("/api/v1/getAnalysis", {
        mealName,
      });

      if (response.data) {
        return { data: response.data, error: null };
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
  ): Promise<{ data: QrCodeAnalysisResponse | null; error: string | null }> {
    try {
      const response = await this.api.post<QrCodeAnalysisResponse>(
        "/api/v1/analyzeQrCode",
        { scanData },
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
