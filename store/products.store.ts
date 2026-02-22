import { create } from "zustand";
import {
  productService,
  MealRecommendation,
  MealPlan,
  BlogPost,
  BlogDetail,
  MealDetails,
} from "@/services/products.service";

interface ProductsStore {
  // Existing meal-related state
  recommendedMeals: MealRecommendation[];
  mealPlan: MealPlan | null;

  // Blog-related state
  blogs: BlogPost[];
  currentBlog: BlogDetail | null;

  // Common state
  isLoading: boolean;
  error: string | null;

  // Meal actions
  fetchRecommendedMeals: () => Promise<void>;
  generateMealPlan: () => Promise<void>;
  setRecommendedMeals: (meals: MealRecommendation[]) => void;
  setMealPlan: (plan: MealPlan | null) => void;

  // Blog actions
  fetchAllBlogs: () => Promise<void>;

  currentMeal: MealDetails | null;
  fetchMealDetails: (mealName: string) => Promise<MealDetails | null>;
  setCurrentMeal: (meal: MealDetails | null) => void;
  fetchBlogDetail: (blog: BlogPost) => Promise<BlogDetail | null>;
  setCurrentBlog: (blog: BlogDetail | null) => void;

  // Common actions
  clearError: () => void;
}

export const useProductsStore = create<ProductsStore>((set, get) => ({
  // Initial state
  recommendedMeals: [],
  mealPlan: null,
  blogs: [],
  currentBlog: null,
  currentMeal: null,
  isLoading: false,
  error: null,

  // Meal details actions
  setCurrentMeal: (meal) => set({ currentMeal: meal }),

  fetchMealDetails: async (mealName) => {
    const { isLoading, currentMeal } = get();
    // Skip if already loading or same meal is loaded
    if (isLoading) return null;
    if (currentMeal && currentMeal.mealName === mealName) return currentMeal;
    try {
      set({ isLoading: true, error: null });

      const { data, error } = await productService.getMealDetails(mealName);

      if (error) {
        console.warn("Error in meal details response:", error);
        // Continue even if there's an error, as we want to try to display what we have
      }

      if (data) {
        set({ currentMeal: data });
        return data;
      }

      // If we get here, there was no data and no error was thrown
      throw new Error("No meal data available");
    } catch (error) {
      console.error("Error in fetchMealDetails:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch meal details",
        currentMeal: null,
      });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchRecommendedMeals: async () => {
    const { isLoading, recommendedMeals } = get();
    // Skip if already loading or data already fetched
    if (isLoading || recommendedMeals.length > 0) return;
    try {
      set({ isLoading: true, error: null });
      const meals = await productService.getRecommendedMeals();
      set({ recommendedMeals: meals });
    } catch (error) {
      console.error("Error in fetchRecommendedMeals:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch recommended meals",
        recommendedMeals: [],
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // generateMealPlan is not currently available
  generateMealPlan: async () => {
    console.warn("generateMealPlan is not implemented yet");
  },

  setRecommendedMeals: (meals: MealRecommendation[]) => {
    set({ recommendedMeals: meals });
  },

  setMealPlan: (plan: MealPlan | null) => {
    set({ mealPlan: plan });
  },

  clearError: () => {
    set({ error: null });
  },

  // Blog actions
  fetchAllBlogs: async () => {
    const { isLoading, blogs } = get();
    if (isLoading || blogs.length > 0) return;
    try {
      set({ isLoading: true, error: null });
      const fetchedBlogs = await productService.getAllBlogs();
      set({ blogs: fetchedBlogs });
    } catch (error) {
      console.error("Error in fetchAllBlogs:", error);
      set({
        error: error instanceof Error ? error.message : "Failed to fetch blogs",
        blogs: [],
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchBlogDetail: async (blog: BlogPost) => {
    try {
      set({ isLoading: true, error: null });
      const detail = await productService.getBlogDetail(blog);
      if (detail) {
        set({ currentBlog: detail });
      }
      return detail;
    } catch (error) {
      console.error("Error in fetchBlogDetail:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch blog post",
        currentBlog: null,
      });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  setCurrentBlog: (blog: BlogDetail | null) => {
    set({ currentBlog: blog });
  },
}));
