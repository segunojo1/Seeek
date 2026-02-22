import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  productService,
  MealRecommendation,
  MealPlan,
  BlogPost,
  BlogDetail,
  MealDetails,
} from "@/services/products.service";

// Reads the current user's email from the persisted user store to scope the cache
const getUserKey = (): string => {
  if (typeof window === "undefined") return "anonymous";
  try {
    const raw = localStorage.getItem("user-storage");
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed?.state?.user?.email || "anonymous";
    }
  } catch {
    /* ignore */
  }
  return "anonymous";
};

// Storage adapter that namespaces keys by user so each user has their own cache
const userScopedStorage = createJSONStorage(() => {
  if (typeof window === "undefined") {
    return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
  }
  return {
    getItem: (name: string) => localStorage.getItem(`${name}-${getUserKey()}`),
    setItem: (name: string, value: string) =>
      localStorage.setItem(`${name}-${getUserKey()}`, value),
    removeItem: (name: string) =>
      localStorage.removeItem(`${name}-${getUserKey()}`),
  };
});

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

  // Track which user the in-memory data belongs to
  _cachedUserKey: string;

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

export const useProductsStore = create<ProductsStore>()(
  persist(
    (set, get) => ({
      // Initial state
      recommendedMeals: [],
      mealPlan: null,
      blogs: [],
      currentBlog: null,
      currentMeal: null,
      isLoading: false,
      error: null,
      _cachedUserKey: getUserKey(),

      // Meal details actions
      setCurrentMeal: (meal) => set({ currentMeal: meal }),

      fetchMealDetails: async (mealName) => {
        const { isLoading, currentMeal } = get();
        // Skip if already loading or same meal is loaded
        if (isLoading) return null;
        if (currentMeal && currentMeal.meal_identity?.name === mealName)
          return currentMeal;
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
        const currentKey = getUserKey();
        const { isLoading, recommendedMeals, _cachedUserKey } = get();

        // If user changed, invalidate cached data
        if (_cachedUserKey !== currentKey) {
          set({ recommendedMeals: [], blogs: [], _cachedUserKey: currentKey });
        }

        // Skip if already loading or data already fetched for this user
        if (isLoading || get().recommendedMeals.length > 0) return;
        try {
          set({ isLoading: true, error: null });
          const meals = await productService.getRecommendedMeals();
          set({ recommendedMeals: meals, _cachedUserKey: currentKey });
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
        const currentKey = getUserKey();
        const { isLoading, blogs, _cachedUserKey } = get();

        // If user changed, invalidate cached data
        if (_cachedUserKey !== currentKey) {
          set({ recommendedMeals: [], blogs: [], _cachedUserKey: currentKey });
        }

        // Skip if already loading or data already fetched for this user
        if (isLoading || get().blogs.length > 0) return;
        try {
          set({ isLoading: true, error: null });
          const fetchedBlogs = await productService.getAllBlogs();
          set({ blogs: fetchedBlogs, _cachedUserKey: currentKey });
        } catch (error) {
          console.error("Error in fetchAllBlogs:", error);
          set({
            error:
              error instanceof Error ? error.message : "Failed to fetch blogs",
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
              error instanceof Error
                ? error.message
                : "Failed to fetch blog post",
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
    }),
    {
      name: "products-cache",
      storage: userScopedStorage,
      partialize: (state) => ({
        recommendedMeals: state.recommendedMeals,
        blogs: state.blogs,
        _cachedUserKey: state._cachedUserKey,
      }),
    },
  ),
);
